const CLIENT_ID = process.env.COURSERA_CLIENT_ID;
const CLIENT_SECRET = process.env.COURSERA_CLIENT_SECRET;
const ORG_ID = process.env.COURSERA_ORG_ID;
const LEARNING_PATH_ID = process.env.COURSERA_LEARNING_PATH_ID || '0iKHbCiJQp-ih2woiUKfxA';
const REDIRECT_URI = 'https://services.letsleadwise.org/api/auth/callback';

const AUTH_URL = 'https://accounts.coursera.org/oauth2/v1/auth';
const TOKEN_URL = 'https://api.coursera.com/oauth2/v1/token';

export async function getCourseraAuthUrl() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID!,
    redirect_uri: REDIRECT_URI,
    scope: 'view_profile view_enrollments',
  });
  return `${AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string) {
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Token exchange failed: ${JSON.stringify(error)}`);
  }

  return await response.json();
}

/**
 * Gets an access token using Client Credentials grant.
 * Used for server-to-server communication.
 */
export async function getClientCredentialsToken(): Promise<string> {
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Client credentials token fetch failed: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function getStudentProgress(accessToken: string) {
  const response = await fetch(`https://api.coursera.org/api/enterpriseLearningPaths.v1/${LEARNING_PATH_ID}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-Coursera-Org-Id': ORG_ID!,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to fetch Learning Path progress: ${JSON.stringify(error)}`);
  }

  return await response.json();
}

export function calculateProgress(data: any) {
  const isVerified = data.integrityStatus === 'PASSED';
  const courses = data.elements || [];
  const completed = courses.filter((c: any) => c.status === 'COMPLETED').length;
  const total = courses.length || 9;

  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
    isVerified,
    integrityStatus: data.integrityStatus
  };
}
