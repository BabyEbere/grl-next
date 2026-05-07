import { NextResponse } from 'next/server';
import { PHP_API_URL } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resp = await fetch(`${PHP_API_URL}?action=track_visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const text = await resp.text();
    try {
      const data = JSON.parse(text.replace(/^\uFEFF/, '').trim());
      return NextResponse.json(data);
    } catch(err) {
      console.error('Analytics PHP Crash:', text);
      return NextResponse.json({ error: text.substring(0, 150) }, { status: 500 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Analytics failure' }, { status: 500 });
  }
}
