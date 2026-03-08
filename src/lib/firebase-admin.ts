
import admin from 'firebase-admin';

// Ensure this file is only processed once
if (!admin.apps.length) {
  try {
    const serviceAccount: admin.ServiceAccount = {
      projectId: process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
      privateKey: (process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
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
