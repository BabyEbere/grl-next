import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { PHP_API_URL } from '@/lib/config';

export async function GET(request: Request) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = id ? 'get_admin_blog_single' : 'get_admin_blog';
    const url = `${PHP_API_URL}?action=${action}${id ? `&id=${id}` : ''}`;
    
    const resp = await fetch(url);
    return NextResponse.json(await resp.json());
  } catch (e) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const data = await request.json();
    const resp = await fetch(`${PHP_API_URL}?action=save_blog_post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return NextResponse.json(await resp.json());
  } catch (e) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}

export async function DELETE(request: Request) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const resp = await fetch(`${PHP_API_URL}?action=delete_blog_post&id=${id}`);
    return NextResponse.json(await resp.json());
  } catch (e) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
