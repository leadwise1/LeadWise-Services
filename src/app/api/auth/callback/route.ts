import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken } from '@/lib/coursera';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('Coursera Auth Error:', error);
    return NextResponse.redirect(new URL('/courses?auth_error=' + error, request.url));
  }

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    const tokenData = await exchangeCodeForToken(code);
    
    // In a production app, you would save this to a secure database (like Firestore)
    // linked to the user's session, or set a secure HTTP-Only cookie.
    
    // For this implementation, we will redirect back to the courses page
    // and pass a success flag. In a real scenario, the frontend would then
    // fetch the progress using the stored token / session.
    
    const response = NextResponse.redirect(new URL('/courses?auth_success=true', request.url));
    
    // Set a cookie (simplified for demo/mvp)
    // In a real app, use a more secure session management system
    response.cookies.set('coursera_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: tokenData.expires_in
    });

    console.log('Successfully set coursera_token cookie for the session.');

    return response;
  } catch (error) {
    console.error('Token exchange failed:', error);
    return NextResponse.redirect(new URL('/courses?auth_error=exchange_failed', request.url));
  }
}
