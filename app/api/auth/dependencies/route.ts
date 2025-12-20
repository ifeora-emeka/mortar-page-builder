import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth.lib';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ user: null, orgUsers: [] });
    }
    return NextResponse.json({ user, orgUsers: user.organizationUsers });
  } catch (error) {
    console.error('Dependencies error:', error);
    return NextResponse.json({ user: null, orgUsers: [] }, { status: 500 });
  }
}