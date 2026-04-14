const CLIENT_ID = process.env.COURSERA_CLIENT_ID;
const CLIENT_SECRET = process.env.COURSERA_CLIENT_SECRET;
const ORG_ID = process.env.COURSERA_ORG_ID;
const REDIRECT_URI = 'https://services.letsleadwise.org/api/auth/callback';

const AUTH_URL = 'https://accounts.coursera.org/oauth2/v1/auth';
const TOKEN_URL = 'https://api.coursera.com/oauth2/v1/token';

export async function getCourseraAuthUrl() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID!,
    redirect_uri: REDIRECT_URI,
    scope: 'view_profile view_enrollments', // Adjust scopes as needed
    // In a real app, add a 'state' parameter for security
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
  // Use the Reporting API or the Personal Enrollments API
  // For "3 of 8 courses", we likely need the reporting endpoint for the organization
  const response = await fetch(`https://api.coursera.com/api/businesses.v1/${ORG_ID}/enrollmentReports`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to fetch progress: ${JSON.stringify(error)}`);
  }

  return await response.json();
}

// Helper to check if a specific course is completed
export function calculateProgress(enrollments: any[]) {
  // Logic to filter for Google Cybersecurity Certificate courses
  // and count how many are completed.
  const cyberSecuritySpecializationId = 'google-cybersecurity'; // Placeholder
  
  const relevantEnrollments = enrollments.filter(e => 
    e.courseId.includes('cybersecurity') || e.specializationId === cyberSecuritySpecializationId
  );

  const completed = relevantEnrollments.filter(e => e.status === 'COMPLETED').length;
  const total = 8; // Google Cybersecurity usually has 8 courses

  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
  };
}
