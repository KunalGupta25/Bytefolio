
# ByteFolio - Portfolio Project

This is a modern portfolio website built with Next.js, Tailwind CSS, and Firebase.

## 🔐 Database Security (IMPORTANT)

To secure your Firebase Realtime Database, set your **Rules** in the Firebase Console to:

```json
{
  "rules": {
    ".read": false,
    ".write": false
  }
}
```

**Why this works:**
Your app uses the **Firebase Admin SDK** on the server (Netlify). The Admin SDK authenticated via your Service Account Key **bypasses these rules**. By setting them to `false`, you prevent anyone else from accessing your data directly via the public URL, while your app maintains full access.

---

## 🚀 Deployment Checklist

### 1. Disable Legacy Prerendering on Netlify
Next.js handles SEO and Social Previews natively. Netlify's "Legacy Prerendering" feature is deprecated and can conflict with Next.js.

1.  Go to your **Netlify Site Settings**.
2.  Navigate to **Build & deploy > Post processing > Prerendering**.
3.  Ensure the toggle is **OFF**.
4.  **Do NOT** install any Prerender extensions.

### 2. Required Environment Variables
Add these to **Netlify Site settings > Build & deploy > Environment**:

*   **FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY**: Your Firebase private key (ensure preservation of newlines).
*   **FIREBASE_DATABASE_URL**: Your Firebase Realtime Database URL (e.g., `https://your-db.firebaseio.com`).
*   **ADMIN_EMAIL**: The email used for Admin Panel login (default: `admin@gmail.com`).
*   **ADMIN_PASSWORD**: A strong password for the Admin Panel.
*   **NEXT_PUBLIC_GA_MEASUREMENT_ID**: Your Google Analytics ID (e.g., `G-1T491Z6RRJ`).
*   **NEXT_PUBLIC_SITE_URL**: Your full site URL (e.g., `https://lazyhideout.tech`) - required for Open Graph images.
*   **RESEND_API_KEY**: (Optional) For contact form email fallback.
*   **CONTACT_FORM_RECIPIENT_EMAIL**: (Optional) Email address for fallback notifications.

### 3. Open Graph Image
Place your branded preview image at `public/og-image.png`. The app is configured to find this file automatically for social media shares.

### 4. EmailJS Configuration
Credentials (Service ID, Template ID, Public Key) are managed via the **Admin Panel > Integrations** page inside your deployed app. Your Service ID is pre-configured as `service_gula7q9`.

---

## 🛠 Development

1.  **Push to GitHub**:
    ```bash
    git add .
    git commit -m "Update hero section and fix OG metadata"
    git push origin main
    ```
2.  **Verify**: Access your site and check the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) or [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) to ensure your preview image is working.
