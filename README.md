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
    *   Netlify's build will fail if these are not set up correctly, as the Firebase Admin SDK needs them during the build process and at runtime for server actions.

2.  **Check your `next.config.js`**:
    *   Ensure all hostnames for `next/image` (like `picsum.photos`, `placehold.co`, `lh3.googleusercontent.com`, `media.licdn.com`, `mp-cdn.elgato.com`, `w0.peakpx.com` if you decide to use `next/image` for it) are correctly listed in the `images.remotePatterns`. We've added these throughout our conversation.

3.  **Push to GitHub**:
    *   Make sure all your latest changes, including the `.gitignore` and `netlify.toml`, are committed and pushed to your `https://github.com/KunalGupta25/portfolio-1` repository.

Once these are done, your Netlify deployment should proceed smoothly!
