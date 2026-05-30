'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { getEducationItems } from '@/lib/data';
import type { EducationItem } from '@/lib/data';

const NULL_ICON_VALUE = '--no-icon--';

const educationItemSchema = z.object({
  id: z.string().optional(),
  degree: z.string().min(1, 'Degree is required.'),
  institution: z.string().min(1, 'Institution is required.'),
  period: z.string().min(1, 'Period is required.'),
  description: z.string().optional(),
  iconName: z.string().optional().nullable(),
});

export interface EducationCrudState {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof educationItemSchema>['fieldErrors'];
  updatedItem?: EducationItem;
  educationItems?: EducationItem[];
}

export async function saveEducationItemAction(
  prevState: EducationCrudState | undefined,
  formData: FormData
): Promise<EducationCrudState> {
  const iconNameValue = formData.get('iconName') as string | null;
  const rawData = {
    id: formData.get('id') || undefined,
    degree: formData.get('degree'),
    institution: formData.get('institution'),
    period: formData.get('period'),
    description: formData.get('description') || undefined,
    iconName: iconNameValue === NULL_ICON_VALUE ? null : iconNameValue || undefined,
  };
  const validatedFields = educationItemSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const eduData = { ...validatedFields.data } as Omit<EducationItem, 'id'> & {
    id?: string;
  };
  const isNew = !eduData.id;
  const eduId = eduData.id || db.ref('/education').push().key;

  if (!eduId) {
    return { success: false, message: 'Failed to generate education item ID.' };
  }

  const finalEduData: EducationItem = {
    ...eduData,
    id: eduId,
    iconName: eduData.iconName === NULL_ICON_VALUE ? null : eduData.iconName,
  };

  try {
    await db.ref(`/education/${eduId}`).set(finalEduData);
    revalidatePath('/');
    revalidatePath('/admin/education');
    const allItems = await getEducationItems();
    return {
      success: true,
      message: `Education item '${finalEduData.degree}' ${isNew ? 'added' : 'updated'} successfully!`,
      updatedItem: finalEduData,
      educationItems: allItems,
    };
  } catch (error) {
    console.error('Error saving education item to Firebase:', error);
    return {
      success: false,
      message: `Failed to save education item '${finalEduData.degree}'.`,
    };
  }
}

export async function deleteEducationItemAction(
  id: string
): Promise<{ success: boolean; message: string; educationItems?: EducationItem[] }> {
  if (!id) return { success: false, message: 'Education ID is required.' };

  try {
    await db.ref(`/education/${id}`).remove();
    revalidatePath('/');
    revalidatePath('/admin/education');
    const allItems = await getEducationItems();
    return {
      success: true,
      message: 'Education item deleted successfully!',
      educationItems: allItems,
    };
  } catch (error) {
    console.error('Error deleting education item from Firebase:', error);
    return { success: false, message: 'Failed to delete education item.' };
  }
}

export async function fetchEducationItemsForAdmin(): Promise<EducationItem[]> {
  return getEducationItems();
}
