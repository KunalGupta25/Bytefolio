'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { signSession, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export interface LoginState {
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
    general?: string[];
  };
}

export async function loginAdminAction(
  prevState: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
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

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error(
      '[loginAdminAction] ADMIN_EMAIL or ADMIN_PASSWORD env vars are not set.'
    );
    return {
      success: false,
      message: 'Server configuration error. Admin credentials are not configured.',
      errors: {
        general: ['Please set ADMIN_EMAIL and ADMIN_PASSWORD in your environment variables.'],
      },
    };
  }

  const { email, password } = validatedFields.data;

  if (email === adminEmail && password === adminPassword) {
    const token = await signSession(email);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    });
    redirect('/admin');
  }

  return {
    success: false,
    message: 'Invalid credentials.',
    errors: { general: ['Invalid email or password.'] },
  };
}

export async function logoutAdminAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect('/admin/login');
}
