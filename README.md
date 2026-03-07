
# ByteFolio - Portfolio Project

This is a modern portfolio website built with Next.js, Tailwind CSS, and Firebase.

## Important: Disable Legacy Prerendering on Netlify

This project uses **Next.js**, which handles Server-Side Rendering (SSR) natively. Netlify's "Legacy Prerendering" feature is deprecated and can conflict with Next.js.

1.  Go to your **Netlify Site Settings**.
2.  Navigate to **Build & deploy > Post processing > Prerendering**.
3.  Ensure the toggle is **OFF**.
4.  **Do NOT** install any Prerender extensions. Next.js does all the heavy lifting for SEO, AI agents, and social media previews automatically.

## Before Pushing to GitHub & Deploying:

1.  **Environment Variables on Netlify**:
    *   Add these variables to Netlify's **Site settings > Build & deploy > Environment**.
    *   **FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY**: Your Firebase private key (ensure preservation of newlines).
    *   **NEXT_PUBLIC_GA_MEASUREMENT_ID**: Set to `G-1T491Z6RRJ` for Google Analytics.
    *   **NEXT_PUBLIC_SITE_URL**: Your site's full URL (e.g., `https://lazyhideout.tech`) - required for Open Graph image previews.
    *   **RESEND_API_KEY**: For contact form email fallback.
    *   **CONTACT_FORM_RECIPIENT_EMAIL**: The email address where you want to receive notifications.

2.  **Open Graph Image**:
    *   Ensure your branded preview image is placed at `public/og-image.png`. The app is configured to look for this specific file when you share your link.

3.  **EmailJS Configuration**:
    *   Credentials (Service ID, Template ID, Public Key) are managed via the **Admin Panel > Integrations** page inside your deployed app. Your Service ID is pre-configured as `service_gula7q9`.

4.  **Push to GitHub**:
    *   Use your Git client to commit all changes and push to your repository.
    *   Example:
        ```bash
        git add .
        git commit -m "Finalize portfolio with GA, EmailJS, and OG meta tags"
        git push origin main
        ```
