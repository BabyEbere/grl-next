import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { PHP_API_URL } from '@/lib/config';

export async function POST(request: Request) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const data = await request.json();

    const action = section === 'username' ? 'update_username' : 'update_password';

    const resp = await fetch(`${PHP_API_URL}?action=${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await resp.json();
    if (!resp.ok) return NextResponse.json(result, { status: resp.status });

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
