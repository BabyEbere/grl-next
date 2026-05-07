import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { PHP_API_URL } from '@/lib/config';

/** Get all categories via PHP */
export async function GET() {
  const resp = await fetch(`${PHP_API_URL}?action=get_categories`, { cache: 'no-store' });
  return NextResponse.json(await resp.json());
}

/** Update or Create category via PHP */
export async function POST(request: Request) {
  try {
    await requireAuth();
    const data = await request.json();
    const resp = await fetch(`${PHP_API_URL}?action=save_category`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return NextResponse.json(await resp.json());
  } catch (e) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}

/** Delete category via PHP */
export async function DELETE(request: Request) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const resp = await fetch(`${PHP_API_URL}?action=delete_category&id=${id}`, {
      method: 'GET'
    });
    return NextResponse.json(await resp.json());
  } catch (e) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
