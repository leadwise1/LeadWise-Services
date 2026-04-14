import { NextRequest, NextResponse } from 'next/server';
import { getStudentProgress, calculateProgress } from '@/lib/coursera';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('coursera_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated with Coursera' }, { status: 401 });
  }

  try {
    const data = await getStudentProgress(token);
    
    // The Coursera Reporting API returns a list of enrollments.
    // We will extract the relevant progress for the Cybersecurity course.
    const progress = calculateProgress(data.elements || []);

    return NextResponse.json({
      success: true,
      ...progress
    });
  } catch (error) {
    console.error('Failed to fetch progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress from Coursera' }, { status: 500 });
  }
}
