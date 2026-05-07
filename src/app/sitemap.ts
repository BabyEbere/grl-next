import { MetadataRoute } from 'next';
import { query } from '@/lib/db';
import { SITE_URL } from '@/lib/config';
import { Product, Category } from '@/lib/types';

interface BlogPost {
  slug: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const companyUrl = SITE_URL;

  // 1. Static Pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/blog',
    '/products/all',
  ].map((route) => ({
    url: `${companyUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Categories
  const categoryRows = await query<Category>('SELECT slug FROM product_categories');
  const categoryPages = categoryRows.map((cat) => ({
    url: `${companyUrl}/products/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 3. Products
  const productRows = await query<Product>('SELECT slug FROM products WHERE is_active = 1');
  const productPages = productRows.map((prod) => ({
    url: `${companyUrl}/product/${prod.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  // 4. Blog Posts
  const blogRows = await query<BlogPost>('SELECT slug FROM blog_posts WHERE is_active = 1');
  const blogPages = blogRows.map((post) => ({
    url: `${companyUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}
