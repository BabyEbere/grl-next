import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/config';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { query, getSetting } from '@/lib/db';
import { Category, Product } from '@/lib/types';
import { notFound } from 'next/navigation';

interface ProductsPageProps {
  params: Promise<{ cat: string }>;
}

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { cat } = await params;
  const companyName = 'Global Resources Limited';
  
  if (cat === 'all') return { 
    title: `All Products | ${companyName}`,
    description: `Explore our full range of industrial machinery, automobiles, petroleum products, and retail items.` 
  };

  const rows = await query<Category>('SELECT name, meta_title, meta_description FROM product_categories WHERE slug = ? LIMIT 1', [cat]);
  if (!rows[0]) return { title: `Products | ${companyName}` };
  
  const catData = rows[0];
  return {
    title: catData.meta_title || `${catData.name} | ${companyName}`,
    description: catData.meta_description || `Browse our high-quality ${catData.name.toLowerCase()}. Global Resources Limited provides premium solutions tailored to your industry needs.`,
    alternates: {
      canonical: `${SITE_URL}/products/${cat}`,
    }
  };
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { cat } = await params;

  // Load categories
  const categoryRows = await query<Category>(
    'SELECT slug, name, icon, meta_title, meta_description FROM product_categories ORDER BY sort_order'
  );
  
  const categoriesList = [
    { slug: 'all', name: 'All Products', icon: 'ri-apps-line', description: '' },
    ...categoryRows
  ];

  // Validate category
  const currentCategory = categoriesList.find(c => c.slug === cat);
  if (!currentCategory) {
    // If not found, it might be that 'products' was called without slug, 
    // but Next.js router handles that. If cat exists but not in list, 404.
    if (cat !== 'all') notFound();
  }

  const categoryName = currentCategory?.name || 'Products';

  // Banner images fallback
  const bannerImages: Record<string, string> = {
    'all':         'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=1400&q=80',
    'excavators':  'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=1400&q=80',
    'cranes':      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=80',
    'bulldozers':  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
    'trucks':      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1400&q=80',
    'forklifts':   'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&q=80',
    'automobiles': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&q=80',
    'petroleum':   'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1400&q=80',
    'shopping':    'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=1400&q=80',
  };
  const bannerImage = bannerImages[cat] || bannerImages.all;

  // Fetch products
  let products: Product[] = [];
  if (cat === 'all') {
    products = await query<Product>(
      'SELECT * FROM products WHERE is_active=1 ORDER BY category_slug, sort_order'
    );
  } else {
    products = await query<Product>(
      'SELECT * FROM products WHERE is_active=1 AND category_slug=? ORDER BY sort_order',
      [cat]
    );
  }

  // Petroleum note
  const petroleumNote = await getSetting('petroleum_delivery_note', 
    'All petroleum products are delivered by truck directly to your location anywhere in Nigeria. We handle full logistics — contact us to arrange delivery.');

  return (
    <>
      <Header />

      <main>
        {/* Banner */}
        <section className="relative py-24 bg-[#060f1e] overflow-hidden">
          <img src={bannerImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060f1e] to-[#060f1e]/60"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <p className="text-amber-400 text-xs font-black uppercase tracking-widest mb-3">
              {categoryName}
            </p>
            <h1 className="font-display font-black text-5xl text-white mb-4">Products &amp; Services</h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">
              {currentCategory?.description || 'Browse our comprehensive catalogue. Contact us for availability and custom pricing.'}
            </p>
            <div className="flex items-center justify-center gap-2 mt-5 text-sm text-gray-400">
              <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
              <i className="ri-arrow-right-s-line"></i>
              <span className="text-amber-400">{categoryName}</span>
            </div>
          </div>
        </section>

        {/* Filter tabs */}
        <div className="bg-white border-b border-gray-100 sticky top-[72px] z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {categoriesList.map(category => (
              <Link 
                key={category.slug}
                href={`/products/${category.slug}`}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${cat === category.slug ? 'bg-[#0f1f3d] text-white' : 'text-gray-600 hover:text-[#0f1f3d] hover:bg-gray-100'}`}
              >
                <i className={category.icon}></i> {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <section className="py-16 bg-gray-50 min-h-[60vh]">
          <div className="max-w-7xl mx-auto px-6">
            
            {cat === 'petroleum' && (
              <div className="mb-10 rounded-3xl overflow-hidden reveal">
                <div className="relative">
                  <img src="https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&q=80" alt="Petroleum Supply" className="w-full h-56 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-900/95 to-orange-900/60 flex items-center">
                    <div className="px-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <i className="ri-truck-line text-amber-400 text-xl"></i>
                          <h3 className="font-display font-black text-2xl text-white">Truck Delivery — Nationwide</h3>
                        </div>
                        <p className="text-orange-100 text-sm leading-relaxed max-w-xl">{petroleumNote}</p>
                      </div>
                      <Link href="/contact" className="flex-shrink-0 bg-amber-500 hover:bg-amber-400 text-[#0f1f3d] font-black px-6 py-3 rounded-xl transition-colors text-sm">
                        Get Supply Quote
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {products.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                   <i className="ri-inbox-line text-4xl"></i>
                </div>
                <h3 className="text-[#0f1f3d] font-bold text-xl mb-2">No products found</h3>
                <p className="text-gray-500">Try browsing another category or check back later.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
