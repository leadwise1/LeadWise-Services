import { NextResponse } from 'next/server';
import { getCourseraAuthUrl } from '@/lib/coursera';

export async function GET() {
  try {
    const url = await getCourseraAuthUrl();
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Login initiation failed:', error);
    return NextResponse.json({ error: 'Failed to initiate login' }, { status: 500 });
  }
}
