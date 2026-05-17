import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_CONFIG || '{}');
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // Use the project ID from your firebase config
      projectId: "leadwise-services-rule"
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin init error:', error);
  }
}

const adminDb = admin.firestore();
// Enable long polling for admin as well to avoid timeout issues in serverless functions
adminDb.settings({ ignoreUndefinedProperties: true });

const adminAuth = admin.auth();

export { adminDb, adminAuth, admin };