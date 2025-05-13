import { User, Code, BookOpen, Briefcase, Award, Star, Linkedin, Github, Mail, Cpu, Server, Brain, ShieldCheck, Database, Cloud, Settings } from 'lucide-react';
import type React from 'react';

// Types for data structures
export interface Skill {
  name: string;
  level?: number; // Optional: 0-100 for progress bar
  icon?: React.ElementType; // Lucide icon component
  category: 'Language' | 'Framework/Library' | 'Tool' | 'Database' | 'Cloud' | 'Other';
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  description?: string;
  icon?: React.ElementType;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  liveLink?: string;
  repoLink?: string;
  dataAiHint?: string;
}

export interface Certification {
  name:string;
  organization: string;
  date: string;
  verifyLink?: string;
  icon?: React.ElementType;
}

// Mock Data
export const aboutData = {
  professionalSummary: "I am a dedicated and enthusiastic B.Tech Computer Science student with a strong foundation in software development, problem-solving, and [mention 1-2 key areas like web technologies, data structures, algorithms]. I am passionate about creating impactful technology solutions and continuously expanding my knowledge in the ever-evolving tech landscape. Eager to contribute to innovative projects and collaborate with like-minded professionals.",
  bio: "Beyond coding, I enjoy [mention a hobby or interest, e.g., contributing to open-source projects, exploring new AI advancements, playing chess]. I believe in lifelong learning and am always seeking new challenges to grow both personally and professionally. My goal is to leverage my technical skills to make a positive impact.",
  profileImageUrl: "https://picsum.photos/seed/profile/300/300",
  dataAiHint: "professional portrait",
};

export const skillsData: Skill[] = [
  { name: 'JavaScript', level: 90, icon: Cpu, category: 'Language' },
  { name: 'Python', level: 85, icon: Cpu, category: 'Language' },
  { name: 'Java', level: 75, icon: Cpu, category: 'Language' },
  { name: 'React.js', level: 90, icon: Code, category: 'Framework/Library' },
  { name: 'Next.js', level: 88, icon: Code, category: 'Framework/Library' },
  { name: 'Node.js', level: 80, icon: Server, category: 'Framework/Library' },
  { name: 'Express.js', level: 78, icon: Server, category: 'Framework/Library' },
  { name: 'SQL (PostgreSQL, MySQL)', level: 70, icon: Database, category: 'Database' },
  { name: 'MongoDB', level: 65, icon: Database, category: 'Database' },
  { name: 'Git & GitHub', level: 90, icon: Github, category: 'Tool' },
  { name: 'Docker', level: 60, icon: Settings, category: 'Tool' },
  { name: 'AWS (EC2, S3)', level: 50, icon: Cloud, category: 'Cloud' },
  { name: 'REST APIs', level: 85, icon: Server, category: 'Other' },
  { name: 'Agile Methodologies', level: 75, icon: Brain, category: 'Other' },
];

export const educationData: EducationItem[] = [
  {
    degree: 'Bachelor of Technology in Computer Science',
    institution: 'University of Technology',
    period: '2021 - 2025 (Expected)',
    description: 'Relevant coursework: Data Structures & Algorithms, Web Development, Database Management, AI Fundamentals. Actively involved in coding clubs and hackathons.',
    icon: BookOpen,
  },
  {
    degree: 'High School Diploma (Science Stream)',
    institution: 'Central High School',
    period: '2019 - 2021',
    description: 'Achieved 92% in final examinations. Participated in science olympiads.',
    icon: Briefcase,
  },
];

export const projectsData: Project[] = [
  {
    id: 'project-1',
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce website with features like product listing, cart, user authentication, and payment integration.',
    imageUrl: 'https://picsum.photos/seed/ecommerce/600/400',
    dataAiHint: 'online store',
    tags: ['Next.js', 'React', 'Node.js', 'MongoDB', 'Stripe'],
    liveLink: '#',
    repoLink: '#',
  },
  {
    id: 'project-2',
    title: 'Task Management App',
    description: 'A collaborative task management tool to help teams organize and track their work effectively.',
    imageUrl: 'https://picsum.photos/seed/taskapp/600/400',
    dataAiHint: 'productivity app',
    tags: ['React', 'Firebase', 'Material UI'],
    liveLink: '#',
    repoLink: '#',
  },
  {
    id: 'project-3',
    title: 'AI Powered Chatbot',
    description: 'An intelligent chatbot for customer service, built using natural language processing techniques.',
    imageUrl: 'https://picsum.photos/seed/chatbot/600/400',
    dataAiHint: 'artificial intelligence',
    tags: ['Python', 'Dialogflow', 'Flask'],
    repoLink: '#',
  },
    {
    id: 'project-4',
    title: 'Personal Portfolio Website',
    description: 'This very portfolio, showcasing my skills and projects. Built with Next.js and Tailwind CSS.',
    imageUrl: 'https://picsum.photos/seed/portfolio/600/400',
    dataAiHint: 'web design',
    tags: ['Next.js', 'Tailwind CSS', 'TypeScript'],
    liveLink: '#', // Current site
    repoLink: '#', // Link to its repo
  },
];

export const certificationsData: Certification[] = [
  {
    name: 'AWS Certified Cloud Practitioner',
    organization: 'Amazon Web Services',
    date: 'June 2023',
    verifyLink: '#',
    icon: Award,
  },
  {
    name: 'Responsive Web Design',
    organization: 'freeCodeCamp',
    date: 'January 2022',
    verifyLink: '#',
    icon: Award,
  },
  {
    name: 'Google IT Support Professional Certificate',
    organization: 'Coursera (Google)',
    date: 'August 2022',
    icon: ShieldCheck,
  }
];

export const contactDetails = {
  email: 'youremail@example.com',
  linkedin: 'https://linkedin.com/in/yourusername',
  github: 'https://github.com/yourusername',
  twitter: 'https://twitter.com/yourusername', // Optional
};

