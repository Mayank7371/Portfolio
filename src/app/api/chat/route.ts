import { systemPrompt } from '@/config/ChatPrompt';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';

// Groq models (primary - 14,400 req/day free)
const GROQ_MODELS = ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile'];

// OpenRouter models (fallback)
const OPENROUTER_MODELS = [
  'openai/gpt-oss-20b:free',
  'qwen/qwen3-4b:free',
  'mistralai/mistral-small-3.1-24b-instruct:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'meta-llama/llama-3.2-3b-instruct:free',
];

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      }),
    )
    .optional()
    .default([]),
});

function sanitizeInput(input: string): string {
  const injectionPatterns = [
    /ignore previous instructions/gi,
    /system prompt/gi,
    /you are now/gi,
    /act as/gi,
    /pretend to be/gi,
    /ignore all previous/gi,
    /forget everything/gi,
    /new instructions/gi,
    /override/gi,
    /bypass/gi,
    /hack/gi,
    /exploit/gi,
    /inject/gi,
    /prompt injection/gi,
    /system message/gi,
    /role play/gi,
    /persona/gi,
    /behave as/gi,
    /respond as/gi,
  ];

  let sanitized = input;
  injectionPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  });
  sanitized = sanitized.trim().replace(/\s+/g, ' ');
  if (sanitized.length > 2000) sanitized = sanitized.substring(0, 2000);
  return sanitized;
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIP) return realIP;
  if (cfConnectingIP) return cfConnectingIP;
  return 'unknown';
}

function checkRateLimit(clientIP: string): {
  allowed: boolean;
  remaining: number;
} {
  const now = Date.now();
  const clientData = rateLimitStore.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    rateLimitStore.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  clientData.count++;
  rateLimitStore.set(clientIP, clientData);
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - clientData.count,
  };
}

function buildSSEStream(response: Response): ReadableStream {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        if (!response.body) throw new Error('No response body');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;

            const data = line.slice(6).trim();
            if (data === '[DONE]') {
              controller.enqueue(encoder.encode('data: {"done": true}\n\n'));
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              const text = parsed?.choices?.[0]?.delta?.content;
              if (text) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text })}\n\n`),
                );
              }
            } catch {
              // skip malformed chunks
            }
          }
        }

        controller.enqueue(encoder.encode('data: {"done": true}\n\n'));
        controller.close();
      } catch (error) {
        console.error('Streaming error:', error);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`,
          ),
        );
        controller.close();
      }
    },
  });
}

async function tryGroq(messages: object[]): Promise<Response | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  for (const model of GROQ_MODELS) {
    const attempt = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          stream: true,
          max_tokens: 512,
          temperature: 0.7,
        }),
      },
    );

    if (attempt.ok) return attempt;

    const err = await attempt.text();
    console.warn(`Groq model ${model} failed (${attempt.status}):`, err);

    if (![429, 503].includes(attempt.status)) return null;
  }

  return null;
}

async function tryOpenRouter(messages: object[]): Promise<Response | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  for (const model of OPENROUTER_MODELS) {
    const attempt = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer':
            process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
          'X-Title': 'Portfolio Assistant',
        },
        body: JSON.stringify({
          model,
          messages,
          stream: true,
          max_tokens: 512,
          temperature: 0.7,
        }),
      },
    );

    if (attempt.ok) return attempt;

    const err = await attempt.text();
    console.warn(`OpenRouter model ${model} failed (${attempt.status}):`, err);

    if (![400, 404, 429].includes(attempt.status)) return null;
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: RATE_LIMIT_WINDOW / 1000,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': (Date.now() + RATE_LIMIT_WINDOW).toString(),
          },
        },
      );
    }

    const body = await request.json();
    const validatedData = chatSchema.parse(body);

    const messages = [
      { role: 'system', content: systemPrompt },
      ...validatedData.history.map((msg) => ({
        role: msg.role,
        content: msg.role === 'user' ? sanitizeInput(msg.content) : msg.content,
      })),
      { role: 'user', content: sanitizeInput(validatedData.message) },
    ];

    // Try Groq first, then fall back to OpenRouter
    const response =
      (await tryGroq(messages)) ?? (await tryOpenRouter(messages));

    if (!response) {
      return NextResponse.json(
        {
          error:
            'All AI providers are currently unavailable. Please try again later.',
        },
        { status: 503 },
      );
    }

    const stream = buildSSEStream(response);

    return new NextResponse(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
