import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';

export async function POST(request: Request) {
  await destroySession();
  return NextResponse.redirect(new URL('/grl-ops-x7/login', request.url));
}
