import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { PHP_API_URL } from '@/lib/config';

export async function GET() {
  try {
    await requireAuth();
    const resp = await fetch(`${PHP_API_URL}?action=get_stats`, { cache: 'no-store' });
    return NextResponse.json(await resp.json());
  } catch (e) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
