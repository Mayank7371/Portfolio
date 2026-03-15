# Mayank's Portfolio

A modern, responsive developer portfolio built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Shadcn UI**.  
This portfolio showcases projects, blog posts, experience, and provides a contact form with Telegram integration.

![Portfolio Preview](/public/meta/hero.png)

---

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Shadcn UI
- MDX
- Umami Analytics

---

## Prerequisites

Before running the project locally, ensure you have:

- Node.js (v18 or higher)
- Bun (recommended) or npm

---

## Environment Variables

Create a `.env` file in the root directory:

```env
TELEGRAM_BOT_TOKEN="your-token"
TELEGRAM_CHAT_ID="your-chat-id"
GEMINI_API_KEY="your-api-key"
NODE_ENV="development"
NEXT_PUBLIC_URL="http://localhost:3000"
NEXT_PUBLIC_UMAMI_SRC="your-umami-script-url"
NEXT_PUBLIC_UMAMI_ID="your-umami-website-id"
```

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Mayank7371/portfolio.git
cd portfolio
```

Install dependencies:

```bash
# using bun
bun install

# using npm
npm install
```

Run the development server:

```bash
# bun
bun dev

# npm
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Project Configuration

The project content is configured in:

```
src/config/
```

Files include:

- About.tsx
- Contact.tsx
- Experience.tsx
- Footer.tsx
- Gears.tsx
- Hero.tsx
- Meta.tsx
- Navbar.tsx
- Projects.tsx
- Quote.ts
- Resume.ts
- Setup.tsx

---

## Adding Blog Posts

1. Create a new `.mdx` file in:

```
src/data/blog/
```

2. Add metadata and content.
3. Add the thumbnail in:

```
public/blog/
```

---

## Adding Projects

1. Create a new `.mdx` file in:

```
src/data/projects/
```

2. Add metadata and project content.
3. Add the thumbnail in:

```
public/project/
```

---

## Connect With Me

Twitter  
https://x.com/mayanktwt07

LinkedIn  
https://www.linkedin.com/in/mayank-kumar-795105266/

GitHub  
https://github.com/Mayank7371

Email  
neprone.dev@gmail.com

---
