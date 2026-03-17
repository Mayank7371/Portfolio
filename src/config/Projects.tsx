import Github from '@/components/technologies/Github';
import NextJs from '@/components/technologies/NextJs';
import ReactIcon from '@/components/technologies/ReactIcon';
import TypeScript from '@/components/technologies/TypeScript';
import { Project } from '@/types/project';

const CIcon = () => (
  <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-[10px] font-bold text-white">
    C
  </span>
);

export const projects: Project[] = [
  {
    title: 'Multithreaded Proxy Server',
    description:
      'High-performance HTTP/HTTPS proxy server in C supporting concurrent clients via pthreads and LRU caching for efficient resource management',
    image: '/project/multithreaded-proxy-server.png',
    link: 'https://github.com/Mayank7371/Multithreaded-proxy-server',
    technologies: [
      { name: 'C', icon: <CIcon key="c" /> },
      { name: 'pthreads', icon: <CIcon key="pthreads" /> },
      { name: 'GitHub', icon: <Github key="github" /> },
    ],
    github: 'https://github.com/Mayank7371/Multithreaded-proxy-server',
    live: 'https://github.com/Mayank7371/Multithreaded-proxy-server',
    details: false,
    projectDetailsPageSlug: '#',
    isWorking: true,
  },
  {
    title: 'nextAI',
    description:
      'AI-powered web application built with Next.js and TypeScript, leveraging modern AI APIs to deliver intelligent and interactive user experiences',
    image: '/project/nextai.png',
    link: 'https://github.com/Mayank7371/nextAI',
    technologies: [
      { name: 'Next.js', icon: <NextJs key="nextjs" /> },
      { name: 'TypeScript', icon: <TypeScript key="typescript" /> },
      { name: 'React', icon: <ReactIcon key="react" /> },
    ],
    github: 'https://github.com/Mayank7371/nextAI',
    live: 'https://github.com/Mayank7371/nextAI',
    details: false,
    projectDetailsPageSlug: '#',
    isWorking: true,
  },
];
