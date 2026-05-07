import { NextResponse }  from 'next/server';
import { query }         from '@/lib/db';
import type { Product }  from '@/lib/types';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const rows = await query<Product>(
      `SELECT p.*, c.name as cat_name, c.slug as cat_slug
       FROM products p
       LEFT JOIN product_categories c ON p.category_slug = c.slug
       WHERE p.slug = ? AND p.is_active = 1 LIMIT 1`,
      [slug]
    );
    if (!rows[0]) {
      return NextResponse.json({ product: null }, { status: 404 });
    }

    // Related products
    const related = await query<Product>(
      `SELECT id, name, slug, description, image_url, image_path, badge, tag
       FROM products WHERE category_slug = ? AND slug != ? AND is_active = 1
       ORDER BY sort_order LIMIT 3`,
      [rows[0].category_slug, slug]
    );

    return NextResponse.json({ product: rows[0], related });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ product: null }, { status: 500 });
  }
}
