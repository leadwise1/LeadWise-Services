import admin from 'firebase-admin';

// Helper to clean environment variables that might have been wrapped in quotes
const cleanEnvVar = (name: string) => process.env[name]?.replace(/^["']|["']$/g, '');

const projectId = cleanEnvVar('FIREBASE_PROJECT_ID');
const clientEmail = cleanEnvVar('FIREBASE_CLIENT_EMAIL');
const privateKey = cleanEnvVar('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else {
    console.warn("Firebase Admin credentials missing. Skipping initialization. This is expected during some build phases if environment variables are not provided.");
  }
}

export const db = admin.apps.length ? admin.firestore() : null as unknown as admin.firestore.Firestore;
export const auth = admin.apps.length ? admin.auth() : null as unknown as admin.auth.Auth;
export const FieldValue = admin.firestore.FieldValue;
export { admin };
