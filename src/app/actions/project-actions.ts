'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { getProjects } from '@/lib/data';
import type { Project } from '@/lib/data';

const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  imageUrl: z
    .string()
    .url('Valid image URL is required. Please include http:// or https://'),
  tags: z
    .string()
    .optional()
    .transform((val) =>
      (val || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
    ),
  liveLink: z
    .string()
    .url('Invalid Live Demo URL. Must be a full URL.')
    .optional()
    .or(z.literal('')),
  repoLink: z
    .string()
    .url('Invalid Repository URL. Must be a full URL.')
    .optional()
    .or(z.literal('')),
  dataAiHint: z.string().optional(),
  createdAt: z.string().datetime().optional(),
});

export interface ProjectCrudState {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof projectSchema>['fieldErrors'];
  updatedProject?: Project;
  projects?: Project[];
}

export async function saveProjectAction(
  prevState: ProjectCrudState | undefined,
  formData: FormData
): Promise<ProjectCrudState> {
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
    return {
      success: false,
      message: 'Validation failed. Please check the highlighted fields for errors.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const projectData = validatedFields.data;
  const isNew = !projectData.id;
  const projectId = projectData.id || db.ref('/projects').push().key;

  if (!projectId) {
    return { success: false, message: 'Failed to generate project ID.' };
  }

  const dataForFirebase: Partial<Project> & { id: string; createdAt: string } = {
    id: projectId,
    title: projectData.title,
    description: projectData.description,
    imageUrl: projectData.imageUrl,
    tags: projectData.tags,
    createdAt: isNew
      ? new Date().toISOString()
      : projectData.createdAt || new Date().toISOString(),
  };

  if (projectData.liveLink) dataForFirebase.liveLink = projectData.liveLink;
  if (projectData.repoLink) dataForFirebase.repoLink = projectData.repoLink;
  if (projectData.dataAiHint) dataForFirebase.dataAiHint = projectData.dataAiHint;

  // Preserve createdAt for existing projects when not provided
  if (!isNew && !projectData.createdAt) {
    try {
      const existingSnapshot = await db.ref(`/projects/${projectId}`).once('value');
      const existing = existingSnapshot.val() as { createdAt?: string } | null;
      if (existing?.createdAt) {
        dataForFirebase.createdAt = existing.createdAt;
      }
    } catch (fetchError) {
      console.warn(`Could not fetch existing project ${projectId}:`, fetchError);
    }
  }

  try {
    await db.ref(`/projects/${projectId}`).set(dataForFirebase as Project);
    revalidatePath('/');
    revalidatePath('/admin/projects');
    const allProjects = await getProjects();
    return {
      success: true,
      message: `Project '${dataForFirebase.title}' ${isNew ? 'added' : 'updated'} successfully!`,
      updatedProject: dataForFirebase as Project,
      projects: allProjects,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Failed to save project '${dataForFirebase.title}'. Error: ${errorMessage}`,
    };
  }
}

export async function deleteProjectAction(
  id: string
): Promise<{ success: boolean; message: string; projects?: Project[] }> {
  if (!id) return { success: false, message: 'Project ID is required.' };

  try {
    await db.ref(`/projects/${id}`).remove();
    revalidatePath('/');
    revalidatePath('/admin/projects');
    const allProjects = await getProjects();
    return { success: true, message: 'Project deleted successfully!', projects: allProjects };
  } catch (error) {
    console.error('Error deleting project from Firebase:', error);
    return { success: false, message: 'Failed to delete project.' };
  }
}

export async function fetchProjectsForAdmin(): Promise<Project[]> {
  return getProjects();
}
