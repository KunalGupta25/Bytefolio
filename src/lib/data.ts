
import type React from 'react';
import { db } from './firebase-admin'; // Firebase Admin SDK

// Types for data structures
export interface Skill {
  id: string; 
  name: string;
  level?: number; 
  iconName?: keyof typeof import('lucide-react') | string | null; 
  category: 'Language' | 'Framework/Library' | 'Tool' | 'Database' | 'Cloud' | 'Other';
}

export interface EducationItem {
  id: string; 
  degree: string;
  institution: string;
  period: string;
  description?: string;
  iconName?: keyof typeof import('lucide-react') | string | null;
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
  id: string; 
  name:string;
  organization: string;
  date: string;
  verifyLink?: string;
  iconName?: keyof typeof import('lucide-react') | string | null;
}

export interface ContactDetails {
  email: string;
  linkedin: string;
  github: string;
  twitter?: string;
}
export interface SiteSettings {
  siteName: string;
  defaultProfileImageUrl: string; 
  defaultUserName: string; 
  defaultUserSpecialization: string;
  contactDetails: ContactDetails;
  faviconUrl?: string; // Added faviconUrl
}

export interface AboutData {
  professionalSummary: string;
  bio: string;
  profileImageUrl: string;
  dataAiHint?: string;
}

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "ByteFolio",
  defaultProfileImageUrl: "https://placehold.co/300x300.png?text=Profile",
  defaultUserName: "Your Name",
  defaultUserSpecialization: "Web Development, AI, Cybersecurity",
  contactDetails: {
    email: 'youremail@example.com',
    linkedin: 'https://linkedin.com/in/yourusername',
    github: 'https://github.com/yourusername',
    twitter: 'https://twitter.com/yourusername',
  },
  faviconUrl: "/favicon.ico", // Default favicon path
};

const DEFAULT_ABOUT_DATA: AboutData = {
  professionalSummary: "I am a dedicated and enthusiastic B.Tech Computer Science student with a strong foundation in software development, problem-solving, and web technologies. I am passionate about creating impactful technology solutions and continuously expanding my knowledge. Eager to contribute to innovative projects.",
  bio: "Beyond coding, I enjoy contributing to open-source projects and exploring new AI advancements. I believe in lifelong learning and am always seeking new challenges. My goal is to leverage my technical skills to make a positive impact.",
  profileImageUrl: "https://placehold.co/300x300.png?text=About+Me", 
  dataAiHint: "professional portrait",
};


// --- Data Fetching Functions from Firebase ---

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const snapshot = await db.ref('/siteSettings').once('value');
    const data = snapshot.val();
    if (data) {
      const mergedSettings: SiteSettings = {
        ...DEFAULT_SITE_SETTINGS,
        ...data,
        contactDetails: {
          ...DEFAULT_SITE_SETTINGS.contactDetails,
          ...(data.contactDetails || {}),
        },
        faviconUrl: data.faviconUrl !== undefined ? data.faviconUrl : DEFAULT_SITE_SETTINGS.faviconUrl,
      };
      return mergedSettings;
    }
    return { ...DEFAULT_SITE_SETTINGS, contactDetails: { ...DEFAULT_SITE_SETTINGS.contactDetails } };
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return { ...DEFAULT_SITE_SETTINGS, contactDetails: { ...DEFAULT_SITE_SETTINGS.contactDetails } };
  }
}

export async function getAboutData(): Promise<AboutData> {
  try {
    const snapshot = await db.ref('/aboutInfo').once('value');
    const data = snapshot.val();
    if (data) {
      return { 
        ...DEFAULT_ABOUT_DATA, 
        ...data,
        profileImageUrl: data.profileImageUrl || DEFAULT_ABOUT_DATA.profileImageUrl,
      };
    }
    return { ...DEFAULT_ABOUT_DATA };
  } catch (error) {
    console.error("Error fetching about data:", error);
    return { ...DEFAULT_ABOUT_DATA };
  }
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const snapshot = await db.ref('/skills').once('value');
    const skillsData = snapshot.val();
    return skillsData ? Object.values(skillsData) : [];
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

export async function getEducationItems(): Promise<EducationItem[]> {
  try {
    const snapshot = await db.ref('/education').once('value');
    const educationData = snapshot.val();
    return educationData ? Object.values(educationData) : [];
  } catch (error) {
    console.error("Error fetching education items:", error);
    return [];
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const snapshot = await db.ref('/projects').once('value');
    const projectsData = snapshot.val();
    return projectsData ? Object.values(projectsData) : [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getCertifications(): Promise<Certification[]> {
  try {
    const snapshot = await db.ref('/certifications').once('value');
    const certificationsData = snapshot.val();
    return certificationsData ? Object.values(certificationsData) : [];
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return [];
  }
}
