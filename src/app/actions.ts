
'use server';

import { z } from 'zod';
import type { Skill, EducationItem, Project, Certification, SiteSettings } from '@/lib/data';
import { siteSettingsData } from '@/lib/data'; // For default site settings

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

  // Hardcoded credentials for demonstration
  if (email === 'admin@example.com' && password === 'k4912005') {
    // In a real app, set up a session (e.g., httpOnly cookie)
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


// --- Contact Form (Existing) ---
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

// --- About Me (Existing, modified for clarity) ---
const aboutInfoSchema = z.object({
  professionalSummary: z.string().min(50, { message: "Professional summary must be at least 50 characters." }),
  bio: z.string().min(50, { message: "Bio must be at least 50 characters." }),
  profileImageUrl: z.string().url({ message: "Invalid URL for profile image." }).optional().or(z.literal('')),
});

interface AboutInfoState {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof aboutInfoSchema>['fieldErrors'];
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
  console.log('About Me information update (Simulated):', validatedFields.data);
  // SIMULATION: In a real app, update a database here. Static data in src/lib/data.ts is NOT modified.
  return { success: true, message: 'About Me information updated successfully! (Simulated)' };
}

// --- Site Settings ---
const siteSettingsSchema = z.object({
  siteName: z.string().min(3, "Site name must be at least 3 characters."),
  defaultUserName: z.string().min(2, "Default user name must be at least 2 characters."),
  defaultUserSpecialization: z.string().min(5, "Specialization must be at least 5 characters."),
  // defaultProfileImageUrl can be part of about me or here if it's a fallback
});

interface SiteSettingsState {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof siteSettingsSchema>['fieldErrors'];
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
  console.log('Site Settings update (Simulated):', validatedFields.data);
  // SIMULATION: Update database. Static data in src/lib/data.ts is NOT modified.
  return { success: true, message: 'Site settings updated successfully! (Simulated)' };
}


// --- Skills CRUD ---
const skillSchema = z.object({
  id: z.string().optional(), // For editing existing skills
  name: z.string().min(1, "Skill name is required."),
  level: z.coerce.number().min(0).max(100).optional(),
  category: z.enum(['Language', 'Framework/Library', 'Tool', 'Database', 'Cloud', 'Other']),
  iconName: z.string().optional(), // Optional: name of a Lucide icon
});

interface SkillCrudState {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof skillSchema>['fieldErrors'];
  updatedSkill?: Skill; // For optimistic updates or re-fetching
}

export async function saveSkillAction(prevState: SkillCrudState | undefined, formData: FormData): Promise<SkillCrudState> {
  const rawData = {
    id: formData.get('id') || undefined,
    name: formData.get('name'),
    level: formData.get('level') ? Number(formData.get('level')) : undefined,
    category: formData.get('category'),
    iconName: formData.get('iconName') || undefined,
  };
  const validatedFields = skillSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { success: false, message: "Validation failed.", errors: validatedFields.error.flatten().fieldErrors };
  }
  
  const skillData = validatedFields.data as Skill; // Cast after validation
  if (skillData.id) {
    console.log('Updating Skill (Simulated):', skillData);
  } else {
    skillData.id = `skill-${Date.now()}`; // Simulate ID generation
    console.log('Adding Skill (Simulated):', skillData);
  }
  // SIMULATION: Update database.
  return { success: true, message: `Skill '${skillData.name}' saved successfully! (Simulated)`, updatedSkill: skillData };
}

export async function deleteSkillAction(id: string): Promise<{ success: boolean; message: string }> {
  if (!id) return { success: false, message: "Skill ID is required." };
  console.log('Deleting Skill (Simulated):', id);
  // SIMULATION: Delete from database.
  return { success: true, message: `Skill deleted successfully! (Simulated)` };
}


// --- Education CRUD ---
const educationItemSchema = z.object({
  id: z.string().optional(),
  degree: z.string().min(1, "Degree is required."),
  institution: z.string().min(1, "Institution is required."),
  period: z.string().min(1, "Period is required."),
  description: z.string().optional(),
  iconName: z.string().optional(),
});

interface EducationCrudState {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof educationItemSchema>['fieldErrors'];
  updatedItem?: EducationItem;
}

export async function saveEducationItemAction(prevState: EducationCrudState | undefined, formData: FormData): Promise<EducationCrudState> {
  const rawData = {
    id: formData.get('id') || undefined,
    degree: formData.get('degree'),
    institution: formData.get('institution'),
    period: formData.get('period'),
    description: formData.get('description') || undefined,
    iconName: formData.get('iconName') || undefined,
  };
  const validatedFields = educationItemSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { success: false, message: "Validation failed.", errors: validatedFields.error.flatten().fieldErrors };
  }

  const eduData = validatedFields.data as EducationItem;
  if (eduData.id) {
    console.log('Updating Education Item (Simulated):', eduData);
  } else {
    eduData.id = `edu-${Date.now()}`;
    console.log('Adding Education Item (Simulated):', eduData);
  }
  return { success: true, message: `Education item '${eduData.degree}' saved! (Simulated)`, updatedItem: eduData };
}

export async function deleteEducationItemAction(id: string): Promise<{ success: boolean; message: string }> {
  if (!id) return { success: false, message: "Education ID is required." };
  console.log('Deleting Education Item (Simulated):', id);
  return { success: true, message: `Education item deleted! (Simulated)` };
}


// --- Projects CRUD ---
const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  imageUrl: z.string().url("Valid image URL is required."),
  tags: z.string().transform(val => val.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)), // Comma-separated string to array
  liveLink: z.string().url().optional().or(z.literal('')),
  repoLink: z.string().url().optional().or(z.literal('')),
  dataAiHint: z.string().optional(),
});

interface ProjectCrudState {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof projectSchema>['fieldErrors'];
  updatedProject?: Project;
}

export async function saveProjectAction(prevState: ProjectCrudState | undefined, formData: FormData): Promise<ProjectCrudState> {
  const rawData = {
    id: formData.get('id') || undefined,
    title: formData.get('title'),
    description: formData.get('description'),
    imageUrl: formData.get('imageUrl'),
    tags: formData.get('tags'), // Will be processed by Zod transform
    liveLink: formData.get('liveLink') || undefined,
    repoLink: formData.get('repoLink') || undefined,
    dataAiHint: formData.get('dataAiHint') || undefined,
  };
  const validatedFields = projectSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { success: false, message: "Validation failed.", errors: validatedFields.error.flatten().fieldErrors };
  }
  
  const projectData = validatedFields.data as Omit<Project, 'tags'> & { tags: string[] }; // Zod transform handles tags
  if (projectData.id) {
    console.log('Updating Project (Simulated):', projectData);
  } else {
    projectData.id = `project-${Date.now()}`;
    console.log('Adding Project (Simulated):', projectData);
  }
  return { success: true, message: `Project '${projectData.title}' saved! (Simulated)`, updatedProject: projectData as Project };
}

export async function deleteProjectAction(id: string): Promise<{ success: boolean; message: string }> {
  if (!id) return { success: false, message: "Project ID is required." };
  console.log('Deleting Project (Simulated):', id);
  return { success: true, message: `Project deleted! (Simulated)` };
}


// --- Certifications CRUD ---
const certificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Certification name is required."),
  organization: z.string().min(1, "Organization is required."),
  date: z.string().min(1, "Date is required."), // Consider date validation/parsing if needed
  verifyLink: z.string().url().optional().or(z.literal('')),
  iconName: z.string().optional(),
});

interface CertificationCrudState {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof certificationSchema>['fieldErrors'];
  updatedCertification?: Certification;
}

export async function saveCertificationAction(prevState: CertificationCrudState | undefined, formData: FormData): Promise<CertificationCrudState> {
  const rawData = {
    id: formData.get('id') || undefined,
    name: formData.get('name'),
    organization: formData.get('organization'),
    date: formData.get('date'),
    verifyLink: formData.get('verifyLink') || undefined,
    iconName: formData.get('iconName') || undefined,
  };
  const validatedFields = certificationSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { success: false, message: "Validation failed.", errors: validatedFields.error.flatten().fieldErrors };
  }

  const certData = validatedFields.data as Certification;
  if (certData.id) {
    console.log('Updating Certification (Simulated):', certData);
  } else {
    certData.id = `cert-${Date.now()}`;
    console.log('Adding Certification (Simulated):', certData);
  }
  return { success: true, message: `Certification '${certData.name}' saved! (Simulated)`, updatedCertification: certData };
}

export async function deleteCertificationAction(id: string): Promise<{ success: boolean; message: string }> {
  if (!id) return { success: false, message: "Certification ID is required." };
  console.log('Deleting Certification (Simulated):', id);
  return { success: true, message: `Certification deleted! (Simulated)` };
}
