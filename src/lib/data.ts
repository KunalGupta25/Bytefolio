
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
  createdAt?: string; // Added for sorting
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
  resumeUrl?: string; // Added for CV/Resume link
}

export interface AboutData {
  professionalSummary: string;
  bio: string;
  profileImageUrl: string;
  dataAiHint?: string;
}

const codeSignFaviconDataUriCyan = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="90" font-family="monospace" fill="%2300FFFF">&lt;/&gt;</text></svg>';

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "ByteFolio",
  defaultProfileImageUrl: "https://placehold.co/300x300.png",
  defaultUserName: "Kunal Gupta",
  defaultUserSpecialization: "Web Development, AI & Machine Learning ",
  contactDetails: {
    email: 'youremail@example.com',
    linkedin: 'https://linkedin.com/in/yourusername',
    github: 'https://github.com/yourusername',
    twitter: 'https://twitter.com/yourusername',
  },
  faviconUrl: codeSignFaviconDataUriCyan,
  resumeUrl: "/resume.pdf", // Default resume URL
};

const DEFAULT_ABOUT_DATA: AboutData = {
  professionalSummary: "I am a dedicated and enthusiastic B.Tech Computer Science student with a strong foundation in software development, problem-solving, and web technologies. I am passionate about creating impactful technology solutions and continuously expanding my knowledge. Eager to contribute to innovative projects.",
  bio: "Beyond coding, I enjoy contributing to open-source projects and exploring new AI advancements. I believe in lifelong learning and am always seeking new challenges. My goal is to leverage my technical skills to make a positive impact.",
  profileImageUrl: "https://placehold.co/300x300.png",
  dataAiHint: "coding laptop",
};


// --- Data Fetching Functions from Firebase ---

export async function getSiteSettings(): Promise<SiteSettings> {
  console.log('[getSiteSettings] Initialized settings with defaults. Default faviconUrl:', DEFAULT_SITE_SETTINGS.faviconUrl);
  try {
    const snapshot = await db.ref('/siteSettings').once('value');
    const data = snapshot.val();

    // Start with a deep copy of defaults
    const settings: SiteSettings = JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS));

    if (data && typeof data === 'object') {
      console.log('[getSiteSettings] Fetched data from Firebase:', data);
      if (typeof data.siteName === 'string') settings.siteName = data.siteName;
      if (typeof data.defaultUserName === 'string') settings.defaultUserName = data.defaultUserName;
      if (typeof data.defaultUserSpecialization === 'string') settings.defaultUserSpecialization = data.defaultUserSpecialization;
      if (typeof data.defaultProfileImageUrl === 'string') settings.defaultProfileImageUrl = data.defaultProfileImageUrl;
      
      if (data.hasOwnProperty('faviconUrl')) {
        const fbFaviconUrl = data.faviconUrl;
        if (typeof fbFaviconUrl === 'string' && fbFaviconUrl.trim() !== '') {
            settings.faviconUrl = fbFaviconUrl.trim();
        } // else it keeps the default from DEFAULT_SITE_SETTINGS
      }
      console.log('[getSiteSettings] Merged Firebase data. Resolved faviconUrl:', settings.faviconUrl);

      if (data.hasOwnProperty('resumeUrl')) {
        const fbResumeUrl = data.resumeUrl;
        if (typeof fbResumeUrl === 'string' && fbResumeUrl.trim() !== '') {
          settings.resumeUrl = fbResumeUrl.trim();
        } // else it keeps the default
      }

      if (data.contactDetails && typeof data.contactDetails === 'object') {
        const contactData = data.contactDetails as Partial<ContactDetails>;
        if (typeof contactData.email === 'string') settings.contactDetails.email = contactData.email;
        if (typeof contactData.linkedin === 'string') settings.contactDetails.linkedin = contactData.linkedin;
        if (typeof contactData.github === 'string') settings.contactDetails.github = contactData.github;
        
        if (contactData.hasOwnProperty('twitter')) {
            const fbTwitter = contactData.twitter;
            if (typeof fbTwitter === 'string' && fbTwitter.trim() !== '') {
                settings.contactDetails.twitter = fbTwitter.trim();
            } // else keeps default
        }
      } else {
         console.log('[getSiteSettings] contactDetails missing or not an object in Firebase, using defaults from DEFAULT_SITE_SETTINGS.');
         // Already handled by starting with defaults
      }
    } else {
      console.log('[getSiteSettings] No data from Firebase or data is not an object. Using all defaults. Default faviconUrl:', settings.faviconUrl);
    }
    
    return settings;
  } catch (error) {
    console.error("[getSiteSettings] Error fetching site settings:", error);
    const errorDefaults: SiteSettings = JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS));
    console.log('[getSiteSettings] Error condition. Using all defaults. Default faviconUrl:', errorDefaults.faviconUrl);
    return errorDefaults;
  }
}

export async function getAboutData(): Promise<AboutData> {
  try {
    const snapshot = await db.ref('/aboutInfo').once('value');
    const data = snapshot.val();
    
    const about: AboutData = JSON.parse(JSON.stringify(DEFAULT_ABOUT_DATA));

    if (data && typeof data === 'object') {
        if (typeof data.professionalSummary === 'string') about.professionalSummary = data.professionalSummary;
        if (typeof data.bio === 'string') about.bio = data.bio;
        
        if (data.hasOwnProperty('profileImageUrl')) {
            if (typeof data.profileImageUrl === 'string' && data.profileImageUrl.trim() !== '') {
                about.profileImageUrl = data.profileImageUrl.trim();
            }
        }

        if (data.hasOwnProperty('dataAiHint')) {
          if (typeof data.dataAiHint === 'string' && data.dataAiHint.trim() !== '') {
            about.dataAiHint = data.dataAiHint.trim();
          }
        }
    }
    return about;
  } catch (error) {
    console.error("Error fetching about data:", error);
    return JSON.parse(JSON.stringify(DEFAULT_ABOUT_DATA));
  }
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const snapshot = await db.ref('/skills').once('value');
    const skillsData = snapshot.val();
    if (skillsData && typeof skillsData === 'object') {
      return Object.entries(skillsData).map(([id, skill]: [string, any]) => {
        if (!skill || typeof skill !== 'object') return null; 
        return {
          id: typeof skill.id === 'string' ? skill.id : id, 
          name: typeof skill.name === 'string' ? skill.name : 'Unnamed Skill',
          category: typeof skill.category === 'string' && ['Language', 'Framework/Library', 'Tool', 'Database', 'Cloud', 'Other'].includes(skill.category) ? skill.category as Skill['category'] : 'Other',
          level: skill.level !== undefined && !isNaN(Number(skill.level)) ? Number(skill.level) : undefined,
          iconName: (typeof skill.iconName === 'string' && skill.iconName.trim() !== '') ? skill.iconName : null,
        };
      }).filter(Boolean) as Skill[];
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
      return Object.entries(educationData).map(([id, item]: [string, any]) => {
        if (!item || typeof item !== 'object') return null;
        return {
          id: typeof item.id === 'string' ? item.id : id,
          degree: typeof item.degree === 'string' ? item.degree : 'N/A',
          institution: typeof item.institution === 'string' ? item.institution : 'N/A',
          period: typeof item.period === 'string' ? item.period : 'N/A',
          description: typeof item.description === 'string' ? item.description : undefined,
          iconName: (typeof item.iconName === 'string' && item.iconName.trim() !== '') ? item.iconName : null,
        };
      }).filter(Boolean) as EducationItem[];
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
      const projectsArray = Object.entries(projectsData).map(([id, project]: [string, any]) => {
        if (!project || typeof project !== 'object') return null;
        return {
          id: typeof project.id === 'string' ? project.id : id,
          title: typeof project.title === 'string' ? project.title : 'Untitled Project',
          description: typeof project.description === 'string' ? project.description : '',
          imageUrl: typeof project.imageUrl === 'string' && project.imageUrl.trim() !== '' ? project.imageUrl.trim() : 'https://placehold.co/600x400.png',
          tags: Array.isArray(project.tags) ? project.tags.filter((tag): tag is string => typeof tag === 'string') : [],
          liveLink: (typeof project.liveLink === 'string' && project.liveLink.trim() !== '') ? project.liveLink : undefined,
          repoLink: (typeof project.repoLink === 'string' && project.repoLink.trim() !== '') ? project.repoLink : undefined,
          dataAiHint: typeof project.dataAiHint === 'string' ? project.dataAiHint : undefined,
          createdAt: typeof project.createdAt === 'string' ? project.createdAt : new Date(0).toISOString(), 
        };
      }).filter(Boolean) as Project[];

      projectsArray.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
      
      return projectsArray;
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
      return Object.entries(certificationsData).map(([id, cert]: [string, any]) => {
        if (!cert || typeof cert !== 'object') return null;
        return {
          id: typeof cert.id === 'string' ? cert.id : id,
          name: typeof cert.name === 'string' ? cert.name : 'Unnamed Certification',
          organization: typeof cert.organization === 'string' ? cert.organization : 'N/A',
          date: typeof cert.date === 'string' ? cert.date : 'N/A',
          verifyLink: (typeof cert.verifyLink === 'string' && cert.verifyLink.trim() !== '') ? cert.verifyLink : undefined,
          iconName: (typeof cert.iconName === 'string' && cert.iconName.trim() !== '') ? cert.iconName : null,
        };
      }).filter(Boolean) as Certification[];
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

    