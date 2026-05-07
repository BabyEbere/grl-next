import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { PHP_API_URL } from '@/lib/config';

export async function GET(request: Request) {
  try {
    await requireAuth();
    const url = new URL(request.url);
    const params = new URLSearchParams(url.searchParams);
    
    const resp = await fetch(`${PHP_API_URL}?${params.toString()}`, { cache: 'no-store' });
    const text = await resp.text();
    try {
      const cleanText = text.replace(/^\uFEFF/, '').trim();
      const data = JSON.parse(cleanText);
      return NextResponse.json(data, { status: resp.status });
    } catch(err) {
      console.error('PHP Proxy Error:', text);
      return NextResponse.json({ message: text.substring(0, 150) }, { status: 500 });
    }
  } catch (e: any) {
    if (e.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized session' }, { status: 401 });
    }
    return NextResponse.json({ message: e.message || 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();
    const url = new URL(request.url);
    const params = new URLSearchParams(url.searchParams);

    const resp = await fetch(`${PHP_API_URL}?${params.toString()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const text = await resp.text();
    try {
      const cleanText = text.replace(/^\uFEFF/, '').trim();
      const data = JSON.parse(cleanText);
      return NextResponse.json(data, { status: resp.status });
    } catch(err) {
      console.error('PHP Proxy Error POST:', text);
      return NextResponse.json({ message: text.substring(0, 150) }, { status: 500 });
    }
  } catch (e: any) {
    if (e.message === 'Unauthorized') return NextResponse.json({ message: 'Unauthorized session' }, { status: 401 });
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAuth();
    const url = new URL(request.url);
    const params = new URLSearchParams(url.searchParams);

    const resp = await fetch(`${PHP_API_URL}?${params.toString()}`, { method: 'GET' });
    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch (e) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
