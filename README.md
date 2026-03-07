
# ByteFolio - Portfolio Project

This is a modern portfolio website built with Next.js, Tailwind CSS, and Firebase.

## Important Note on Prerendering

This project uses **Next.js**, which handles Server-Side Rendering (SSR) and Static Site Generation (SSG) natively. Because of this, you should **DISABLE** the "Legacy Prerendering" feature in the Netlify UI.

1.  Go to your **Netlify Site Settings**.
2.  Navigate to **Build & deploy > Post processing > Prerendering**.
3.  Ensure the toggle is **OFF**.
4.  **Do NOT** install any Prerender extensions. Next.js does all the heavy lifting for SEO and social media previews automatically.

## Before Pushing to GitHub & Deploying:

1.  **Environment Variables on Netlify**:
    *   Add all variables from your local `.env.local` to Netlify's **Site settings > Build & deploy > Environment**.
    *   Essential variables: 
        *   `FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY` (ensure preservation of newlines).
        *   `NEXT_PUBLIC_GA_MEASUREMENT_ID` (Google Analytics ID).
        *   `NEXT_PUBLIC_SITE_URL` (Your site's full URL, e.g., `https://lazyhideout.tech`).
        *   `RESEND_API_KEY` (For contact form fallback).
        *   `CONTACT_FORM_RECIPIENT_EMAIL` (Email for form notifications).

2.  **Open Graph Image**:
    *   Place your desired Open Graph image at `public/og-image.png` (Recommended: 1200x630px or 1200x675px).

3.  **EmailJS**:
    *   Credentials (Service ID, Template ID, Public Key) are managed via the **Admin Panel > Integrations** page inside your deployed app.

4.  **Push to GitHub**:
    *   Ensure all latest changes are committed to your repository.
