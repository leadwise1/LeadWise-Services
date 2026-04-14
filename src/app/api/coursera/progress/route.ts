import { NextRequest, NextResponse } from 'next/server';
import { getStudentProgress, calculateProgress } from '@/lib/coursera';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('coursera_token')?.value;

  if (!token) {
    console.warn('/api/coursera/progress: No coursera_token found in request cookies.');
    return NextResponse.json({ error: 'Not authenticated with Coursera' }, { status: 401 });
  }

  try {
    console.log('/api/coursera/progress: Attempting to fetch progress with token.');
    const data = await getStudentProgress(token);
    
    // The Coursera Reporting API returns a list of enrollments.
    const progress = calculateProgress(data);
    
    console.log('/api/coursera/progress: Successfully retrieved and calculated progress.');

    return NextResponse.json({
      success: true,
      ...progress
    });
  } catch (error) {
    console.error('Failed to fetch progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress from Coursera' }, { status: 500 });
  }
}
