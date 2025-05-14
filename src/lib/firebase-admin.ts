
import admin from 'firebase-admin';

// Ensure this file is only processed once
if (!admin.apps.length) {
  try {
    const serviceAccount = {
      type: process.env.FIREBASE_SERVICE_ACCOUNT_TYPE as string,
      project_id: process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID as string,
      private_key_id: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID as string,
      private_key: (process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY as string).replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL as string,
      client_id: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_ID as string,
      auth_uri: process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_URI as string,
      token_uri: process.env.FIREBASE_SERVICE_ACCOUNT_TOKEN_URI as string,
      auth_provider_x509_cert_url: process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL as string,
      client_x509_cert_url: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL as string,
      universe_domain: process.env.FIREBASE_SERVICE_ACCOUNT_UNIVERSE_DOMAIN as string,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (error) {
    console.error('Firebase Admin SDK initialization error:', error);
    // Check if the error is because it's already initialized in a different context (e.g. hot reload)
     if (error instanceof Error && (error as any).code !== 'app/duplicate-app') {
      throw error;
    }
  }
}

export const db = admin.database();
export const adminAuth = admin.auth();
