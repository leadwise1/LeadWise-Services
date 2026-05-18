const CLIENT_ID = process.env.COURSERA_CLIENT_ID;
const CLIENT_SECRET = process.env.COURSERA_CLIENT_SECRET;

// Use the encoded Organizational ID (e.g. PHXqt_bBMgu9thbuJnsLvQ), NOT the slug.
const ORG_ID = process.env.COURSERA_ORG_ID || 
               process.env.COURSERA_ORGANIZATION_ID || 
               'PHXqt_bBMgu9thbuJnsLvQ'; 
const LEARNING_PATH_ID = process.env.COURSERA_LEARNING_PATH_ID || '0iKHbCiJQp-ih2woiUKfxA';
const PROGRAM_ID = process.env.COURSERA_PROGRAM_ID || process.env.COURSERA_PROGRAM_SLUG;

console.log("🛠️ Coursera Service Diagnostics:");
console.log(`- CLIENT_ID: ${CLIENT_ID ? `✅ (${CLIENT_ID.substring(0, 4)}...)` : '❌ Missing'}`);
console.log(`- CLIENT_SECRET: ${CLIENT_SECRET ? '✅ Configured' : '❌ Missing'}`);
console.log(`- Active ORG_ID (Encoded): ${ORG_ID}`);
console.log(`- Expected Slug: gwg-ent-leadwise-foundation`);

if (ORG_ID?.includes('-')) {
  console.error("⚠️ CRITICAL CONFIG ERROR: Your ORG_ID contains hyphens. You are likely using the Slug 'gwg-ent-leadwise-foundation' where the API requires the encoded Alphanumeric ID (PHXqt...). Check your .env.local or Vercel settings.");
}

const REDIRECT_URI = 'https://services.letsleadwise.org/api/auth/callback';

const AUTH_URL = 'https://accounts.coursera.org/oauth2/v1/auth';
const TOKEN_URL = 'https://api.coursera.com/oauth2/client_credentials/token';

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
  // Authorization Code exchange uses the accounts endpoint
  const response = await fetch('https://accounts.coursera.org/oauth2/v1/token', {
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
    const error = await readCourseraError(response);
    throw new Error(`Token exchange failed: ${error}`);
  }

  return await response.json();
}

/**
 * Gets an access token using Client Credentials grant.
 * Used for server-to-server communication.
 */
export async function getClientCredentialsToken(): Promise<string> {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error("getClientCredentialsToken: Missing credentials. Aborting request to Coursera.");
    throw new Error("Coursera Client ID or Secret is not configured in environment variables.");
  }

  // 1. Base64 encode the credentials for Basic Auth
  const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  // 2. Use the specific client_credentials endpoint provided by Coursera
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    // 3. Body must be URL-encoded, containing only the grant_type
    body: new URLSearchParams({
      'grant_type': 'client_credentials'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Client credentials token fetch failed: ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function readCourseraError(response: Response) {
  const text = await response.text();
  if (!text) return `${response.status} ${response.statusText}`;

  try {
    return JSON.stringify(JSON.parse(text));
  } catch {
    return text;
  }
}

export async function getStudentProgress(accessToken: string) {
  const response = await fetch(`https://api.coursera.com/ent/api/enterpriseLearningPaths.v1/${LEARNING_PATH_ID}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-Coursera-Org-Id': ORG_ID!,
      'X-Coursera-Organization-Id': ORG_ID!,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to fetch Learning Path progress: ${JSON.stringify(error)}`);
  }

  return await response.json();
}

/**
 * Fetches aggregated usage data for all learners in the organization.
 * Recommended for populating global leaderboards efficiently.
 */
export async function getEnterpriseUsageV2(accessToken: string) {
  const params = new URLSearchParams({
    orgId: ORG_ID!,
  });

  const response = await fetch(`https://api.coursera.com/ent/api/enterpriseUsageEvents.v2?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-Coursera-Org-Id': ORG_ID!,
      'X-Coursera-Organization-Id': ORG_ID!,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const error = await readCourseraError(response);
    throw new Error(`Failed to fetch Enterprise Usage V2: ${error}`);
  }

  return await response.json();
}

export interface CourseraEnrollmentReport {
  id: string;
  learnerId?: string;
  userId?: string;
  externalId?: string;
  name?: string;
  userName?: string;
  fullName?: string;
  email?: string;
  courseName?: string;
  contentName?: string;
  status?: string;
  enrollmentStatus?: string;
  progress?: number;
  overallProgress?: number;
  grade?: number;
  completedAt?: string;
  enrolledAt?: string;
  lastActivityAt?: string;
  deletedAt?: string;
  isDeleted?: boolean;
  [key: string]: unknown;
}

function getEnrollmentElements(data: any): CourseraEnrollmentReport[] {
  if (Array.isArray(data?.elements)) return data.elements;
  if (Array.isArray(data?.data?.elements)) return data.data.elements;
  if (Array.isArray(data?.enrollmentReports)) return data.enrollmentReports;
  if (Array.isArray(data)) return data;
  return [];
}

function getNextStart(data: any, start: number, limit: number, count: number) {
  const paging = data?.paging || data?.data?.paging;
  if (typeof paging?.next === 'number') return paging.next;
  if (typeof paging?.nextStart === 'number') return paging.nextStart;
  if (count < limit) return null;
  return start + limit;
}

export async function getEnrollmentReports(accessToken: string) {
  if (!ORG_ID) {
    throw new Error('COURSERA_ORG_ID is not configured.');
  }

  const limit = 100;
  let start = 0;
  const enrollments: CourseraEnrollmentReport[] = [];

  for (let page = 0; page < 50; page += 1) {
    const params = new URLSearchParams({
      start: String(start),
      limit: String(limit),
      includeS12n: 'true',
    });

    // Only filter by Program ID if it looks like an encoded ID (long alphanumeric)
    // slugs like "gwg-ent..." will cause Coursera to return a 400 error.
    if (PROGRAM_ID && PROGRAM_ID.length > 15 && !PROGRAM_ID.includes('-')) {
      params.set('q', 'byProgramId');
      params.set('programId', PROGRAM_ID);
    }

    const response = await fetch(
      `https://api.coursera.com/ent/api/businesses.v1/${ORG_ID}/enrollmentReports?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Coursera-Org-Id': ORG_ID!,
          'X-Coursera-Organization-Id': ORG_ID!,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Coursera API Error (${response.status}):`, errorText);
      throw new Error(`Coursera Reporting API returned ${response.status}: ${errorText.substring(0, 100)}`);
    }

    const data = await response.json();
    const elements = getEnrollmentElements(data);
    enrollments.push(...elements);

    const nextStart = getNextStart(data, start, limit, elements.length);
    if (nextStart === null) break;
    start = nextStart;
  }

  return enrollments;
}

export function calculateProgress(data: any) {
  // Handle both individual Learning Path API and bulk Enrollment Reports API
  const isVerified = data?.integrityStatus === 'PASSED' || 
                    data?.verificationStatus === 'VERIFIED' || 
                    !!data?.completedAt;

  const courses = data?.elements || data?.enrollments || data?.courses || [];
  
  // If data comes from enterpriseLearningPaths.v1, it often provides direct counts
  const completed = data?.completedCount ?? courses.filter((c: any) => c.status === 'COMPLETED' || !!c.completedAt).length;
  const totalCount = data?.totalCount ?? courses.length;
  
  // The Google Cybersecurity cert consists of 9 courses. We use dynamic length with a fallback.
  const total = totalCount > 0 ? totalCount : 9; 

  // Calculate percentage (Learning Path API provides 'progress' as a decimal 0-1)
  const rawPercentage = data?.progress !== undefined ? data.progress * 100 : (completed / total) * 100;

  return {
    completed,
    total,
    percentage: Math.min(100, Math.round(rawPercentage || 0)),
    isVerified,
    integrityStatus: data.integrityStatus,
    estimatedHours: data.estimatedLearningHours || 0
  };
}
