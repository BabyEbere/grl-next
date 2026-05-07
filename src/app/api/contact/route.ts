import { NextResponse } from 'next/server';
import { PHP_API_URL } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Proxy to PHP API (using specific contact.php)
    const PHP_CONTACT_URL = PHP_API_URL.replace('handler.php', 'contact.php');
    const resp = await fetch(PHP_CONTACT_URL, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(data)
    });
    return NextResponse.json(await resp.json());
  } catch (e) {
    console.error('Contact API Error:', e);
    return NextResponse.json(
      { message: 'An error occurred while sending your message.' },
      { status: 500 }
    );
  }
}
