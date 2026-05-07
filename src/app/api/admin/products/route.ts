import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { PHP_API_URL } from '@/lib/config';

/** Handle GET: Fetch single product by id for admin */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ message: 'ID required' }, { status: 400 });

    const resp = await fetch(`${PHP_API_URL}?action=get_products&id=${id}&all=1`, { 
      cache: 'no-store' 
    });
    return NextResponse.json(await resp.json());
  } catch (e) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}

/** Handle POST/PUT: Save product via PHP */
export async function POST(request: Request) {
  try {
    await requireAuth();
    const data = await request.json();
    const resp = await fetch(`${PHP_API_URL}?action=save_product`, {
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
  return POST(request); // handler.php handles both via same action
}

/** Handle DELETE: Remove product via PHP */
export async function DELETE(request: Request) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const resp = await fetch(`${PHP_API_URL}?action=delete_product&id=${id}`, {
      method: 'GET' // using GET for delete action in handler simple impl
    });
    return NextResponse.json(await resp.json());
  } catch (e) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
