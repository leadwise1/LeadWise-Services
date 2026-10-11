import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, ReCaptchaV3Provider, getToken } from 'firebase/app-check';
import config from '../../firebase-applet-config.json';

const { recaptchaSiteKey, ...firebaseConfig } = config;
export const app = initializeApp(firebaseConfig);
const env = (import.meta as ImportMeta & { env: Record<string, string | boolean | undefined> }).env;
const siteKey = String(env.VITE_APPCHECK_SITE_KEY || recaptchaSiteKey || '');
const provider = String(env.VITE_APPCHECK_PROVIDER || 'enterprise');
if (env.DEV && env.VITE_APPCHECK_DEBUG === 'true') {
  (self as typeof self & { FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean }).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}
if (siteKey && !['enterprise', 'v3'].includes(provider)) {
  throw new Error('App Check provider must be enterprise or v3.');
}
const appCheck = siteKey ? initializeAppCheck(app, {
  provider: provider === 'v3' ? new ReCaptchaV3Provider(siteKey) : new ReCaptchaEnterpriseProvider(siteKey),
  isTokenAutoRefreshEnabled: true,
}) : null;

export async function requireAppCheck() {
  if (!appCheck) throw new Error('App Check site key is not configured.');
  try {
    await getToken(appCheck);
  } catch (error) {
    const hostname = typeof window === 'undefined' ? 'unknown-host' : window.location.hostname;
    const projectId = firebaseConfig.projectId || 'unknown-project';
    console.error('App Check token exchange failed', {
      error,
      hostname,
      projectId,
      provider,
      appId: firebaseConfig.appId,
    });
    throw new Error(
      `App Check token exchange failed for ${hostname} using ${provider} on ${projectId}. ` +
        'Confirm this exact domain is allowed on the reCAPTCHA key registered for this Firebase web app.',
      { cause: error },
    );
  }
}

export const db = getFirestore(app);
export const auth = getAuth(app);
