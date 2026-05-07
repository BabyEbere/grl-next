import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { PHP_API_URL } from '@/lib/config';

export async function GET() {
  try {
    await requireAuth();
    const resp = await fetch(`${PHP_API_URL}?action=get_staff`, { cache: 'no-store' });
    return NextResponse.json(await resp.json());
  } catch (e) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();
    const resp = await fetch(`${PHP_API_URL}?action=save_staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return NextResponse.json(await resp.json());
  } catch (e) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const resp = await fetch(`${PHP_API_URL}?action=delete_staff&id=${id}`);
    return NextResponse.json(await resp.json());
  } catch (e) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
