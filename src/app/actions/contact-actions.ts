'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase-admin';
import { Resend } from 'resend';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export interface ContactFormState {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
}

export async function submitContactForm(
  prevState: ContactFormState | undefined,
  formData: FormData
): Promise<ContactFormState> {
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message:
        'Validation failed. Please check the specific error messages under each field.',
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
    console.log('Contact form submission stored in Firebase:', { name, email });

    // Server-side email notification via Resend (fallback when EmailJS is not configured)
    if (process.env.RESEND_API_KEY && process.env.CONTACT_FORM_RECIPIENT_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      try {
        await resend.emails.send({
          from: 'ByteFolio Contact <onboarding@resend.dev>',
          to: process.env.CONTACT_FORM_RECIPIENT_EMAIL,
          subject: `New Contact Form Submission from ${name} (via Server Fallback)`,
          html: `
            <p>You received a new message from your portfolio contact form (server fallback):</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
        });
        console.log('Contact form email sent successfully via Resend.');
      } catch (emailError) {
        console.error('Error sending contact form email via Resend:', emailError);
      }
    }

    return { success: true, message: 'Your message has been stored successfully!' };
  } catch (error) {
    console.error('Error submitting contact form to Firebase:', error);
    return {
      success: false,
      message: 'Failed to store message. Please try again later.',
    };
  }
}
