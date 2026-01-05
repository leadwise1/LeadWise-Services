import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// --- Firebase Admin SDK Initialization ---
// This uses a service account for secure, privileged access from the server.
// The service account key is stored as a Base64 encoded environment variable.
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string, 'base64').toString('utf-8')
);

// Initialize Firebase Admin only if it hasn't been already.
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}
const db = getFirestore();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { password } = req.body;

  // --- Backend Authentication Check ---
  // The password from the frontend is checked against a secure environment variable.
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized: Invalid Access Code' });
  }

  try {
    const profileCollectionGroup = db.collectionGroup("profile");
    const querySnapshot = await profileCollectionGroup.get();
    
    const fetchedStudents: any[] = [];
    querySnapshot.forEach((doc) => {
      if (doc.id === 'intake') {
          const data = doc.data();
          fetchedStudents.push({
            id: doc.ref.parent.parent?.id || "unknown",
            ...data,
            enrolledAt: data.enrolledAt ? new Date(data.enrolledAt).toLocaleDateString() : "N/A",
          });
      }
    });
    res.status(200).json(fetchedStudents);
  } catch (error: any) {
    console.error("Error fetching data on server:", error);
    res.status(500).json({ message: 'Server error while fetching data.', details: error.message });
  }
}