
'use server';

import { z } from 'zod';
import type { Skill, EducationItem, Project, Certification, SiteSettings, AboutData, ContactDetails } from '@/lib/data';
import { db } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { 
  getAboutData, 
  getSiteSettings, 
  getSkills, 
  getEducationItems, 
  getProjects, 
  getCertifications 
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

  // This is a placeholder for actual authentication. 
  // In a real app, use Firebase Authentication or another secure method.
  if (email === (process.env.ADMIN_EMAIL || 'admin@gmail.com') && password === (process.env.ADMIN_PASSWORD || 'k4912005')) {
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
  try {
    // Example: Store contact message in Firebase
    const contactMessagesRef = db.ref('contactMessages');
    const newMessageRef = contactMessagesRef.push();
    await newMessageRef.set({
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
    });
    console.log('Contact form submission received and stored in Firebase:', { name, email });
    return { success: true, message: 'Your message has been sent successfully!' };
  } catch (error) {
    console.error("Error submitting contact form to Firebase:", error);
    return { success: false, message: 'Failed to send message. Please try again later.' };
  }
}

// --- About Me ---
const aboutInfoSchema = z.object({
  professionalSummary: z.string().min(10, { message: "Professional summary must be at least 10 characters." }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters." }),
  profileImageUrl: z.string().url({ message: "Invalid URL for profile image." }).optional().or(z.literal('')),
  dataAiHint: z.string().optional(),
});

interface AboutInfoState {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof aboutInfoSchema>['fieldErrors'];
  updatedAboutData?: AboutData;
}

export async function updateAboutInfo(prevState: AboutInfoState | undefined, formData: FormData): Promise<AboutInfoState> {
  const validatedFields = aboutInfoSchema.safeParse({
    professionalSummary: formData.get('professionalSummary'),
    bio: formData.get('bio'),
    profileImageUrl: formData.get('profileImageUrl'),
    dataAiHint: formData.get('dataAiHint') || undefined,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const currentSettings = await getSiteSettings(); // To get default profile image if needed
    const dataToUpdate: AboutData = {
      professionalSummary: validatedFields.data.professionalSummary,
      bio: validatedFields.data.bio,
      profileImageUrl: validatedFields.data.profileImageUrl || currentSettings.defaultProfileImageUrl,
      dataAiHint: validatedFields.data.dataAiHint
    };
    await db.ref('/aboutInfo').set(dataToUpdate);
    
    console.log('About Me information updated in Firebase:', dataToUpdate);
    revalidatePath('/');
    revalidatePath('/admin/about');
    const updatedData = await getAboutData(); // Fetch fresh data
    return { success: true, message: 'About Me information updated successfully!', updatedAboutData: updatedData };
  } catch (error) {
    console.error("Error updating About Me info in Firebase:", error);
    return { success: false, message: 'Failed to update About Me information.' };
  }
}

// --- Site Settings ---
const contactDetailsSchema = z.object({
  email: z.string().email("Invalid email for contact details."),
  linkedin: z.string().url("Invalid LinkedIn URL."),
  github: z.string().url("Invalid GitHub URL."),
  twitter: z.string().url("Invalid Twitter URL.").optional().or(z.literal('')),
});

const siteSettingsSchema = z.object({
  siteName: z.string().min(3, "Site name must be at least 3 characters."),
  defaultUserName: z.string().min(2, "Default user name must be at least 2 characters."),
  defaultUserSpecialization: z.string().min(5, "Specialization must be at least 5 characters."),
  defaultProfileImageUrl: z.string().url("Invalid default profile image URL."),
  contactEmail: z.string().email(),
  contactLinkedin: z.string().url(),
  contactGithub: z.string().url(),
  contactTwitter: z.string().url().optional().or(z.literal('')),
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
    defaultProfileImageUrl: formData.get('defaultProfileImageUrl'),
    contactEmail: formData.get('contactEmail'),
    contactLinkedin: formData.get('contactLinkedin'),
    contactGithub: formData.get('contactGithub'),
    contactTwitter: formData.get('contactTwitter'),
  });

  if (!validatedFields.success) {
    return { success: false, message: "Validation failed.", errors: validatedFields.error.flatten().fieldErrors };
  }
  
  try {
    const settingsToUpdate: SiteSettings = {
      siteName: validatedFields.data.siteName,
      defaultUserName: validatedFields.data.defaultUserName,
      defaultUserSpecialization: validatedFields.data.defaultUserSpecialization,
      defaultProfileImageUrl: validatedFields.data.defaultProfileImageUrl,
      contactDetails: {
        email: validatedFields.data.contactEmail,
        linkedin: validatedFields.data.contactLinkedin,
        github: validatedFields.data.contactGithub,
        twitter: validatedFields.data.contactTwitter || undefined,
      }
    };
    await db.ref('/siteSettings').set(settingsToUpdate);
    
    console.log('Site Settings updated in Firebase:', settingsToUpdate);
    revalidatePath('/');
    revalidatePath('/admin/settings');
    const updatedSettings = await getSiteSettings();
    return { success: true, message: 'Site settings updated successfully!', updatedSiteSettings: updatedSettings };
  } catch (error) {
    console.error("Error updating Site Settings in Firebase:", error);
    return { success: false, message: 'Failed to update site settings.' };
  }
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
  
  let skillData = { ...validatedFields.data } as Omit<Skill, 'id'> & { id?: string };
  const isNew = !skillData.id;
  const skillId = skillData.id || db.ref('/skills').push().key;

  if (!skillId) {
    return { success: false, message: "Failed to generate skill ID." };
  }
  
  const finalSkillData: Skill = {
    ...skillData,
    id: skillId,
    level: skillData.level ?? undefined, // Ensure level is explicitly undefined if not present
    iconName: skillData.iconName === NULL_ICON_VALUE ? null : skillData.iconName,
  };

  try {
    await db.ref(`/skills/${skillId}`).set(finalSkillData);
    console.log(isNew ? 'Adding Skill to Firebase:' : 'Updating Skill in Firebase:', finalSkillData);
    revalidatePath('/');
    revalidatePath('/admin/skills');
    const allSkills = await getSkills();
    return { 
      success: true, 
      message: `Skill '${finalSkillData.name}' ${isNew ? 'added' : 'updated'} successfully!`, 
      updatedSkill: finalSkillData, 
      skills: allSkills 
    };
  } catch (error) {
    console.error("Error saving skill to Firebase:", error);
    return { success: false, message: `Failed to save skill '${finalSkillData.name}'.` };
  }
}

export async function deleteSkillAction(id: string): Promise<{ success: boolean; message: string; skills?: Skill[] }> {
  if (!id) return { success: false, message: "Skill ID is required." };
  
  try {
    await db.ref(`/skills/${id}`).remove();
    console.log('Deleting Skill from Firebase, ID:', id);
    revalidatePath('/');
    revalidatePath('/admin/skills');
    const allSkills = await getSkills();
    return { success: true, message: `Skill deleted successfully!`, skills: allSkills };
  } catch (error) {
    console.error("Error deleting skill from Firebase:", error);
    return { success: false, message: "Failed to delete skill." };
  }
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

  let eduData = { ...validatedFields.data } as Omit<EducationItem, 'id'> & { id?: string };
  const isNew = !eduData.id;
  const eduId = eduData.id || db.ref('/education').push().key;

  if (!eduId) {
    return { success: false, message: "Failed to generate education item ID." };
  }

  const finalEduData: EducationItem = {
    ...eduData,
    id: eduId,
    iconName: eduData.iconName === NULL_ICON_VALUE ? null : eduData.iconName,
  };
  
  try {
    await db.ref(`/education/${eduId}`).set(finalEduData);
    console.log(isNew ? 'Adding Education Item to Firebase:' : 'Updating Education Item in Firebase:', finalEduData);
    revalidatePath('/');
    revalidatePath('/admin/education');
    const allItems = await getEducationItems();
    return { 
      success: true, 
      message: `Education item '${finalEduData.degree}' ${isNew ? 'added' : 'updated'} successfully!`, 
      updatedItem: finalEduData, 
      educationItems: allItems 
    };
  } catch (error) {
    console.error("Error saving education item to Firebase:", error);
    return { success: false, message: `Failed to save education item '${finalEduData.degree}'.` };
  }
}

export async function deleteEducationItemAction(id: string): Promise<{ success: boolean; message: string; educationItems?: EducationItem[] }> {
  if (!id) return { success: false, message: "Education ID is required." };
  
  try {
    await db.ref(`/education/${id}`).remove();
    console.log('Deleting Education Item from Firebase, ID:', id);
    revalidatePath('/');
    revalidatePath('/admin/education');
    const allItems = await getEducationItems();
    return { success: true, message: `Education item deleted successfully!`, educationItems: allItems };
  } catch (error) {
    console.error("Error deleting education item from Firebase:", error);
    return { success: false, message: "Failed to delete education item." };
  }
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
  
  let projectData = { ...validatedFields.data } as Omit<Project, 'id' | 'tags'> & { id?: string, tags: string[] }; 
  const isNew = !projectData.id;
  const projectId = projectData.id || db.ref('/projects').push().key;

  if (!projectId) {
    return { success: false, message: "Failed to generate project ID." };
  }

  const finalProjectData: Project = {
    ...projectData,
    id: projectId,
    liveLink: projectData.liveLink || undefined,
    repoLink: projectData.repoLink || undefined,
    dataAiHint: projectData.dataAiHint || undefined,
  };

  try {
    await db.ref(`/projects/${projectId}`).set(finalProjectData);
    console.log(isNew ? 'Adding Project to Firebase:' : 'Updating Project in Firebase:', finalProjectData);
    revalidatePath('/');
    revalidatePath('/admin/projects');
    const allProjects = await getProjects();
    return { 
      success: true, 
      message: `Project '${finalProjectData.title}' ${isNew ? 'added' : 'updated'} successfully!`, 
      updatedProject: finalProjectData, 
      projects: allProjects
    };
  } catch (error) {
    console.error("Error saving project to Firebase:", error);
    return { success: false, message: `Failed to save project '${finalProjectData.title}'.` };
  }
}

export async function deleteProjectAction(id: string): Promise<{ success: boolean; message: string; projects?: Project[] }> {
  if (!id) return { success: false, message: "Project ID is required." };

  try {
    await db.ref(`/projects/${id}`).remove();
    console.log('Deleting Project from Firebase, ID:', id);
    revalidatePath('/');
    revalidatePath('/admin/projects');
    const allProjects = await getProjects();
    return { success: true, message: `Project deleted successfully!`, projects: allProjects };
  } catch (error) {
    console.error("Error deleting project from Firebase:", error);
    return { success: false, message: "Failed to delete project." };
  }
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

  let certData = { ...validatedFields.data } as Omit<Certification, 'id'> & { id?: string };
  const isNew = !certData.id;
  const certId = certData.id || db.ref('/certifications').push().key;

  if(!certId) {
    return { success: false, message: "Failed to generate certification ID."};
  }
  
  const finalCertData: Certification = {
    ...certData,
    id: certId,
    verifyLink: certData.verifyLink || undefined,
    iconName: certData.iconName === NULL_ICON_VALUE ? null : certData.iconName,
  };

  try {
    await db.ref(`/certifications/${certId}`).set(finalCertData);
    console.log(isNew ? 'Adding Certification to Firebase:' : 'Updating Certification in Firebase:', finalCertData);
    revalidatePath('/');
    revalidatePath('/admin/certifications');
    const allCerts = await getCertifications();
    return { 
      success: true, 
      message: `Certification '${finalCertData.name}' ${isNew ? 'added' : 'updated'} successfully!`, 
      updatedCertification: finalCertData, 
      certifications: allCerts
    };
  } catch (error) {
    console.error("Error saving certification to Firebase:", error);
    return { success: false, message: `Failed to save certification '${finalCertData.name}'.` };
  }
}

export async function deleteCertificationAction(id: string): Promise<{ success: boolean; message: string; certifications?: Certification[] }> {
  if (!id) return { success: false, message: "Certification ID is required." };
  
  try {
    await db.ref(`/certifications/${id}`).remove();
    console.log('Deleting Certification from Firebase, ID:', id);
    revalidatePath('/');
    revalidatePath('/admin/certifications');
    const allCerts = await getCertifications();
    return { success: true, message: `Certification deleted successfully!`, certifications: allCerts };
  } catch (error) {
    console.error("Error deleting certification from Firebase:", error);
    return { success: false, message: "Failed to delete certification." };
  }
}

// --- Data Fetcher Actions for Admin Pages ---
export async function fetchAboutDataForAdmin(): Promise<AboutData> {
  return getAboutData();
}
export async function fetchSiteSettingsForAdmin(): Promise<SiteSettings> {
  return getSiteSettings();
}
export async function fetchSkillsForAdmin(): Promise<Skill[]> {
  return getSkills();
}
export async function fetchEducationItemsForAdmin(): Promise<EducationItem[]> {
  return getEducationItems();
}
export async function fetchProjectsForAdmin(): Promise<Project[]> {
  return getProjects();
}
export async function fetchCertificationsForAdmin(): Promise<Certification[]> {
  return getCertifications();
}
