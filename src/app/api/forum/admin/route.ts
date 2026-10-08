import { NextRequest, NextResponse } from 'next/server';
import { authorizeCommunityAdmin } from '@/lib/community-admin';

export async function GET(request: NextRequest) {
  const denied = await authorizeCommunityAdmin(request);
  return denied || NextResponse.json({ admin: true }, { headers: { 'Cache-Control': 'no-store' } });
}
