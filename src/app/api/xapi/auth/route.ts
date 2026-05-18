import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Coursera xAPI Auth Endpoint
 * This allows Coursera to authenticate with LeadWise using the Client Credentials 
 * you set in the Coursera Admin Dashboard.
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return NextResponse.json({ error: 'invalid_client' }, { status: 401 });
  }

  // Decode basic auth
  const base64Credentials = authHeader.split(' ')[1];
  const decoded = Buffer.from(base64Credentials, 'base64').toString('utf8');
  const [clientId, clientSecret] = decoded.split(':');

  const expectedId = process.env.XAPI_CLIENT_ID;
  const expectedSecret = process.env.XAPI_CLIENT_SECRET;

  // Verify against environment variables
  if (
    !expectedId || !expectedSecret ||
    clientId !== expectedId || 
    clientSecret !== expectedSecret
  ) {
    return NextResponse.json({ error: 'unauthorized_client' }, { status: 401 });
  }

  return NextResponse.json({
    // Generate a secure 64-character random hex token
    access_token: crypto.randomBytes(32).toString('hex'),
    token_type: "Bearer",
    expires_in: 3600
  });
}