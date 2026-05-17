const CLIENT_ID = process.env.COURSERA_CLIENT_ID;
const CLIENT_SECRET = process.env.COURSERA_CLIENT_SECRET;
const ORG_ID = process.env.COURSERA_ORG_ID || process.env.COURSERA_ORGANIZATION_ID || process.env.COURSERA_Organization_ID;
const LEARNING_PATH_ID = process.env.COURSERA_LEARNING_PATH_ID || '0iKHbCiJQp-ih2woiUKfxA';
const PROGRAM_ID = process.env.COURSERA_PROGRAM_ID || process.env.COURSERA_PROGRAM_SLUG;
const REDIRECT_URI = 'https://services.letsleadwise.org/api/auth/callback';

const AUTH_URL = 'https://accounts.coursera.org/oauth2/v1/auth';
const TOKEN_URL = 'https://accounts.coursera.org/oauth2/v1/token';

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
    const error = await readCourseraError(response);
    throw new Error(`Client credentials token fetch failed: ${error}`);
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

    if (PROGRAM_ID) {
      params.set('q', 'byProgramId');
      params.set('programId', PROGRAM_ID);
    }

    const response = await fetch(
      `https://api.coursera.org/api/businesses.v1/${ORG_ID}/enrollmentReports?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Coursera-Org-Id': ORG_ID,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch Coursera enrollment reports: ${error}`);
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
