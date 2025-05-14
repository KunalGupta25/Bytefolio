
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
  defaultProfileImageUrl: "https://placehold.co/300x300.png",
  defaultUserName: "Your Name",
  defaultUserSpecialization: "Web Development, AI, Cybersecurity",
  contactDetails: {
    email: 'youremail@example.com',
    linkedin: 'https://linkedin.com/in/yourusername',
    github: 'https://github.com/yourusername',
    twitter: 'https://twitter.com/yourusername',
  },
  faviconUrl: "/favicon.png", // Default to your preferred favicon in public folder
};

const DEFAULT_ABOUT_DATA: AboutData = {
  professionalSummary: "I am a dedicated and enthusiastic B.Tech Computer Science student with a strong foundation in software development, problem-solving, and web technologies. I am passionate about creating impactful technology solutions and continuously expanding my knowledge. Eager to contribute to innovative projects.",
  bio: "Beyond coding, I enjoy contributing to open-source projects and exploring new AI advancements. I believe in lifelong learning and am always seeking new challenges. My goal is to leverage my technical skills to make a positive impact.",
  profileImageUrl: "https://placehold.co/300x300.png",
  dataAiHint: "coding laptop",
};


// --- Data Fetching Functions from Firebase ---

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const snapshot = await db.ref('/siteSettings').once('value');
    const data = snapshot.val();

    // Initialize with a deep copy of defaults to ensure all nested objects exist
    // and to avoid modifying the original DEFAULT_SITE_SETTINGS object.
    const settings: SiteSettings = JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS));

    if (data && typeof data === 'object') {
      // Merge top-level properties if they exist and are of the correct type
      if (typeof data.siteName === 'string') settings.siteName = data.siteName;
      if (typeof data.defaultUserName === 'string') settings.defaultUserName = data.defaultUserName;
      if (typeof data.defaultUserSpecialization === 'string') settings.defaultUserSpecialization = data.defaultUserSpecialization;
      if (typeof data.defaultProfileImageUrl === 'string') settings.defaultProfileImageUrl = data.defaultProfileImageUrl;
      
      // Handle faviconUrl specifically: use DB value if it's a non-empty string, otherwise use the default.
      if (typeof data.faviconUrl === 'string' && data.faviconUrl.trim() !== '') {
        settings.faviconUrl = data.faviconUrl.trim();
      } else {
        // If fetched faviconUrl is empty, not a string, or not present, it will retain the value from DEFAULT_SITE_SETTINGS
        // which is already set in 'settings' due to the initial JSON.parse(JSON.stringify(...)).
        // No explicit assignment to settings.faviconUrl = DEFAULT_SITE_SETTINGS.faviconUrl is needed here
        // because 'settings' already holds that default value unless overwritten.
      }
      console.log('[getSiteSettings] Fetched data. Resolved faviconUrl:', settings.faviconUrl);

      // Merge contactDetails carefully
      if (data.contactDetails && typeof data.contactDetails === 'object') {
        const contactData = data.contactDetails as Partial<ContactDetails>; // Type assertion for easier access
        if (typeof contactData.email === 'string') settings.contactDetails.email = contactData.email;
        if (typeof contactData.linkedin === 'string') settings.contactDetails.linkedin = contactData.linkedin;
        if (typeof contactData.github === 'string') settings.contactDetails.github = contactData.github;
        
        if (typeof contactData.twitter === 'string' && contactData.twitter.trim() !== '') {
          settings.contactDetails.twitter = contactData.twitter.trim();
        } else if (contactData.twitter === undefined || (typeof contactData.twitter === 'string' && contactData.twitter.trim() === '')) {
           // If Twitter is explicitly empty or undefined in DB, use the default (which might also be undefined or empty)
           settings.contactDetails.twitter = DEFAULT_SITE_SETTINGS.contactDetails.twitter;
        }
      }
    } else {
      // No data from Firebase, 'settings' will remain as a deep copy of DEFAULT_SITE_SETTINGS.
      console.log('[getSiteSettings] No data from Firebase. Using all defaults. Default faviconUrl:', settings.faviconUrl);
    }
    
    return settings;
  } catch (error) {
    console.error("[getSiteSettings] Error fetching site settings:", error);
    // On error, return a fresh deep copy of defaults to be safe.
    const errorDefaults: SiteSettings = JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS));
    console.log('[getSiteSettings] Error condition. Using all defaults. Default faviconUrl:', errorDefaults.faviconUrl);
    return errorDefaults;
  }
}

export async function getAboutData(): Promise<AboutData> {
  try {
    const snapshot = await db.ref('/aboutInfo').once('value');
    const data = snapshot.val();
    
    const about: AboutData = { ...DEFAULT_ABOUT_DATA };

    if (data && typeof data === 'object') {
        if (typeof data.professionalSummary === 'string') about.professionalSummary = data.professionalSummary;
        if (typeof data.bio === 'string') about.bio = data.bio;
        if (typeof data.profileImageUrl === 'string' && data.profileImageUrl.trim() !== '') {
            about.profileImageUrl = data.profileImageUrl.trim();
        }
        if (typeof data.dataAiHint === 'string') about.dataAiHint = data.dataAiHint;
    }
    return about;
  } catch (error) {
    console.error("Error fetching about data:", error);
    return { ...DEFAULT_ABOUT_DATA };
  }
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const snapshot = await db.ref('/skills').once('value');
    const skillsData = snapshot.val();
    if (skillsData && typeof skillsData === 'object') {
      return Object.values(skillsData).map((skill: any) => ({
        id: typeof skill.id === 'string' ? skill.id : '', 
        name: typeof skill.name === 'string' ? skill.name : 'Unnamed Skill',
        category: typeof skill.category === 'string' ? skill.category as Skill['category'] : 'Other',
        level: skill.level !== undefined && !isNaN(Number(skill.level)) ? Number(skill.level) : undefined,
        iconName: typeof skill.iconName === 'string' ? skill.iconName : null,
      }));
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
        id: typeof item.id === 'string' ? item.id : '',
        degree: typeof item.degree === 'string' ? item.degree : 'N/A',
        institution: typeof item.institution === 'string' ? item.institution : 'N/A',
        period: typeof item.period === 'string' ? item.period : 'N/A',
        description: typeof item.description === 'string' ? item.description : undefined,
        iconName: typeof item.iconName === 'string' ? item.iconName : null,
      }));
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
        id: typeof project.id === 'string' ? project.id : '',
        title: typeof project.title === 'string' ? project.title : 'Untitled Project',
        description: typeof project.description === 'string' ? project.description : '',
        imageUrl: typeof project.imageUrl === 'string' && project.imageUrl.trim() !== '' ? project.imageUrl.trim() : 'https://placehold.co/600x400.png',
        tags: Array.isArray(project.tags) ? project.tags.filter(tag => typeof tag === 'string') : [],
        liveLink: typeof project.liveLink === 'string' ? project.liveLink : undefined,
        repoLink: typeof project.repoLink === 'string' ? project.repoLink : undefined,
        dataAiHint: typeof project.dataAiHint === 'string' ? project.dataAiHint : undefined,
      }));
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
        id: typeof cert.id === 'string' ? cert.id : '',
        name: typeof cert.name === 'string' ? cert.name : 'Unnamed Certification',
        organization: typeof cert.organization === 'string' ? cert.organization : 'N/A',
        date: typeof cert.date === 'string' ? cert.date : 'N/A',
        verifyLink: typeof cert.verifyLink === 'string' ? cert.verifyLink : undefined,
        iconName: typeof cert.iconName === 'string' ? cert.iconName : null,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return [];
  }
}

export async function getPageViews(): Promise<number> {
  try {
    const snapshot = await db.ref('/analytics/pageViews').once('value');
    const views = snapshot.val();
    return Number(views) || 0;
  } catch (error) {
    console.error("Error fetching page views:", error);
    return 0;
  }
}

    