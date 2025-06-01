
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/KunalGupta25/portfolio-1)

Click the button above to deploy this project to Netlify.

## Before Pushing to GitHub & Deploying:

1.  **Environment Variables on Netlify**:
    *   This is the **most critical step**. After connecting your repository to Netlify, go to your Netlify site's **Site settings > Build & deploy > Environment > Environment variables**.
    *   Add all the variables from your local `.env.local` file. These include:
        *   `FIREBASE_SERVICE_ACCOUNT_TYPE`
        *   `FIREBASE_SERVICE_ACCOUNT_PROJECT_ID`
        *   `FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID`
        *   `FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY` (Ensure the multi-line key is pasted correctly, preserving newlines)
        *   `FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL`
        *   `FIREBASE_SERVICE_ACCOUNT_CLIENT_ID`
        *   `FIREBASE_SERVICE_ACCOUNT_AUTH_URI`
        *   `FIREBASE_SERVICE_ACCOUNT_TOKEN_URI`
        *   `FIREBASE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL`
        *   `FIREBASE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL`
        *   `FIREBASE_SERVICE_ACCOUNT_UNIVERSE_DOMAIN`
        *   `FIREBASE_DATABASE_URL`
        *   `ADMIN_EMAIL`
        *   `ADMIN_PASSWORD`
        *   `RESEND_API_KEY` (Your API key from Resend)
        *   `CONTACT_FORM_RECIPIENT_EMAIL` (The email address to receive contact form submissions)
        *   `NEXT_PUBLIC_RESUME_URL` (URL to your resume/CV, e.g., `/resume.pdf` or a full web link)
        *   `NEXT_PUBLIC_GA_MEASUREMENT_ID` (Your Google Analytics Measurement ID, e.g., `G-XXXXXXXXXX`)
        *   `NEXT_PUBLIC_SITE_URL` (The full URL of your deployed site, e.g., `https://your-site-name.netlify.app`)
    *   Netlify's build will fail if these are not set up correctly, as the Firebase Admin SDK needs them during the build process and at runtime for server actions.

2.  **Check your `next.config.ts`**:
    *   Ensure all hostnames for `next/image` are correctly listed in `images.remotePatterns`. We've added several, including a wildcard for any HTTPS source, but it's good to be aware of.

3.  **Open Graph Image**:
    *   Place your desired Open Graph image (the image that appears in link previews) at `public/og-image.png`. Recommended dimensions are 1200x630 pixels.

4.  **Push to GitHub**:
    *   Make sure all your latest changes, including the `.gitignore` and `netlify.toml`, are committed and pushed to your `https://github.com/KunalGupta25/portfolio-1` repository.

Once these are done, your Netlify deployment should proceed smoothly!

