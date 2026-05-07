import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { PHP_API_URL } from '@/lib/config';

/** Get all settings via PHP */
export async function GET() {
  const resp = await fetch(`${PHP_API_URL}?action=get_settings`, { cache: 'no-store' });
  return NextResponse.json(await resp.json());
}

/** Update multiple settings via PHP */
export async function POST(request: Request) {
  try {
    await requireAuth();
    const data = await request.json();
    const resp = await fetch(`${PHP_API_URL}?action=get_settings`, { // Settings POST logic is in settings.php included in handler
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return NextResponse.json(await resp.json());
  } catch (e) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
