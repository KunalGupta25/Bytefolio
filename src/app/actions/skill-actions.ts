'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { getSkills } from '@/lib/data';
import type { Skill } from '@/lib/data';

const NULL_ICON_VALUE = '--no-icon--';

const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Skill name is required.'),
  level: z.coerce.number().min(0).max(100).optional(),
  category: z.enum(['Language', 'Framework/Library', 'Tool', 'Database', 'Cloud', 'Other']),
  iconName: z.string().optional().nullable(),
});

export interface SkillCrudState {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof skillSchema>['fieldErrors'];
  updatedSkill?: Skill;
  skills?: Skill[];
}

export async function saveSkillAction(
  prevState: SkillCrudState | undefined,
  formData: FormData
): Promise<SkillCrudState> {
  const iconNameValue = formData.get('iconName') as string | null;
  const rawData = {
    id: formData.get('id') || undefined,
    name: formData.get('name'),
    level: formData.get('level') ? Number(formData.get('level')) : undefined,
    category: formData.get('category'),
    iconName: iconNameValue === NULL_ICON_VALUE ? null : iconNameValue || undefined,
  };
  const validatedFields = skillSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const skillData = { ...validatedFields.data } as Omit<Skill, 'id'> & { id?: string };
  const isNew = !skillData.id;
  const skillId = skillData.id || db.ref('/skills').push().key;

  if (!skillId) {
    return { success: false, message: 'Failed to generate skill ID.' };
  }

  const finalSkillData: Skill = {
    ...skillData,
    id: skillId,
    level: skillData.level ?? undefined,
    iconName: skillData.iconName === NULL_ICON_VALUE ? null : skillData.iconName,
  };

  try {
    await db.ref(`/skills/${skillId}`).set(finalSkillData);
    revalidatePath('/');
    revalidatePath('/admin/skills');
    const allSkills = await getSkills();
    return {
      success: true,
      message: `Skill '${finalSkillData.name}' ${isNew ? 'added' : 'updated'} successfully!`,
      updatedSkill: finalSkillData,
      skills: allSkills,
    };
  } catch (error) {
    console.error('Error saving skill to Firebase:', error);
    return { success: false, message: `Failed to save skill '${finalSkillData.name}'.` };
  }
}

export async function deleteSkillAction(
  id: string
): Promise<{ success: boolean; message: string; skills?: Skill[] }> {
  if (!id) return { success: false, message: 'Skill ID is required.' };

  try {
    await db.ref(`/skills/${id}`).remove();
    revalidatePath('/');
    revalidatePath('/admin/skills');
    const allSkills = await getSkills();
    return { success: true, message: 'Skill deleted successfully!', skills: allSkills };
  } catch (error) {
    console.error('Error deleting skill from Firebase:', error);
    return { success: false, message: 'Failed to delete skill.' };
  }
}

export async function fetchSkillsForAdmin(): Promise<Skill[]> {
  return getSkills();
}
