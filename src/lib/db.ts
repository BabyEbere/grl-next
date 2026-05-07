import { PHP_API_URL } from '@/lib/config';

/** 
 * Helper to fetch from PHP Backend 
 * Replaces direct SQL queries with API calls for specific actions.
 */
export async function query<T = any>(
  sql: string,
  values?: unknown[]
): Promise<T[]> {
  // Mapping SQL to PHP API actions for migration compatibility
  let action = '';
  const searchParams = new URLSearchParams();

  const lSql = sql.toLowerCase();
  // Order matters: use stricter word boundary checks for primary table
  if (/\bproduct_categories\b/.test(lSql) && !/\bproducts\b/.test(lSql)) {
    action = 'get_categories';
  } else if (/\bhomepage_divisions\b/.test(lSql)) {
    action = 'get_divisions';
  } else if (/\bpage_visits\b/.test(lSql)) {
    action = 'get_stats';
  } else if (/\bblog_posts\b/.test(lSql)) {
    action = 'get_admin_blog';
  } else if (/\bsite_settings\b/.test(lSql)) {
    action = 'get_settings';
  } else if (/\bproducts\b/.test(lSql)) {
    action = 'get_products';
  }

  // Specific mapping for saving/deleting
  if (lSql.startsWith('insert') || lSql.startsWith('update')) {
    if (action === 'get_products') action = 'save_product';
    if (action === 'get_categories') action = 'save_category';
    if (action === 'get_divisions') action = 'save_division';
    if (action === 'get_admin_blog') action = 'save_blog_post';
  }
  if (lSql.startsWith('delete')) {
    if (action === 'get_products') action = 'delete_product';
    if (action === 'get_categories') action = 'delete_category';
    if (action === 'get_divisions') action = 'delete_division';
    if (action === 'get_admin_blog') action = 'delete_blog_post';
  }

  // Extract params for products/categories if applicable
  if (values && values.length > 0) {
     const slugVal = values[values.length - 1] as string;
     
     if (action === 'get_products') {
        if (/(category_slug|p\.category_slug)\s*=\s*\?/.test(lSql)) {
           searchParams.set('cat', values[0] as string);
        } else if (/(^|\s|\.)slug\s*=\s*\?/.test(lSql)) {
           searchParams.set('slug', slugVal);
        }
        if (lSql.includes('is_featured = 1')) searchParams.set('featured', '1');
     }

     if (action === 'get_categories') {
        if (/(^|\s|\.)slug\s*=\s*\?/.test(lSql)) {
           searchParams.set('slug', slugVal);
        }
     }
  }
  
  if (lSql.includes('p.id desc') || lSql.includes('id desc')) {
     searchParams.set('all', '1');
  }

  try {
    const res = await fetch(`${PHP_API_URL}?action=${action}&${searchParams.toString()}`, { 
      cache: 'no-store' 
    });
    const data = await res.json();
    
    // PHP API returns objects like {products: []}, we need to return the array
    if (action === 'get_products') {
       if (data.product) return [data.product];
       return data.products || [];
    }
    if (action === 'get_categories') {
       if (data.category) return [data.category];
       return data.categories || [];
    }
    if (action === 'get_admin_blog') {
       return data.posts || [];
    }
    if (action === 'get_divisions') return data.divisions || [];
    if (action === 'get_settings') {
       // Convert dictionary back to array of {setting_key, setting_value} for compatibility
       return Object.entries(data.settings || {}).map(([setting_key, setting_value]) => ({
          setting_key, setting_value: setting_value as string
       })) as any;
    }
    if (action === 'get_stats') {
       // Return stats object wrapped in array if expected that way, 
       // but usually stats API is special. 
       return data; 
    }

    return data;
  } catch (err) {
    console.error('PHP API Error:', err);
    return [];
  }
}

/** Get a single site setting via PHP API */
export async function getSetting(key: string, fallback = ''): Promise<string> {
  const settings = await getSettings([key]);
  return settings[key] ?? fallback;
}

/** Get multiple settings via PHP API */
export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${PHP_API_URL}?action=get_settings`, { cache: 'no-store' });
    const data = await res.json();
    const allSettings = data.settings || {};
    const out: Record<string, string> = {};
    keys.forEach(k => { if(allSettings[k]) out[k] = allSettings[k]; });
    return out;
  } catch {
    return {};
  }
}
