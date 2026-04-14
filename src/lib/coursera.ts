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
    scope: 'view_profile view_enrollments', // Adjust scopes as needed
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

export async function getStudentProgress(accessToken: string) {
  // Fetch specific Learning Path data for the authenticated learner
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

// Helper to check if progress is verified and calculate percent
export function calculateProgress(data: any) {
  // The Enterprise Learning Path response includes curriculum and potentially progress
  // We look for 'completedCount' or similar fields in the response elements
  
  // Based on the roadmap, we also check for 'integrityStatus'
  const isVerified = data.integrityStatus === 'PASSED';
  
  // Mocking the completion calculation based on elements if not directly provided
  const courses = data.elements || [];
  const completed = courses.filter((c: any) => c.status === 'COMPLETED').length;
  const total = courses.length || 9; // Fallback to 9 as defined in curriculum

  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
    isVerified,
    integrityStatus: data.integrityStatus
  };
}
