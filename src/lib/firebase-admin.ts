import * as admin from 'firebase-admin';

/**
 * Robust Firebase Admin Initialization
 * 
 * CRITICAL: FIREBASE_ADMIN_SDK_CONFIG must be a single-line JSON string 
 * in your .env.local wrapped in single quotes.
 * Ensures only one instance of the app exists even with HMR (Hot Module Replacement)
 */
try {
  if (admin.apps.length === 0) {
    const configString = process.env.FIREBASE_ADMIN_SDK_CONFIG;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (configString || (clientEmail && privateKey)) {
      // Handle potentially escaped JSON from environment variables
      const serviceAccount = configString 
        ? JSON.parse(configString.trim()) 
        : {
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "leadwise-services-rule",
            clientEmail: clientEmail,
            privateKey: privateKey
          };
      
      // Normalize private key newlines (handles both JSON and individual variable formats)
      if (serviceAccount.privateKey) serviceAccount.privateKey = serviceAccount.privateKey.replace(/\\n/g, '\n');
      if (serviceAccount.private_key) serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id || serviceAccount.projectId || "leadwise-services-rule"
      });
      console.log('✅ Firebase Admin initialized successfully');
    } else {
      console.warn("⚠️ Firebase Admin: FIREBASE_ADMIN_SDK_CONFIG is missing from environment.");
    }
  }
} catch (error: any) {
  console.error('❌ Firebase Admin initialization error:', error.message);
}

/**
 * Safely export service instances.
 * Using getters ensures we don't call service methods before the app is ready.
 */
export const adminDb = admin.apps.length > 0 ? admin.firestore() : null;
export const adminAuth = admin.apps.length > 0 ? admin.auth() : null;

if (adminDb) {
  adminDb.settings({ ignoreUndefinedProperties: true });
}

export { admin };