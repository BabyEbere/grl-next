import { NextResponse } from 'next/server';
import { query }        from '@/lib/db';
import type { Division } from '@/lib/types';

export async function GET() {
  try {
    const divisions = await query<Division>(
      'SELECT * FROM homepage_divisions WHERE is_active=1 ORDER BY sort_order'
    );
    return NextResponse.json({ divisions });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ divisions: [] });
  }
}
