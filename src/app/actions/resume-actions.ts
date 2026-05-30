'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface ResumeUploadState {
  success: boolean;
  message: string;
}

export async function uploadResumeAction(
  prevState: ResumeUploadState | undefined,
  formData: FormData
): Promise<ResumeUploadState> {
  try {
    const file = formData.get('resumeFile') as File | null;

    if (!file) {
      return { success: false, message: 'No file selected.' };
    }

    if (file.type !== 'application/pdf') {
      return { success: false, message: 'Only PDF files are allowed.' };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { success: false, message: 'File must be less than 5MB.' };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Determine the public directory path
    const publicDir = path.join(process.cwd(), 'public');
    const filePath = path.join(publicDir, 'resume.pdf');

    // Ensure public directory exists
    await fs.mkdir(publicDir, { recursive: true });

    // Write file
    await fs.writeFile(filePath, buffer);

    revalidatePath('/');
    revalidatePath('/admin/about');

    return { success: true, message: 'Resume uploaded successfully!' };
  } catch (error) {
    console.error('Error uploading resume:', error);
    return { success: false, message: 'An error occurred while saving the file.' };
  }
}
