'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { getSiteSettings } from '@/lib/data';
import type { SiteSettings } from '@/lib/data';

// ---------------------------------------------------------------------------
// HTML Sanitizer — strips dangerous patterns before saving to Firebase.
// Protects against XSS if the customHtmlWidget is ever rendered via
// dangerouslySetInnerHTML. Admin-only, but defence-in-depth matters.
// ---------------------------------------------------------------------------
function sanitizeHtml(html: string): string {
  if (!html) return '';
  return html
    // Remove <script> blocks (including content)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove <iframe> blocks
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Remove <object> blocks
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    // Remove <embed> tags
    .replace(/<embed\b[^>]*\/?>/gi, '')
    // Remove inline event handlers (onclick, onload, onerror, etc.)
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    // Replace javascript: hrefs
    .replace(/(href|action)\s*=\s*["']\s*javascript:[^"']*["']/gi, '$1="#"')
    // Remove javascript:/data: (non-image) src attributes
    .replace(/src\s*=\s*["']\s*javascript:[^"']*["']/gi, '')
    .replace(/src\s*=\s*["']\s*data:(?!image\/)[^"']*["']/gi, '');
}

const siteSettingsSchema = z.object({
  siteName: z.string().min(3, 'Site name must be at least 3 characters.'),
  siteTitleSuffix: z.string().min(3, 'Site title suffix must be at least 3 characters.'),
  siteDescription: z
    .string()
    .min(10, 'Site description must be at least 10 characters.')
    .max(160, 'Site description should be max 160 characters.'),
  defaultUserName: z.string().min(2, 'Default user name must be at least 2 characters.'),
  defaultUserSpecialization: z
    .string()
    .min(5, 'Specialization must be at least 5 characters.'),
  heroTagline: z.string().min(5, 'Hero tagline must be at least 5 characters.'),
  defaultProfileImageUrl: z.preprocess(
    (val) => val || undefined,
    z.string().url('Invalid default profile image URL.').optional()
  ),
  faviconUrl: z.preprocess((val) => val || '', z.string().optional().or(z.literal(''))),
  contactEmail: z.string().email(),
  contactLinkedin: z.string().url(),
  contactGithub: z.preprocess(
    (val) => val || undefined,
    z.string().url('Invalid GitHub URL.').optional()
  ),
  contactTwitter: z.preprocess(
    (val) => val || '',
    z.string().url().optional().or(z.literal(''))
  ),
  customHtmlWidget: z.preprocess(
    (val) => val ?? undefined,
    z.string().optional().nullable()
  ),
  blogUrl: z.preprocess(
    (val) => val || '',
    z.string().url('Invalid Blog URL. Must be a full URL.').optional().or(z.literal(''))
  ),
  kofiUrl: z.preprocess(
    (val) => val || '',
    z.string().url('Invalid Ko-fi URL. Must be a full URL.').optional().or(z.literal(''))
  ),
  emailJsServiceId: z.preprocess(
    (val) => val || '',
    z.string().optional().or(z.literal(''))
  ),
  emailJsTemplateId: z.preprocess(
    (val) => val || '',
    z.string().optional().or(z.literal(''))
  ),
  emailJsPublicKey: z.preprocess(
    (val) => val || '',
    z.string().optional().or(z.literal(''))
  ),
});

export interface SiteSettingsState {
  success: boolean;
  message: string;
  errors?: z.inferFlattenedErrors<typeof siteSettingsSchema>['fieldErrors'];
  updatedSiteSettings?: SiteSettings;
}

export async function updateSiteSettings(
  prevState: SiteSettingsState | undefined,
  formData: FormData
): Promise<SiteSettingsState> {
  const dataToValidate = {
    siteName: formData.get('siteName'),
    siteTitleSuffix: formData.get('siteTitleSuffix'),
    siteDescription: formData.get('siteDescription'),
    defaultUserName: formData.get('defaultUserName'),
    defaultUserSpecialization: formData.get('defaultUserSpecialization'),
    heroTagline: formData.get('heroTagline'),
    defaultProfileImageUrl: formData.get('defaultProfileImageUrl'),
    faviconUrl: formData.get('faviconUrl'),
    contactEmail: formData.get('contactEmail'),
    contactLinkedin: formData.get('contactLinkedin'),
    contactGithub: formData.get('contactGithub'),
    contactTwitter: formData.get('contactTwitter'),
    customHtmlWidget: formData.get('customHtmlWidget'),
    blogUrl: formData.get('blogUrl'),
    kofiUrl: formData.get('kofiUrl'),
    emailJsServiceId: formData.get('emailJsServiceId'),
    emailJsTemplateId: formData.get('emailJsTemplateId'),
    emailJsPublicKey: formData.get('emailJsPublicKey'),
  };

  const validatedFields = siteSettingsSchema.safeParse(dataToValidate);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed. Please check the specific error messages under each field.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const currentSettingsSnapshot = await db.ref('/siteSettings').once('value');
    const currentSettings = (currentSettingsSnapshot.val() as Record<string, unknown>) || {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const settingsToUpdate: Record<string, any> = {
      siteName: validatedFields.data.siteName,
      siteTitleSuffix: validatedFields.data.siteTitleSuffix,
      siteDescription: validatedFields.data.siteDescription,
      defaultUserName: validatedFields.data.defaultUserName,
      defaultUserSpecialization: validatedFields.data.defaultUserSpecialization,
      heroTagline: validatedFields.data.heroTagline,
      contactDetails: {
        email: validatedFields.data.contactEmail,
        linkedin: validatedFields.data.contactLinkedin,
        github: validatedFields.data.contactGithub || undefined,
        twitter: validatedFields.data.contactTwitter || undefined,
      },
    };

    if (validatedFields.data.defaultProfileImageUrl) {
      settingsToUpdate.defaultProfileImageUrl = validatedFields.data.defaultProfileImageUrl;
    } else if (currentSettings.defaultProfileImageUrl !== undefined) {
      settingsToUpdate.defaultProfileImageUrl = currentSettings.defaultProfileImageUrl;
    }

    if (validatedFields.data.faviconUrl) {
      settingsToUpdate.faviconUrl = validatedFields.data.faviconUrl;
    }
    if (validatedFields.data.blogUrl) {
      settingsToUpdate.blogUrl = validatedFields.data.blogUrl;
    }
    if (validatedFields.data.kofiUrl) {
      settingsToUpdate.kofiUrl = validatedFields.data.kofiUrl;
    }

    // Sanitize customHtmlWidget before persisting (XSS defence)
    const preserveFields: Array<
      'customHtmlWidget' | 'emailJsServiceId' | 'emailJsTemplateId' | 'emailJsPublicKey'
    > = ['customHtmlWidget', 'emailJsServiceId', 'emailJsTemplateId', 'emailJsPublicKey'];

    preserveFields.forEach((key) => {
      if (formData.has(key)) {
        const value = validatedFields.data[key as keyof typeof validatedFields.data] as
          | string
          | null
          | undefined;
        if (value) {
          settingsToUpdate[key] =
            key === 'customHtmlWidget' ? sanitizeHtml(value) : value;
        }
      } else if (currentSettings[key] !== undefined) {
        settingsToUpdate[key] = currentSettings[key];
      }
    });

    // Remove undefined values from contactDetails
    Object.keys(settingsToUpdate.contactDetails).forEach((key) => {
      if (settingsToUpdate.contactDetails[key] === undefined) {
        delete settingsToUpdate.contactDetails[key];
      }
    });

    await db.ref('/siteSettings').update(settingsToUpdate);

    revalidatePath('/');
    revalidatePath('/layout', 'layout');
    revalidatePath('/admin/settings');
    revalidatePath('/admin/integrations');
    const updatedSettings = await getSiteSettings();
    return {
      success: true,
      message: 'Site settings updated successfully!',
      updatedSiteSettings: updatedSettings,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Failed to update site settings. Server error: ${errorMessage}`,
    };
  }
}

export async function fetchSiteSettingsForAdmin(): Promise<SiteSettings> {
  return getSiteSettings();
}
