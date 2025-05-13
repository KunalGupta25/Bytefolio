
'use server';

import { z } from 'zod';

// Schema for Contact Form
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

  // Simulate email sending
  console.log('Contact form submission received:');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Message:', message);

  // In a real application, you would integrate an email service here
  return { success: true, message: 'Your message has been sent successfully!' };
}


// Schema for About Me Information
const aboutInfoSchema = z.object({
  professionalSummary: z.string().min(50, { message: "Professional summary must be at least 50 characters." }),
  bio: z.string().min(50, { message: "Bio must be at least 50 characters." }),
  profileImageUrl: z.string().url({ message: "Invalid URL for profile image." }).optional().or(z.literal('')),
});

interface AboutInfoState {
  success: boolean;
  message: string;
  errors?: {
    professionalSummary?: string[];
    bio?: string[];
    profileImageUrl?: string[];
  };
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
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { professionalSummary, bio, profileImageUrl } = validatedFields.data;

  // Simulate updating data (e.g., in a database)
  console.log('About Me information update attempt:');
  console.log('Professional Summary:', professionalSummary);
  console.log('Bio:', bio);
  console.log('Profile Image URL:', profileImageUrl);

  // In a real application, you would update your data store here.
  // For now, we'll just simulate success.
  // Note: This does not update the `src/lib/data.ts` file as it's static.
  // A real implementation would involve a database and fetching data dynamically.

  return { success: true, message: 'About Me information updated successfully! (Simulated)' };
}
