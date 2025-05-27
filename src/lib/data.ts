
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
  resumeUrl?: string; // This will now be primarily sourced from environment variable
  customHtmlWidget?: string;
  blogUrl?: string; 
  kofiUrl?: string;  
}

export interface AboutData {
  professionalSummary: string;
  bio: string;
  profileImageUrl: string;
  dataAiHint?: string;
}

const CODE_SIGN_FAVICON_CYAN = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="90" font-family="monospace" fill="%2300FFFF">&lt;/&gt;</text></svg>';

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "ByteFolio",
  siteTitleSuffix: "Kunal Gupta's Portfolio",
  siteDescription: "Kunal Gupta specializes in Artificial Intelligence, showcasing AI projects, web development skills, and innovative technology solutions.",
  defaultProfileImageUrl: "https://media.licdn.com/dms/image/v2/D4D03AQFpZkJ--9b3hQ/profile-displayphoto-shrink_400_400/B4DZcDFDseIAAg-/0/1748103348062?e=1753315200&v=beta&t=6TmYnYE_93tflEjgHRcjuXgreyXpdfhJ3AlSTyX0isY",
  defaultUserName: "Kunal Gupta",
  defaultUserSpecialization: "Web Development, AI Agents",
  contactDetails: {
    email: 'kunalgupta250119@gmail.com',
    linkedin: 'https://linkedin.com/in/kunalgupta25',
    github: 'https://github.com/kunalgupta25',
    twitter: 'https://x.com/Kunal_Gupta25',
  },
  faviconUrl: CODE_SIGN_FAVICON_CYAN,
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL || "/resume.pdf", // Default from env or fallback
  customHtmlWidget: "",
  blogUrl: "", 
  kofiUrl: "",   
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

    // Start with a deep copy of defaults to ensure all keys exist
    const settings: SiteSettings = JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS));
    
    // Set resumeUrl from environment variable or default, overriding any Firebase value
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
        } else if (fbFaviconUrl === null || fbFaviconUrl === "" || fbFaviconUrl === "--no-icon--") {
             settings.faviconUrl = DEFAULT_SITE_SETTINGS.faviconUrl; 
        }
      }
      console.log('[getSiteSettings] Merged Firebase data. Resolved faviconUrl:', settings.faviconUrl);

      // customHtmlWidget and contactDetails are handled below to ensure defaults apply if structure is missing
      if (data.hasOwnProperty('customHtmlWidget')) {
        if (typeof data.customHtmlWidget === 'string') { // Can be empty string
          settings.customHtmlWidget = data.customHtmlWidget;
        } else if (data.customHtmlWidget === null) {
          settings.customHtmlWidget = DEFAULT_SITE_SETTINGS.customHtmlWidget; // Default to empty string
        }
      }
      
      if (data.hasOwnProperty('blogUrl')) {
         if (typeof data.blogUrl === 'string') {
            settings.blogUrl = data.blogUrl.trim();
         } else if (data.blogUrl === null || data.blogUrl === "") {
            settings.blogUrl = DEFAULT_SITE_SETTINGS.blogUrl;
         }
      }
      if (data.hasOwnProperty('kofiUrl')) {
        if (typeof data.kofiUrl === 'string') {
           settings.kofiUrl = data.kofiUrl.trim();
        } else if (data.kofiUrl === null || data.kofiUrl === "") {
           settings.kofiUrl = DEFAULT_SITE_SETTINGS.kofiUrl;
        }
     }

      if (data.contactDetails && typeof data.contactDetails === 'object') {
        const contactData = data.contactDetails as Partial<ContactDetails>;
        if (typeof contactData.email === 'string') settings.contactDetails.email = contactData.email; else settings.contactDetails.email = DEFAULT_SITE_SETTINGS.contactDetails.email;
        if (typeof contactData.linkedin === 'string') settings.contactDetails.linkedin = contactData.linkedin; else settings.contactDetails.linkedin = DEFAULT_SITE_SETTINGS.contactDetails.linkedin;
        if (typeof contactData.github === 'string') settings.contactDetails.github = contactData.github; else settings.contactDetails.github = DEFAULT_SITE_SETTINGS.contactDetails.github;
        
        if (contactData.hasOwnProperty('twitter')) {
            const fbTwitter = contactData.twitter;
            if (typeof fbTwitter === 'string' && fbTwitter.trim() !== '') {
                settings.contactDetails.twitter = fbTwitter.trim();
            } else {
                settings.contactDetails.twitter = DEFAULT_SITE_SETTINGS.contactDetails.twitter;
            }
        } else {
             settings.contactDetails.twitter = DEFAULT_SITE_SETTINGS.contactDetails.twitter;
        }
      } else {
         console.log('[getSiteSettings] contactDetails missing or not an object in Firebase, using defaults from DEFAULT_SITE_SETTINGS.');
         settings.contactDetails = JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS.contactDetails));
      }
    } else {
      console.log('[getSiteSettings] No data from Firebase or data is not an object. Using all defaults (env for resume).');
    }
    console.log('[getSiteSettings] Final settings returned (resumeUrl from env):', settings);
    return settings;
  } catch (error) {
    console.error("[getSiteSettings] Error fetching site settings:", error);
    const errorDefaults: SiteSettings = JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS));
    errorDefaults.resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL || DEFAULT_SITE_SETTINGS.resumeUrl || "/resume.pdf";
    console.log('[getSiteSettings] Error condition. Using all defaults (env for resume). Default faviconUrl:', errorDefaults.faviconUrl);
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
            if (typeof data.profileImageUrl === 'string' && data.profileImageUrl.trim() !== '') {
                about.profileImageUrl = data.profileImageUrl.trim();
            } else if (data.profileImageUrl === null || data.profileImageUrl === "") {
                about.profileImageUrl = DEFAULT_ABOUT_DATA.profileImageUrl;
            }
        }

        if (data.hasOwnProperty('dataAiHint')) {
          if (typeof data.dataAiHint === 'string' && data.dataAiHint.trim() !== '') {
            about.dataAiHint = data.dataAiHint.trim();
          } else if (data.dataAiHint === null || data.dataAiHint === "") {
            about.dataAiHint = DEFAULT_ABOUT_DATA.dataAiHint;
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
    
