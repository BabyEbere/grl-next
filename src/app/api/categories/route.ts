import { NextResponse } from 'next/server';
import { query }        from '@/lib/db';
import type { Category } from '@/lib/types';

export async function GET() {
  try {
    const categories = await query<Category>(
      'SELECT * FROM product_categories ORDER BY sort_order'
    );
    return NextResponse.json({ categories });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ categories: [] });
  }
}
