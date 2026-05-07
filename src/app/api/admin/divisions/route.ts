import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

/** Get all divisions */
export async function GET() {
  try {
    const divisions = await query('SELECT * FROM homepage_divisions ORDER BY sort_order');
    return NextResponse.json({ divisions });
  } catch (e) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}

/** Update or Create division */
export async function POST(request: Request) {
  try {
    await requireAuth();
    const data = await request.json();
    const { 
      id, title, description, icon, icon_bg, icon_color, 
      image_url, image_path, link_href, badge_text, cta_text, 
      sort_order, is_active 
    } = data;

    if (id) {
       await query(
         `UPDATE homepage_divisions SET 
          title=?, description=?, icon=?, icon_bg=?, icon_color=?, 
          image_url=?, image_path=?, link_href=?, badge_text=?, cta_text=?, 
          sort_order=?, is_active=? WHERE id=?`,
         [
           title, description, icon, icon_bg || 'bg-amber-50', icon_color || 'text-amber-500',
           image_url, image_path, link_href || '#', badge_text, cta_text || 'Learn More',
           sort_order || 0, is_active ? 1 : 0, id
         ]
       );
       return NextResponse.json({ message: 'Division updated' });
    } else {
       await query(
         `INSERT INTO homepage_divisions 
          (title, description, icon, icon_bg, icon_color, image_url, image_path, link_href, badge_text, cta_text, sort_order, is_active) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
         [
           title, description, icon, icon_bg || 'bg-amber-50', icon_color || 'text-amber-500',
           image_url, image_path, link_href || '#', badge_text, cta_text || 'Learn More',
           sort_order || 0, is_active ? 1 : 0
         ]
       );
       return NextResponse.json({ message: 'Division created' });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'Error saving division' }, { status: 500 });
  }
}

/** Delete division */
export async function DELETE(request: Request) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ message: 'Missing ID' }, { status: 400 });
    await query('DELETE FROM homepage_divisions WHERE id=?', [id]);
    return NextResponse.json({ message: 'Division deleted' });
  } catch (e) {
    return NextResponse.json({ message: 'Error deleting' }, { status: 500 });
  }
}
