import { NextResponse }  from 'next/server';
import { query }         from '@/lib/db';
import type { Product }  from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cat     = searchParams.get('cat')  || '';
  const limit   = parseInt(searchParams.get('limit') || '50');
  const featured= searchParams.get('featured') === '1';

  try {
    let sql = `SELECT p.*, c.name as cat_name, c.slug as cat_slug
               FROM products p
               LEFT JOIN product_categories c ON p.category_slug = c.slug
               WHERE p.is_active = 1`;
    const params: (string | number)[] = [];

    if (cat) {
      sql += ' AND p.category_slug = ?';
      params.push(cat);
    }
    if (featured) {
      sql += ' AND p.is_featured = 1';
    }

    sql += ' ORDER BY p.sort_order, p.id LIMIT ?';
    params.push(limit);

    const products = await query<Product>(sql, params);
    return NextResponse.json({ products });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ products: [] });
  }
}
