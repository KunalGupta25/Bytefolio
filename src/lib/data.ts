
import type React from 'react';

// Types for data structures
export interface Skill {
  name: string;
  level?: number; // Optional: 0-100 for progress bar
  iconName?: keyof typeof import('lucide-react'); // Store the name of the Lucide icon
  category: 'Language' | 'Framework/Library' | 'Tool' | 'Database' | 'Cloud' | 'Other';
}

export interface EducationItem {
  id: string; // Added for easier management in admin
  degree: string;
  institution: string;
  period: string;
  description?: string;
  iconName?: keyof typeof import('lucide-react');
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
  id: string; // Added for easier management in admin
  name:string;
  organization: string;
  date: string;
  verifyLink?: string;
  iconName?: keyof typeof import('lucide-react');
}

export interface SiteSettings {
  siteName: string;
  defaultProfileImageUrl: string; // if profile image not set in aboutData
  defaultUserName: string; // Default user name for hero section etc.
  defaultUserSpecialization: string;
}

// Mock Data
export const siteSettingsData: SiteSettings = {
  siteName: "ByteFolio",
  defaultProfileImageUrl: "https://picsum.photos/seed/profile/300/300",
  defaultUserName: "Your Name",
  defaultUserSpecialization: "Web Development, AI, Cybersecurity",
};

export const aboutData = {
  professionalSummary: "I am a dedicated and enthusiastic B.Tech Computer Science student with a strong foundation in software development, problem-solving, and [mention 1-2 key areas like web technologies, data structures, algorithms]. I am passionate about creating impactful technology solutions and continuously expanding my knowledge in the ever-evolving tech landscape. Eager to contribute to innovative projects and collaborate with like-minded professionals.",
  bio: "Beyond coding, I enjoy [mention a hobby or interest, e.g., contributing to open-source projects, exploring new AI advancements, playing chess]. I believe in lifelong learning and am always seeking new challenges to grow both personally and professionally. My goal is to leverage my technical skills to make a positive impact.",
  profileImageUrl: "https://picsum.photos/seed/profile/300/300", // This can be overridden by admin
  dataAiHint: "professional portrait",
};

export const skillsData: Skill[] = [
  { name: 'JavaScript', level: 90, iconName: 'Cpu', category: 'Language' },
  { name: 'Python', level: 85, iconName: 'Cpu', category: 'Language' },
  { name: 'Java', level: 75, iconName: 'Cpu', category: 'Language' },
  { name: 'React.js', level: 90, iconName: 'Code', category: 'Framework/Library' },
  { name: 'Next.js', level: 88, iconName: 'Code', category: 'Framework/Library' },
  { name: 'Node.js', level: 80, iconName: 'Server', category: 'Framework/Library' },
  { name: 'Express.js', level: 78, iconName: 'Server', category: 'Framework/Library' },
  { name: 'SQL (PostgreSQL, MySQL)', level: 70, iconName: 'Database', category: 'Database' },
  { name: 'MongoDB', level: 65, iconName: 'Database', category: 'Database' },
  { name: 'Git & GitHub', level: 90, iconName: 'Github', category: 'Tool' },
  { name: 'Docker', level: 60, iconName: 'Package', category: 'Tool' }, // Changed from Settings
  { name: 'AWS (EC2, S3)', level: 50, iconName: 'Cloud', category: 'Cloud' },
  { name: 'REST APIs', level: 85, iconName: 'Server', category: 'Other' },
  { name: 'Agile Methodologies', level: 75, iconName: 'Brain', category: 'Other' },
];

export const educationData: EducationItem[] = [
  {
    id: 'edu-1',
    degree: 'Bachelor of Technology in Computer Science',
    institution: 'University of Technology',
    period: '2021 - 2025 (Expected)',
    description: 'Relevant coursework: Data Structures & Algorithms, Web Development, Database Management, AI Fundamentals. Actively involved in coding clubs and hackathons.',
    iconName: 'BookOpen',
  },
  {
    id: 'edu-2',
    degree: 'High School Diploma (Science Stream)',
    institution: 'Central High School',
    period: '2019 - 2021',
    description: 'Achieved 92% in final examinations. Participated in science olympiads.',
    iconName: 'Briefcase',
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
    id: 'cert-1',
    name: 'AWS Certified Cloud Practitioner',
    organization: 'Amazon Web Services',
    date: 'June 2023',
    verifyLink: '#',
    iconName: 'Award',
  },
  {
    id: 'cert-2',
    name: 'Responsive Web Design',
    organization: 'freeCodeCamp',
    date: 'January 2022',
    verifyLink: '#',
    iconName: 'Award',
  },
  {
    id: 'cert-3',
    name: 'Google IT Support Professional Certificate',
    organization: 'Coursera (Google)',
    date: 'August 2022',
    iconName: 'ShieldCheck',
  }
];

export const contactDetails = {
  email: 'youremail@example.com',
  linkedin: 'https://linkedin.com/in/yourusername',
  github: 'https://github.com/yourusername',
  twitter: 'https://twitter.com/yourusername', // Optional
};
