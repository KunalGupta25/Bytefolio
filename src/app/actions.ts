
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
  getCertifications,
  getPageViews
} from '@/lib/data';
import { Resend } from 'resend';


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
      message: "Validation failed. Please check the specific error messages under each field.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, message } = validatedFields.data;
  try {
    const contactMessagesRef = db.ref('contactMessages');
    const newMessageRef = contactMessagesRef.push();
    await newMessageRef.set({
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
    });
    console.log('Contact form submission received and stored in Firebase:', { name, email });

    if (process.env.RESEND_API_KEY && process.env.CONTACT_FORM_RECIPIENT_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      try {
        await resend.emails.send({
          from: 'ByteFolio Contact <onboarding@resend.dev>', 
          to: process.env.CONTACT_FORM_RECIPIENT_EMAIL,
          subject: `New Contact Form Submission from ${name}`,
          html: `
            <p>You received a new message from your portfolio contact form:</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
        });
        console.log('Contact form email sent successfully via Resend.');
      } catch (emailError) {
        console.error("Error sending contact form email via Resend:", emailError);
      }
    } else {
      console.warn('Resend API key or recipient email not configured in environment variables. Skipping email notification.');
    }

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
  profileImageUrl: z.string().optional().or(z.literal('')), 
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
    const currentSettings = await getSiteSettings(); 
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
    const updatedData = await getAboutData(); 
    return { success: true, message: 'About Me information updated successfully!', updatedAboutData: updatedData };
  } catch (error) {
    console.error("Error updating About Me info in Firebase:", error);
    return { success: false, message: 'Failed to update About Me information.' };
  }
}

// --- Site Settings ---
const siteSettingsSchema = z.object({
  siteName: z.string().min(3, "Site name must be at least 3 characters."),
  siteTitleSuffix: z.string().min(3, "Site title suffix must be at least 3 characters."),
  siteDescription: z.string().min(10, "Site description must be at least 10 characters.").max(160, "Site description should be max 160 characters."),
  defaultUserName: z.string().min(2, "Default user name must be at least 2 characters."),
  defaultUserSpecialization: z.string().min(5, "Specialization must be at least 5 characters."),
  defaultProfileImageUrl: z.string().url("Invalid default profile image URL."),
  faviconUrl: z.string().optional().or(z.literal('')),
  contactEmail: z.string().email(),
  contactLinkedin: z.string().url(),
  contactGithub: z.string().url(),
  contactTwitter: z.string().url().optional().or(z.literal('')),
  customHtmlWidget: z.preprocess((val) => val ?? undefined, z.string().optional().nullable()),
  blogUrl: z.string().url("Invalid Blog URL. Must be a full URL.").optional().or(z.literal('')),
  kofiUrl: z.string().url("Invalid Ko-fi URL. Must be a full URL.").optional().or(z.literal('')),
  // rssFeedUrl removed
});

interface SiteSettingsState {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof siteSettingsSchema>['fieldErrors'];
  updatedSiteSettings?: SiteSettings;
}

export async function updateSiteSettings(prevState: SiteSettingsState | undefined, formData: FormData): Promise<SiteSettingsState> {
  console.log("--- updateSiteSettings Action Triggered ---");
  console.log("Received formData entries:");
  for (const [key, value] of formData.entries()) {
    console.log(`  ${key}: "${value}"`);
  }

  const dataToValidate = {
    siteName: formData.get('siteName'),
    siteTitleSuffix: formData.get('siteTitleSuffix'),
    siteDescription: formData.get('siteDescription'),
    defaultUserName: formData.get('defaultUserName'),
    defaultUserSpecialization: formData.get('defaultUserSpecialization'),
    defaultProfileImageUrl: formData.get('defaultProfileImageUrl'),
    faviconUrl: formData.get('faviconUrl'),
    contactEmail: formData.get('contactEmail'),
    contactLinkedin: formData.get('contactLinkedin'),
    contactGithub: formData.get('contactGithub'),
    contactTwitter: formData.get('contactTwitter'),
    customHtmlWidget: formData.get('customHtmlWidget'),
    blogUrl: formData.get('blogUrl'),
    kofiUrl: formData.get('kofiUrl'),
    // rssFeedUrl removed
  };
  
  console.log("Data prepared for Zod validation:", dataToValidate);

  const validatedFields = siteSettingsSchema.safeParse(dataToValidate);

  if (!validatedFields.success) {
    console.error("Site Settings Zod validation failed. Errors:", JSON.stringify(validatedFields.error.flatten().fieldErrors, null, 2));
    return { 
      success: false, 
      message: "Validation failed. Please check the specific error messages under each field. Server logs contain more details.", 
      errors: validatedFields.error.flatten().fieldErrors 
    };
  }
  
  console.log("Site Settings Zod validation successful. Validated data:", validatedFields.data);
  
  try {
    const currentSettingsSnapshot = await db.ref('/siteSettings').once('value');
    const currentSettings = currentSettingsSnapshot.val() || {};

    const settingsToUpdate: Partial<SiteSettings> & { contactDetails: ContactDetails } = { 
      siteName: validatedFields.data.siteName,
      siteTitleSuffix: validatedFields.data.siteTitleSuffix,
      siteDescription: validatedFields.data.siteDescription,
      defaultUserName: validatedFields.data.defaultUserName,
      defaultUserSpecialization: validatedFields.data.defaultUserSpecialization,
      defaultProfileImageUrl: validatedFields.data.defaultProfileImageUrl,
      faviconUrl: validatedFields.data.faviconUrl || undefined,
      blogUrl: validatedFields.data.blogUrl || undefined,
      kofiUrl: validatedFields.data.kofiUrl || undefined,
      // rssFeedUrl removed
      contactDetails: {
        email: validatedFields.data.contactEmail,
        linkedin: validatedFields.data.contactLinkedin,
        github: validatedFields.data.contactGithub,
        twitter: validatedFields.data.contactTwitter || undefined,
      }
    };

    // Only update customHtmlWidget if it was part of the submitted form
    // This prevents it from being wiped when saving from the main settings page
    if (formData.has('customHtmlWidget')) {
      settingsToUpdate.customHtmlWidget = validatedFields.data.customHtmlWidget || undefined;
    } else if (currentSettings.customHtmlWidget !== undefined) {
      // Preserve existing value if not submitted
      settingsToUpdate.customHtmlWidget = currentSettings.customHtmlWidget;
    }


    await db.ref('/siteSettings').update(settingsToUpdate); 
    
    console.log('Site Settings updated in Firebase:', settingsToUpdate);
    revalidatePath('/'); 
    revalidatePath('/layout', 'layout'); 
    revalidatePath('/admin/settings');
    revalidatePath('/admin/integrations');
    const updatedSettings = await getSiteSettings(); 
    return { success: true, message: 'Site settings updated successfully!', updatedSiteSettings: updatedSettings };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error updating Site Settings in Firebase: ${errorMessage}`, error);
    return { success: false, message: `Failed to update site settings. Server error: ${errorMessage}` };
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
    level: skillData.level ?? undefined, 
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
  imageUrl: z.string().url("Valid image URL is required. Please include http:// or https://"),
  tags: z.string().optional().transform(val => (val || "").split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)), 
  liveLink: z.string().url("Invalid Live Demo URL. Must be a full URL.").optional().or(z.literal('')),
  repoLink: z.string().url("Invalid Repository URL. Must be a full URL.").optional().or(z.literal('')),
  dataAiHint: z.string().optional(),
  createdAt: z.string().datetime().optional(), 
});

interface ProjectCrudState {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof projectSchema>['fieldErrors'];
  updatedProject?: Project;
  projects?: Project[];
}

export async function saveProjectAction(prevState: ProjectCrudState | undefined, formData: FormData): Promise<ProjectCrudState> {
  console.log("saveProjectAction called. FormData received:", Object.fromEntries(formData.entries()));
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
  console.log("Raw data for validation:", rawData);

  const validatedFields = projectSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    console.error("Project validation failed. Errors:", JSON.stringify(errors, null, 2));
    return { 
      success: false, 
      message: "Validation failed. Please check the highlighted fields for errors. Ensure all URLs are complete (e.g., start with http:// or https://).", 
      errors: errors 
    };
  }
  
  console.log("Project validation successful. Validated data:", validatedFields.data);
  const projectData = validatedFields.data;
  const isNew = !projectData.id;
  const projectId = projectData.id || db.ref('/projects').push().key;

  if (!projectId) {
    console.error("Failed to generate project ID.");
    return { success: false, message: "Failed to generate project ID." };
  }

  const dataForFirebase: Partial<Project> & { id: string; createdAt: string } = {
    id: projectId,
    title: projectData.title,
    description: projectData.description,
    imageUrl: projectData.imageUrl,
    tags: projectData.tags,
    createdAt: isNew ? new Date().toISOString() : projectData.createdAt || new Date().toISOString(), 
  };

  if (projectData.liveLink) {
    dataForFirebase.liveLink = projectData.liveLink;
  }
  if (projectData.repoLink) {
    dataForFirebase.repoLink = projectData.repoLink;
  }
  if (projectData.dataAiHint) {
    dataForFirebase.dataAiHint = projectData.dataAiHint;
  }

  if (!isNew && !projectData.createdAt) {
    try {
      const existingProjectSnapshot = await db.ref(`/projects/${projectId}`).once('value');
      const existingProject = existingProjectSnapshot.val();
      if (existingProject && existingProject.createdAt) {
        dataForFirebase.createdAt = existingProject.createdAt;
      }
    } catch (fetchError) {
      console.warn(`Could not fetch existing project ${projectId} to preserve createdAt:`, fetchError);
    }
  }
  
  console.log("Final project data to save to Firebase:", dataForFirebase);

  try {
    await db.ref(`/projects/${projectId}`).set(dataForFirebase as Project); 
    console.log(isNew ? 'Adding Project to Firebase successful:' : 'Updating Project in Firebase successful:', dataForFirebase);
    revalidatePath('/');
    revalidatePath('/admin/projects');
    const allProjects = await getProjects();
    return { 
      success: true, 
      message: `Project '${dataForFirebase.title}' ${isNew ? 'added' : 'updated'} successfully!`, 
      updatedProject: dataForFirebase as Project, 
      projects: allProjects
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error saving project '${dataForFirebase.title}' to Firebase:`, errorMessage);
    return { 
      success: false, 
      message: `Failed to save project '${dataForFirebase.title}'. Error: ${errorMessage}` 
    };
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
export async function fetchPageViewsForAdmin(): Promise<number> {
  return getPageViews();
}
    
