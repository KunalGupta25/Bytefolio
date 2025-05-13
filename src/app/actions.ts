'use server';

import { z } from 'zod';
import type { Skill, EducationItem, Project, Certification, SiteSettings } from '@/lib/data';
import { 
  aboutData, 
  siteSettingsData,
  skillsData,
  educationData,
  projectsData,
  certificationsData,
  type AboutData // Import AboutData type if not already implicitly available
} from '@/lib/data'; 

const NULL_ICON_VALUE = "--no-icon--";

// --- Authentication ---
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

interface LoginState {
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
    general?: string[];
  };
}

export async function loginAdminAction(prevState: LoginState | undefined, formData: FormData): Promise<LoginState> {
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid input.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  if (email === 'admin@gmail.com' && password === 'k4912005') {
    console.log('Admin login successful for:', email);
    return { success: true, message: 'Login successful!' };
  } else {
    return {
      success: false,
      message: 'Invalid credentials.',
      errors: { general: ['Invalid email or password.'] },
    };
  }
}


// --- Contact Form ---
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

interface ContactFormState {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
}

export async function submitContactForm(prevState: ContactFormState | undefined, formData: FormData): Promise<ContactFormState> {
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, message } = validatedFields.data;
  console.log('Contact form submission received (Simulated):', { name, email, message });
  return { success: true, message: 'Your message has been sent successfully! (Simulated)' };
}

// --- About Me ---
const aboutInfoSchema = z.object({
  professionalSummary: z.string().min(50, { message: "Professional summary must be at least 50 characters." }),
  bio: z.string().min(50, { message: "Bio must be at least 50 characters." }),
  profileImageUrl: z.string().url({ message: "Invalid URL for profile image." }).optional().or(z.literal('')),
});

interface AboutInfoState {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof aboutInfoSchema>['fieldErrors'];
  updatedAboutData?: AboutData; // Changed from typeof aboutData to explicit type if available
}

export async function updateAboutInfo(prevState: AboutInfoState | undefined, formData: FormData): Promise<AboutInfoState> {
  const validatedFields = aboutInfoSchema.safeParse({
    professionalSummary: formData.get('professionalSummary'),
    bio: formData.get('bio'),
    profileImageUrl: formData.get('profileImageUrl'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  aboutData.professionalSummary = validatedFields.data.professionalSummary;
  aboutData.bio = validatedFields.data.bio;
  aboutData.profileImageUrl = validatedFields.data.profileImageUrl || siteSettingsData.defaultProfileImageUrl;
  
  console.log('About Me information updated:', aboutData);
  return { success: true, message: 'About Me information updated successfully!', updatedAboutData: {...aboutData} };
}

// --- Site Settings ---
const siteSettingsSchema = z.object({
  siteName: z.string().min(3, "Site name must be at least 3 characters."),
  defaultUserName: z.string().min(2, "Default user name must be at least 2 characters."),
  defaultUserSpecialization: z.string().min(5, "Specialization must be at least 5 characters."),
});

interface SiteSettingsState {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof siteSettingsSchema>['fieldErrors'];
  updatedSiteSettings?: SiteSettings;
}

export async function updateSiteSettings(prevState: SiteSettingsState | undefined, formData: FormData): Promise<SiteSettingsState> {
  const validatedFields = siteSettingsSchema.safeParse({
    siteName: formData.get('siteName'),
    defaultUserName: formData.get('defaultUserName'),
    defaultUserSpecialization: formData.get('defaultUserSpecialization'),
  });

  if (!validatedFields.success) {
    return { success: false, message: "Validation failed.", errors: validatedFields.error.flatten().fieldErrors };
  }
  
  siteSettingsData.siteName = validatedFields.data.siteName;
  siteSettingsData.defaultUserName = validatedFields.data.defaultUserName;
  siteSettingsData.defaultUserSpecialization = validatedFields.data.defaultUserSpecialization;
  
  console.log('Site Settings updated:', siteSettingsData);
  return { success: true, message: 'Site settings updated successfully!', updatedSiteSettings: {...siteSettingsData} };
}


// --- Skills CRUD ---
const skillSchema = z.object({
  id: z.string().optional(), 
  name: z.string().min(1, "Skill name is required."),
  level: z.coerce.number().min(0).max(100).optional(),
  category: z.enum(['Language', 'Framework/Library', 'Tool', 'Database', 'Cloud', 'Other']),
  iconName: z.string().optional().nullable(), 
});

interface SkillCrudState {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof skillSchema>['fieldErrors'];
  updatedSkill?: Skill;
  skills?: Skill[]; 
}

export async function saveSkillAction(prevState: SkillCrudState | undefined, formData: FormData): Promise<SkillCrudState> {
  const iconNameValue = formData.get('iconName') as string | null;
  const rawData = {
    id: formData.get('id') || undefined,
    name: formData.get('name'),
    level: formData.get('level') ? Number(formData.get('level')) : undefined,
    category: formData.get('category'),
    iconName: iconNameValue === NULL_ICON_VALUE ? null : (iconNameValue || undefined),
  };
  const validatedFields = skillSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { success: false, message: "Validation failed.", errors: validatedFields.error.flatten().fieldErrors };
  }
  
  let skillData = validatedFields.data as Skill; 
  const isNew = !skillData.id;

  if (!isNew && skillData.id) { // Update existing skill
    const index = skillsData.findIndex(s => s.id === skillData.id);
    if (index > -1) {
      skillsData[index] = { ...skillsData[index], ...skillData };
      console.log('Updating Skill:', skillsData[index]);
      return { success: true, message: `Skill '${skillData.name}' updated successfully!`, updatedSkill: skillsData[index], skills: [...skillsData] };
    } else {
       return { success: false, message: `Skill with ID '${skillData.id}' not found for update.` };
    }
  } else { // Add new skill
    skillData.id = `skill-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    skillsData.push(skillData);
    console.log('Adding Skill:', skillData);
    return { success: true, message: `Skill '${skillData.name}' added successfully!`, updatedSkill: skillData, skills: [...skillsData] };
  }
}

export async function deleteSkillAction(id: string): Promise<{ success: boolean; message: string; skills?: Skill[] }> {
  if (!id) return { success: false, message: "Skill ID is required." };
  
  const initialLength = skillsData.length;
  const newSkillsData = skillsData.filter(s => s.id !== id);
  
  if (newSkillsData.length < initialLength) {
    skillsData.length = 0; 
    skillsData.push(...newSkillsData);

    console.log('Deleting Skill, ID:', id);
    return { success: true, message: `Skill deleted successfully!`, skills: [...skillsData] };
  }
  return { success: false, message: "Skill not found for deletion." };
}


// --- Education CRUD ---
const educationItemSchema = z.object({
  id: z.string().optional(),
  degree: z.string().min(1, "Degree is required."),
  institution: z.string().min(1, "Institution is required."),
  period: z.string().min(1, "Period is required."),
  description: z.string().optional(),
  iconName: z.string().optional().nullable(),
});

interface EducationCrudState {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof educationItemSchema>['fieldErrors'];
  updatedItem?: EducationItem;
  educationItems?: EducationItem[];
}

export async function saveEducationItemAction(prevState: EducationCrudState | undefined, formData: FormData): Promise<EducationCrudState> {
  const iconNameValue = formData.get('iconName') as string | null;
  const rawData = {
    id: formData.get('id') || undefined,
    degree: formData.get('degree'),
    institution: formData.get('institution'),
    period: formData.get('period'),
    description: formData.get('description') || undefined,
    iconName: iconNameValue === NULL_ICON_VALUE ? null : (iconNameValue || undefined),
  };
  const validatedFields = educationItemSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { success: false, message: "Validation failed.", errors: validatedFields.error.flatten().fieldErrors };
  }

  let eduData = validatedFields.data as EducationItem;
  const isNew = !eduData.id;

  if (!isNew && eduData.id) {
    const index = educationData.findIndex(item => item.id === eduData.id);
    if (index > -1) {
      educationData[index] = { ...educationData[index], ...eduData };
      console.log('Updating Education Item:', educationData[index]);
      return { success: true, message: `Education item '${eduData.degree}' updated!`, updatedItem: educationData[index], educationItems: [...educationData] };
    }
    return { success: false, message: `Education item with ID '${eduData.id}' not found.` };
  } else {
    eduData.id = `edu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    educationData.push(eduData);
    console.log('Adding Education Item:', eduData);
    return { success: true, message: `Education item '${eduData.degree}' added!`, updatedItem: eduData, educationItems: [...educationData] };
  }
}

export async function deleteEducationItemAction(id: string): Promise<{ success: boolean; message: string; educationItems?: EducationItem[] }> {
  if (!id) return { success: false, message: "Education ID is required." };
  
  const initialLength = educationData.length;
  const newEducationData = educationData.filter(item => item.id !== id);

  if (newEducationData.length < initialLength) {
    educationData.length = 0;
    educationData.push(...newEducationData);
    console.log('Deleting Education Item, ID:', id);
    return { success: true, message: `Education item deleted!`, educationItems: [...educationData] };
  }
  return { success: false, message: "Education item not found." };
}


// --- Projects CRUD ---
const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  imageUrl: z.string().url("Valid image URL is required."),
  tags: z.string().transform(val => val.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)), 
  liveLink: z.string().url().optional().or(z.literal('')),
  repoLink: z.string().url().optional().or(z.literal('')),
  dataAiHint: z.string().optional(),
});

interface ProjectCrudState {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof projectSchema>['fieldErrors'];
  updatedProject?: Project;
  projects?: Project[];
}

export async function saveProjectAction(prevState: ProjectCrudState | undefined, formData: FormData): Promise<ProjectCrudState> {
  const rawData = {
    id: formData.get('id') || undefined,
    title: formData.get('title'),
    description: formData.get('description'),
    imageUrl: formData.get('imageUrl'),
    tags: formData.get('tags'), 
    liveLink: formData.get('liveLink') || undefined,
    repoLink: formData.get('repoLink') || undefined,
    dataAiHint: formData.get('dataAiHint') || undefined,
  };
  const validatedFields = projectSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { success: false, message: "Validation failed.", errors: validatedFields.error.flatten().fieldErrors };
  }
  
  let projectDataValue = validatedFields.data as Project; 
  const isNew = !projectDataValue.id;

  if (!isNew && projectDataValue.id) {
    const index = projectsData.findIndex(p => p.id === projectDataValue.id);
    if (index > -1) {
      projectsData[index] = { ...projectsData[index], ...projectDataValue };
      console.log('Updating Project:', projectsData[index]);
      return { success: true, message: `Project '${projectDataValue.title}' updated!`, updatedProject: projectsData[index], projects: [...projectsData] };
    }
    return { success: false, message: `Project with ID '${projectDataValue.id}' not found.` };
  } else {
    projectDataValue.id = `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    projectsData.push(projectDataValue);
    console.log('Adding Project:', projectDataValue);
    return { success: true, message: `Project '${projectDataValue.title}' added!`, updatedProject: projectDataValue, projects: [...projectsData] };
  }
}

export async function deleteProjectAction(id: string): Promise<{ success: boolean; message: string; projects?: Project[] }> {
  if (!id) return { success: false, message: "Project ID is required." };

  const initialLength = projectsData.length;
  const newProjectsData = projectsData.filter(p => p.id !== id);

  if (newProjectsData.length < initialLength) {
    projectsData.length = 0;
    projectsData.push(...newProjectsData);
    console.log('Deleting Project, ID:', id);
    return { success: true, message: `Project deleted!`, projects: [...projectsData] };
  }
  return { success: false, message: "Project not found." };
}


// --- Certifications CRUD ---
const certificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Certification name is required."),
  organization: z.string().min(1, "Organization is required."),
  date: z.string().min(1, "Date is required."), 
  verifyLink: z.string().url().optional().or(z.literal('')),
  iconName: z.string().optional().nullable(),
});

interface CertificationCrudState {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof certificationSchema>['fieldErrors'];
  updatedCertification?: Certification;
  certifications?: Certification[];
}

export async function saveCertificationAction(prevState: CertificationCrudState | undefined, formData: FormData): Promise<CertificationCrudState> {
  const iconNameValue = formData.get('iconName') as string | null;
  const rawData = {
    id: formData.get('id') || undefined,
    name: formData.get('name'),
    organization: formData.get('organization'),
    date: formData.get('date'),
    verifyLink: formData.get('verifyLink') || undefined,
    iconName: iconNameValue === NULL_ICON_VALUE ? null : (iconNameValue || undefined),
  };
  const validatedFields = certificationSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { success: false, message: "Validation failed.", errors: validatedFields.error.flatten().fieldErrors };
  }

  let certData = validatedFields.data as Certification;
  const isNew = !certData.id;

  if (!isNew && certData.id) {
    const index = certificationsData.findIndex(c => c.id === certData.id);
    if (index > -1) {
      certificationsData[index] = { ...certificationsData[index], ...certData };
      console.log('Updating Certification:', certificationsData[index]);
      return { success: true, message: `Certification '${certData.name}' updated!`, updatedCertification: certificationsData[index], certifications: [...certificationsData] };
    }
    return { success: false, message: `Certification with ID '${certData.id}' not found.` };
  } else {
    certData.id = `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    certificationsData.push(certData);
    console.log('Adding Certification:', certData);
    return { success: true, message: `Certification '${certData.name}' added!`, updatedCertification: certData, certifications: [...certificationsData] };
  }
}

export async function deleteCertificationAction(id: string): Promise<{ success: boolean; message: string; certifications?: Certification[] }> {
  if (!id) return { success: false, message: "Certification ID is required." };
  
  const initialLength = certificationsData.length;
  const newCertsData = certificationsData.filter(c => c.id !== id);

  if (newCertsData.length < initialLength) {
    certificationsData.length = 0;
    certificationsData.push(...newCertsData);
    console.log('Deleting Certification, ID:', id);
    return { success: true, message: `Certification deleted!`, certifications: [...certificationsData] };
  }
  return { success: false, message: "Certification not found." };
}
