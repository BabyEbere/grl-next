import { query } from './db';
import { Product } from './types';

/** Get a featured product image for a category slug */
export async function getCatImage(catSlug: string, fallback: string): Promise<string> {
  try {
    const rows = await query<Product>(
      `SELECT image_path, image_url FROM products
       WHERE category_slug=? AND is_active=1 AND (image_path!='' OR image_url!='')
       ORDER BY is_featured DESC, sort_order ASC LIMIT 1`,
      [catSlug]
    );
    if (rows[0]) {
      return rows[0].image_path || rows[0].image_url;
    }
  } catch (e) {
    console.error(`Error fetching category image for ${catSlug}:`, e);
  }
  return fallback;
}
