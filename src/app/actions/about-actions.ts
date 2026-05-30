'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { getAboutData, getSiteSettings } from '@/lib/data';
import type { AboutData } from '@/lib/data';

const aboutInfoSchema = z.object({
  professionalSummary: z.string().min(10, {
    message: 'Professional summary must be at least 10 characters.',
  }),
  bio: z.string().min(10, { message: 'Bio must be at least 10 characters.' }),
  profileImageUrl: z.string().optional().or(z.literal('')),
  dataAiHint: z.string().optional(),
});

export interface AboutInfoState {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof aboutInfoSchema>['fieldErrors'];
  updatedAboutData?: AboutData;
}

export async function updateAboutInfo(
  prevState: AboutInfoState | undefined,
  formData: FormData
): Promise<AboutInfoState> {
  const validatedFields = aboutInfoSchema.safeParse({
    professionalSummary: formData.get('professionalSummary'),
    bio: formData.get('bio'),
    profileImageUrl: formData.get('profileImageUrl'),
    dataAiHint: formData.get('dataAiHint') || undefined,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const currentSettings = await getSiteSettings();
    const dataToUpdate: AboutData = {
      professionalSummary: validatedFields.data.professionalSummary,
      bio: validatedFields.data.bio,
      profileImageUrl:
        validatedFields.data.profileImageUrl || currentSettings.defaultProfileImageUrl,
      dataAiHint: validatedFields.data.dataAiHint,
    };
    await db.ref('/aboutInfo').set(dataToUpdate);

    revalidatePath('/');
    revalidatePath('/admin/about');
    const updatedData = await getAboutData();
    return {
      success: true,
      message: 'About Me information updated successfully!',
      updatedAboutData: updatedData,
    };
  } catch (error) {
    console.error('Error updating About Me info in Firebase:', error);
    return { success: false, message: 'Failed to update About Me information.' };
  }
}

export async function fetchAboutDataForAdmin(): Promise<AboutData> {
  return getAboutData();
}
