
# Firebase Studio

This is a NextJS starter in Firebase Studio.

## Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/KunalGupta25/portfolio-1)

Click the button above to deploy this project to Netlify.

## Before Pushing to GitHub & Deploying:

1.  **Environment Variables on Netlify**:
    *   Add all variables from your local `.env.local` to Netlify's **Site settings > Build & deploy > Environment**.
    *   Essential variables: `FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY` (ensure preservation of newlines), `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_SITE_URL`.

2.  **Disable Legacy Prerendering**:
    *   To avoid deprecation warnings, go to **Site settings > Build & deploy > Prerendering** and turn the toggle **OFF**. Next.js handles this automatically.

3.  **Open Graph Image**:
    *   Place your desired Open Graph image at `public/og-image.png` (Recommended: 1200x630px).

4.  **EmailJS**:
    *   Credentials (Service ID, Template ID, Public Key) are managed via the **Admin Panel > Integrations** page inside your deployed app.

5.  **Push to GitHub**:
    *   Ensure all latest changes are committed to `https://github.com/KunalGupta25/portfolio-1`.
