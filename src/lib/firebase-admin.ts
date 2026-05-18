import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const configString = process.env.FIREBASE_ADMIN_SDK_CONFIG;
    
    if (!configString) {
      console.warn("Firebase Admin: FIREBASE_ADMIN_SDK_CONFIG is missing. Admin features will be disabled.");
    } else {
      // Parse the JSON string. Vercel environment variables often need 
      // specific handling if they contain newlines or escaped characters.
      const serviceAccount = typeof configString === 'string' ? JSON.parse(configString) : configString;
      
      // Ensure private key newlines are handled correctly
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id || "leadwise-services-rule"
      });
      
      console.log('Firebase Admin initialized successfully');
    }
  } catch (error) {
    console.error('Firebase Admin init error:', error);
  }
}

// Safely export instances; these will be undefined if initialization failed
// instead of throwing a top-level error that kills the route.
const adminDb = admin.apps.length ? admin.firestore() : null;
// Enable long polling for admin as well to avoid timeout issues in serverless functions
if (adminDb) adminDb.settings({ ignoreUndefinedProperties: true });

const adminAuth = admin.apps.length ? admin.auth() : null;

export { adminDb, adminAuth, admin };