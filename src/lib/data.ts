
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
  faviconUrl?: string;
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
  faviconUrl: "/favicon.ico",
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

    // Ensure data is a valid object before trying to merge
    if (data && typeof data === 'object') {
      const contactDetailsData = (typeof data.contactDetails === 'object' && data.contactDetails !== null)
        ? data.contactDetails
        : {};

      const mergedSettings: SiteSettings = {
        ...DEFAULT_SITE_SETTINGS, // Start with all defaults
        ...data,                   // Override with top-level fields from data if they exist
        contactDetails: {          // Deep merge contactDetails
          ...DEFAULT_SITE_SETTINGS.contactDetails,
          ...contactDetailsData,
        },
        // Explicitly handle faviconUrl: if data.faviconUrl is undefined, default is used from initial spread.
        // If data.faviconUrl is null or "", that specific value will be used from the "...data" spread.
        // This line ensures that if faviconUrl is explicitly set in data (even to null/empty), it's preferred,
        // otherwise the default from DEFAULT_SITE_SETTINGS (via initial spread) is used.
        // If data.faviconUrl is not part of data object, faviconUrl from DEFAULT_SITE_SETTINGS is kept.
        // If data.faviconUrl is present (e.g. null, empty string, or valid URL), it's used from ...data spread.
        // If data.faviconUrl is undefined in `data` object, it will take from `...DEFAULT_SITE_SETTINGS`
         faviconUrl: data.faviconUrl !== undefined ? data.faviconUrl : DEFAULT_SITE_SETTINGS.faviconUrl,
      };
      return mergedSettings;
    }
    // If no data or data is not an object, return a deep copy of defaults
    return { ...DEFAULT_SITE_SETTINGS, contactDetails: { ...DEFAULT_SITE_SETTINGS.contactDetails } };
  } catch (error) {
    console.error("Error fetching site settings:", error);
    // On error, return a deep copy of defaults
    return { ...DEFAULT_SITE_SETTINGS, contactDetails: { ...DEFAULT_SITE_SETTINGS.contactDetails } };
  }
}

export async function getAboutData(): Promise<AboutData> {
  try {
    const snapshot = await db.ref('/aboutInfo').once('value');
    const data = snapshot.val();

    // Ensure data is a valid object before trying to merge
    if (data && typeof data === 'object') {
      return {
        ...DEFAULT_ABOUT_DATA, // Start with all defaults
        ...data,              // Override with fields from data if they exist
        // Ensure profileImageUrl always has a value, falling back to default if data's is falsy (null, undefined, empty string)
        profileImageUrl: data.profileImageUrl || DEFAULT_ABOUT_DATA.profileImageUrl,
        // dataAiHint is optional. If present in data, it will be used.
        // Otherwise, the value from DEFAULT_ABOUT_DATA (from initial spread) will be used.
      };
    }
    // If no data or data is not an object, return a deep copy of defaults
    return { ...DEFAULT_ABOUT_DATA };
  } catch (error) {
    console.error("Error fetching about data:", error);
    // On error, return a deep copy of defaults
    return { ...DEFAULT_ABOUT_DATA };
  }
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const snapshot = await db.ref('/skills').once('value');
    const skillsData = snapshot.val();
    if (skillsData && typeof skillsData === 'object') {
      return Object.values(skillsData).map((skill: any) => ({
        id: skill.id || '', // Push keys are usually generated by Firebase
        name: skill.name || 'Unnamed Skill',
        category: skill.category || 'Other',
        level: skill.level !== undefined ? Number(skill.level) : undefined,
        iconName: skill.iconName !== undefined ? skill.iconName : null,
      })) as Skill[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

export async function getEducationItems(): Promise<EducationItem[]> {
  try {
    const snapshot = await db.ref('/education').once('value');
    const educationData = snapshot.val();
     if (educationData && typeof educationData === 'object') {
      return Object.values(educationData).map((item: any) => ({
        id: item.id || '',
        degree: item.degree || 'N/A',
        institution: item.institution || 'N/A',
        period: item.period || 'N/A',
        description: item.description || undefined,
        iconName: item.iconName !== undefined ? item.iconName : null,
      })) as EducationItem[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching education items:", error);
    return [];
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const snapshot = await db.ref('/projects').once('value');
    const projectsData = snapshot.val();
    if (projectsData && typeof projectsData === 'object') {
      return Object.values(projectsData).map((project: any) => ({
        id: project.id || '',
        title: project.title || 'Untitled Project',
        description: project.description || '',
        imageUrl: project.imageUrl || 'https://placehold.co/600x400.png',
        tags: Array.isArray(project.tags) ? project.tags : [],
        liveLink: project.liveLink || undefined,
        repoLink: project.repoLink || undefined,
        dataAiHint: project.dataAiHint || undefined,
      })) as Project[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getCertifications(): Promise<Certification[]> {
  try {
    const snapshot = await db.ref('/certifications').once('value');
    const certificationsData = snapshot.val();
    if (certificationsData && typeof certificationsData === 'object') {
      return Object.values(certificationsData).map((cert: any) => ({
        id: cert.id || '',
        name: cert.name || 'Unnamed Certification',
        organization: cert.organization || 'N/A',
        date: cert.date || 'N/A',
        verifyLink: cert.verifyLink || undefined,
        iconName: cert.iconName !== undefined ? cert.iconName : null,
      })) as Certification[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return [];
  }
}
