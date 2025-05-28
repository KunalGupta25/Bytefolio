
import type React from 'react';
import { db } from './firebase-admin'; // Firebase Admin SDK

const NULL_ICON_VALUE = "--no-icon--";

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
  createdAt?: string;
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
  siteTitleSuffix: string;
  siteDescription: string;
  defaultProfileImageUrl: string;
  defaultUserName: string;
  defaultUserSpecialization: string;
  contactDetails: ContactDetails;
  faviconUrl?: string;
  resumeUrl?: string;
  customHtmlWidget?: string;
  blogUrl?: string;
  kofiUrl?: string;
  // rssFeedUrl removed
}

export interface AboutData {
  professionalSummary: string;
  bio: string;
  profileImageUrl: string;
  dataAiHint?: string;
}

// BlogPost interface removed as it's no longer needed

const CODE_SIGN_FAVICON_CYAN = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="90" font-family="monospace" fill="%2300FFFF">&lt;/&gt;</text></svg>';

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "ByteFolio",
  siteTitleSuffix: "Kunal Gupta Portfolio",
  siteDescription: "A modern portfolio for Kunal Gupta, a Computer Science student, showcasing skills, projects, and experience.",
  defaultProfileImageUrl: "https://placehold.co/300x300.png?text=Profile+Pic",
  defaultUserName: "Kunal Gupta",
  defaultUserSpecialization: "Web Development, AI Agents",
  contactDetails: {
    email: 'kunalgupta250119@gmail.com',
    linkedin: 'https://linkedin.com/in/kunalgupta25',
    github: 'https://github.com/kunalgupta25',
    twitter: 'https://x.com/Kunal_Gupta25',
  },
  faviconUrl: CODE_SIGN_FAVICON_CYAN,
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL || "/resume.pdf",
  customHtmlWidget: "",
  blogUrl: "",
  kofiUrl: "",
  // rssFeedUrl removed
};
console.log('[data.ts] DEFAULT_SITE_SETTINGS.faviconUrl:', DEFAULT_SITE_SETTINGS.faviconUrl);


const DEFAULT_ABOUT_DATA: AboutData = {
  professionalSummary: "I am a dedicated and enthusiastic B.Tech Computer Science student with a strong foundation in software development, problem-solving, and web technologies. I am passionate about creating impactful technology solutions and continuously expanding my knowledge. Eager to contribute to innovative projects.",
  bio: "Beyond coding, I enjoy contributing to open-source projects and exploring new AI advancements. I believe in lifelong learning and am always seeking new challenges. My goal is to leverage my technical skills to make a positive impact.",
  profileImageUrl: "https://placehold.co/300x300.png?text=Coding+Laptop",
  dataAiHint: "coding laptop",
};


export async function getSiteSettings(): Promise<SiteSettings> {
  console.log('[getSiteSettings] Initialized settings with defaults. Default faviconUrl:', DEFAULT_SITE_SETTINGS.faviconUrl);
  try {
    const snapshot = await db.ref('/siteSettings').once('value');
    const data = snapshot.val();

    const settings: SiteSettings = JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS));
    
    settings.resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL || DEFAULT_SITE_SETTINGS.resumeUrl || "/resume.pdf";

    if (data && typeof data === 'object') {
      console.log('[getSiteSettings] Fetched data from Firebase:', data);
      if (typeof data.siteName === 'string' && data.siteName.trim() !== '') settings.siteName = data.siteName.trim();
      if (typeof data.siteTitleSuffix === 'string' && data.siteTitleSuffix.trim() !== '') settings.siteTitleSuffix = data.siteTitleSuffix.trim();
      if (typeof data.siteDescription === 'string' && data.siteDescription.trim() !== '') settings.siteDescription = data.siteDescription.trim();
      if (typeof data.defaultUserName === 'string' && data.defaultUserName.trim() !== '') settings.defaultUserName = data.defaultUserName.trim();
      if (typeof data.defaultUserSpecialization === 'string' && data.defaultUserSpecialization.trim() !== '') settings.defaultUserSpecialization = data.defaultUserSpecialization.trim();
      if (typeof data.defaultProfileImageUrl === 'string' && data.defaultProfileImageUrl.trim() !== '') settings.defaultProfileImageUrl = data.defaultProfileImageUrl.trim();
      
      if (data.hasOwnProperty('faviconUrl')) {
        const fbFaviconUrl = data.faviconUrl;
        if (typeof fbFaviconUrl === 'string' && fbFaviconUrl.trim() !== '') {
            settings.faviconUrl = fbFaviconUrl.trim();
        } else { 
             settings.faviconUrl = DEFAULT_SITE_SETTINGS.faviconUrl;
        }
      }
      console.log('[getSiteSettings] Merged Firebase data. Resolved faviconUrl:', settings.faviconUrl?.startsWith('data:image/svg+xml') ? 'SVG Data URI' : settings.faviconUrl);
      
      if (data.hasOwnProperty('customHtmlWidget')) {
        settings.customHtmlWidget = typeof data.customHtmlWidget === 'string' ? data.customHtmlWidget : DEFAULT_SITE_SETTINGS.customHtmlWidget;
      }
      if (data.hasOwnProperty('blogUrl')) {
         settings.blogUrl = typeof data.blogUrl === 'string' ? data.blogUrl.trim() : DEFAULT_SITE_SETTINGS.blogUrl;
      }
      if (data.hasOwnProperty('kofiUrl')) {
        settings.kofiUrl = typeof data.kofiUrl === 'string' ? data.kofiUrl.trim() : DEFAULT_SITE_SETTINGS.kofiUrl;
      }
      // rssFeedUrl removed from here

      if (data.contactDetails && typeof data.contactDetails === 'object') {
        const contactData = data.contactDetails as Partial<ContactDetails>;
        settings.contactDetails.email = typeof contactData.email === 'string' ? contactData.email : DEFAULT_SITE_SETTINGS.contactDetails.email;
        settings.contactDetails.linkedin = typeof contactData.linkedin === 'string' ? contactData.linkedin : DEFAULT_SITE_SETTINGS.contactDetails.linkedin;
        settings.contactDetails.github = typeof contactData.github === 'string' ? contactData.github : DEFAULT_SITE_SETTINGS.contactDetails.github;
        
        if (contactData.hasOwnProperty('twitter')) {
            const fbTwitter = contactData.twitter;
            settings.contactDetails.twitter = (typeof fbTwitter === 'string' && fbTwitter.trim() !== '') ? fbTwitter.trim() : DEFAULT_SITE_SETTINGS.contactDetails.twitter;
        }
      } else {
         console.log('[getSiteSettings] contactDetails missing or not an object in Firebase, using defaults.');
      }
    } else {
      console.log('[getSiteSettings] No data from Firebase or data is not an object. Using all defaults.');
    }
    console.log('[getSiteSettings] Final settings returned:', settings);
    return settings;
  } catch (error) {
    console.error("[getSiteSettings] Error fetching site settings:", error);
    const errorDefaults: SiteSettings = JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS));
    errorDefaults.resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL || DEFAULT_SITE_SETTINGS.resumeUrl || "/resume.pdf";
    console.log('[getSiteSettings] Error condition. Using all defaults. Default faviconUrl:', errorDefaults.faviconUrl?.startsWith('data:image/svg+xml') ? 'SVG Data URI' : errorDefaults.faviconUrl);
    return errorDefaults;
  }
}

export async function getAboutData(): Promise<AboutData> {
  try {
    const snapshot = await db.ref('/aboutInfo').once('value');
    const data = snapshot.val();
    const about: AboutData = JSON.parse(JSON.stringify(DEFAULT_ABOUT_DATA));

    if (data && typeof data === 'object') {
        if (typeof data.professionalSummary === 'string' && data.professionalSummary.trim() !== '') about.professionalSummary = data.professionalSummary.trim();
        if (typeof data.bio === 'string' && data.bio.trim() !== '') about.bio = data.bio.trim();
        if (data.hasOwnProperty('profileImageUrl')) {
            about.profileImageUrl = (typeof data.profileImageUrl === 'string' && data.profileImageUrl.trim() !== '') ? data.profileImageUrl.trim() : DEFAULT_ABOUT_DATA.profileImageUrl;
        }
        if (data.hasOwnProperty('dataAiHint')) {
          about.dataAiHint = (typeof data.dataAiHint === 'string' && data.dataAiHint.trim() !== '') ? data.dataAiHint.trim() : DEFAULT_ABOUT_DATA.dataAiHint;
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
          iconName: (typeof skill.iconName === 'string' && skill.iconName.trim() !== '' && skill.iconName.trim() !== NULL_ICON_VALUE) ? skill.iconName : null,
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
          iconName: (typeof item.iconName === 'string' && item.iconName.trim() !== '' && item.iconName.trim() !== NULL_ICON_VALUE) ? item.iconName : null,
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
          iconName: (typeof cert.iconName === 'string' && cert.iconName.trim() !== '' && cert.iconName.trim() !== NULL_ICON_VALUE) ? cert.iconName : null,
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
