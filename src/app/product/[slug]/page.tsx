import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/config';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { query, getSetting } from '@/lib/db';
import { Product } from '@/lib/types';
import { notFound } from 'next/navigation';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

/** Dynamic metadata for SEO */
export async function generateMetadata(
  { params }: ProductDetailPageProps
): Promise<Metadata> {
  const { slug } = await params;
  const rows = await query<Product>(
    'SELECT name, description, meta_title, meta_description, image_url, image_path FROM products WHERE slug = ? AND is_active = 1 LIMIT 1',
    [slug]
  );
  
  if (!rows[0]) return { title: 'Product Not Found' };
  
  const product = rows[0];
  const companyName = await getSetting('company_name', 'Global Resources Limited');
  const title = product.meta_title || `${product.name} | ${companyName}`;
  const description = product.meta_description || product.description.substring(0, 160);
  
  let imageUrl = product.image_url;
  if (product.image_path) {
    imageUrl = `${SITE_URL}/${product.image_path}`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/product/${slug}`,
    },
    openGraph: {
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    }
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  // Fetch product data
  const rows = await query<Product>(
    `SELECT p.*, c.name as cat_name, c.slug as cat_slug 
     FROM products p
     LEFT JOIN product_categories c ON p.category_slug = c.slug
     WHERE p.slug = ? AND p.is_active = 1 LIMIT 1`,
    [slug]
  );
  
  if (!rows[0]) notFound();
  
  const product = rows[0];

  // Related products
  const related = await query<Product>(
    `SELECT id, name, slug, description, image_url, image_path, badge, tag
     FROM products WHERE category_slug = ? AND slug != ? AND is_active = 1
     ORDER BY sort_order LIMIT 3`,
    [product.category_slug, slug]
  );

  // Parse features and specs
  const features = product.features ? product.features.split('\n').map(f => f.trim()).filter(f => f) : [];
  const specs = product.specifications ? product.specifications.split('\n').map(line => {
    if (line.includes(':')) {
      const [key, value] = line.split(':');
      return { key: key.trim(), value: value.trim() };
    }
    return null;
  }).filter(s => s !== null) as { key: string; value: string }[] : [];

  const mainImg = product.image_path || product.image_url;

  return (
    <>
      <Header />

      <main className="bg-white">
        {/* Breadcrumbs */}
        <div className="bg-gray-50 border-b border-gray-100 py-4">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-amber-500 transition-colors">Home</Link>
            <i className="ri-arrow-right-s-line"></i>
            <Link href="/products" className="hover:text-amber-500 transition-colors">Products</Link>
            <i className="ri-arrow-right-s-line"></i>
            <Link href={`/products/${product.category_slug}`} className="hover:text-amber-500 transition-colors">{product.cat_name}</Link>
            <i className="ri-arrow-right-s-line"></i>
            <span className="text-amber-500 font-bold">{product.name}</span>
          </div>
        </div>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16">
              
              {/* Image side */}
              <div className="reveal">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-50 border border-gray-100">
                  {mainImg ? (
                    <img src={mainImg.startsWith('http') ? mainImg : `/${mainImg}`} alt={product.name} className="w-full h-auto object-cover" />
                  ) : (
                    <div className="w-full aspect-square flex items-center justify-center text-gray-200">
                      <i className="ri-image-line text-7xl"></i>
                    </div>
                  )}
                  {product.badge && (
                    <span className="absolute top-6 left-6 bg-amber-500 text-[#0f1f3d] text-xs font-black uppercase px-4 py-1.5 rounded-full shadow-lg">
                      {product.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Content side */}
              <div className="reveal delay-100">
                 <div className="mb-6 flex flex-wrap gap-2">
                    <span className="bg-[#0f1f3d] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
                       {product.cat_name}
                    </span>
                    {product.tag && (
                       <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
                          {product.tag}
                       </span>
                    )}
                 </div>
                 
                 <h1 className="font-display font-black text-4xl md:text-5xl text-[#0f1f3d] leading-tight mb-4">
                   {product.name}
                 </h1>
                 
                 <p className="text-gray-500 leading-relaxed text-lg mb-8">
                   {product.description}
                 </p>

                 {features.length > 0 && (
                   <div className="mb-8">
                      <h3 className="text-[#0f1f3d] font-bold text-lg mb-3 flex items-center gap-2">
                        <i className="ri-checkbox-circle-fill text-amber-500"></i> Key Features
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-y-2 gap-x-4">
                        {features.map((f, i) => (
                          <div key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                             <i className="ri-check-line text-amber-500 font-bold mt-0.5"></i> {f}
                          </div>
                        ))}
                      </div>
                   </div>
                 )}

                 <div className="flex flex-wrap gap-4 pt-4 mb-10">
                    <Link 
                      href="/contact" 
                      className="bg-amber-500 hover:bg-amber-400 text-[#0f1f3d] font-black px-8 py-4 rounded-xl transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
                    >
                      <i className="ri-mail-send-line"></i> Get a Custom Quote
                    </Link>
                    <a 
                      href={`https://wa.me/${await getSetting('whatsapp', '2349024384244')}`} 
                      target="_blank" rel="noopener" 
                      className="border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 text-[#0f1f3d] hover:text-green-600 font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <i className="ri-whatsapp-line"></i> Chat via WhatsApp
                    </a>
                 </div>

                 {/* Specifications Table */}
                 {specs.length > 0 && (
                   <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h3 className="text-[#0f1f3d] font-bold text-lg mb-4">Specifications</h3>
                      <div className="space-y-3">
                         {specs.map((s, i) => (
                           <div key={i} className="flex justify-between items-center py-2 border-b border-gray-200/50 last:border-0">
                             <span className="text-gray-500 text-sm">{s.key}</span>
                             <span className="text-[#0f1f3d] font-bold text-sm text-right">{s.value}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}
              </div>
            </div>

            {/* Long Description (Rich Text) */}
            {product.full_description && (
              <div className="mt-24 max-w-4xl mx-auto reveal">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="h-0.5 flex-1 bg-gray-100"></div>
                    <span className="text-amber-500 font-black text-xs uppercase tracking-widest">In-Depth Information</span>
                    <div className="h-0.5 flex-1 bg-gray-100"></div>
                 </div>
                 <div 
                   className="product-description prose max-w-none"
                   dangerouslySetInnerHTML={{ __html: product.full_description }}
                 />
              </div>
            )}
          </div>
        </section>

        {/* Related products */}
        {related.length > 0 && (
          <section className="py-24 bg-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
               <div className="flex items-end justify-between mb-12 reveal">
                  <div>
                    <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-2">Continue Browsing</p>
                    <h2 className="font-display font-black text-3xl text-[#0f1f3d]">Similar Equipment</h2>
                  </div>
                  <Link href={`/products/${product.category_slug}`} className="hidden sm:flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-amber-500 transition-colors">
                     View All Category <i className="ri-arrow-right-line"></i>
                  </Link>
               </div>
               <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {related.map(r => (
                    <ProductCard key={r.id} product={r} />
                  ))}
               </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
