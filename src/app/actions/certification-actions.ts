'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { getCertifications } from '@/lib/data';
import type { Certification } from '@/lib/data';

const NULL_ICON_VALUE = '--no-icon--';

const certificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Certification name is required.'),
  organization: z.string().min(1, 'Organization is required.'),
  date: z.string().min(1, 'Date is required.'),
  verifyLink: z.string().url().optional().or(z.literal('')),
  iconName: z.string().optional().nullable(),
});

export interface CertificationCrudState {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof certificationSchema>['fieldErrors'];
  updatedCertification?: Certification;
  certifications?: Certification[];
}

export async function saveCertificationAction(
  prevState: CertificationCrudState | undefined,
  formData: FormData
): Promise<CertificationCrudState> {
  const iconNameValue = formData.get('iconName') as string | null;
  const rawData = {
    id: formData.get('id') || undefined,
    name: formData.get('name'),
    organization: formData.get('organization'),
    date: formData.get('date'),
    verifyLink: formData.get('verifyLink') || undefined,
    iconName: iconNameValue === NULL_ICON_VALUE ? null : iconNameValue || undefined,
  };
  const validatedFields = certificationSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const certData = { ...validatedFields.data } as Omit<Certification, 'id'> & {
    id?: string;
  };
  const isNew = !certData.id;
  const certId = certData.id || db.ref('/certifications').push().key;

  if (!certId) {
    return { success: false, message: 'Failed to generate certification ID.' };
  }

  const finalCertData: Certification = {
    ...certData,
    id: certId,
    verifyLink: certData.verifyLink || undefined,
    iconName: certData.iconName === NULL_ICON_VALUE ? null : certData.iconName,
  };

  try {
    await db.ref(`/certifications/${certId}`).set(finalCertData);
    revalidatePath('/');
    revalidatePath('/admin/certifications');
    const allCerts = await getCertifications();
    return {
      success: true,
      message: `Certification '${finalCertData.name}' ${isNew ? 'added' : 'updated'} successfully!`,
      updatedCertification: finalCertData,
      certifications: allCerts,
    };
  } catch (error) {
    console.error('Error saving certification to Firebase:', error);
    return {
      success: false,
      message: `Failed to save certification '${finalCertData.name}'.`,
    };
  }
}

export async function deleteCertificationAction(
  id: string
): Promise<{ success: boolean; message: string; certifications?: Certification[] }> {
  if (!id) return { success: false, message: 'Certification ID is required.' };

  try {
    await db.ref(`/certifications/${id}`).remove();
    revalidatePath('/');
    revalidatePath('/admin/certifications');
    const allCerts = await getCertifications();
    return {
      success: true,
      message: 'Certification deleted successfully!',
      certifications: allCerts,
    };
  } catch (error) {
    console.error('Error deleting certification from Firebase:', error);
    return { success: false, message: 'Failed to delete certification.' };
  }
}

export async function fetchCertificationsForAdmin(): Promise<Certification[]> {
  return getCertifications();
}
