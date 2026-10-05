import { auth } from '@/lib/firebase';
import { signInAnonymously } from 'firebase/auth';

export async function saveCommunityUpdate(path: string, body: object) {
  await auth.authStateReady();
  if (!auth.currentUser) await signInAnonymously(auth);
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error('Community connection unavailable');
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Community update failed');
  return response.json();
}
