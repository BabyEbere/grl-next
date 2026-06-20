import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { query } from '@/lib/db';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  description: string;
  image_url?: string;
  image_path?: string;
  created_at: string;
}

export const metadata = {
  title: 'Blog & News | Global Resources Limited',
  description: 'Stay updated with the latest news, articles, and insights from Global Resources Limited. Industrial machinery, petroleum insights, and corporate updates.',
};

export default async function BlogListingPage() {
  const posts = await query<BlogPost>(
    'SELECT id, title, slug, description, image_url, image_path, created_at FROM blog_posts WHERE is_active=1 ORDER BY created_at DESC'
  );

  const bannerImage = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1400&q=80';

  return (
    <>
      <Header />

      <main>
        {/* Banner */}
        <section className="relative py-16 md:py-24 bg-[#060f1e] overflow-hidden">
          <img src={bannerImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060f1e] to-[#060f1e]/60"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-amber-400 text-xs font-black uppercase tracking-widest mb-3">
              Insights & Updates
            </p>
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white mb-4">Our Blog</h1>
            <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto">
              Latest news, technical articles, and corporate updates from across our divisions.
            </p>
            <div className="flex items-center justify-center gap-2 mt-5 text-sm text-gray-400">
              <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
              <i className="ri-arrow-right-s-line"></i>
              <span className="text-amber-400">Blog</span>
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-12 md:py-20 bg-gray-50 min-h-[60vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            
            {posts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {posts.map(post => {
                  const imageUrl = post.image_url || (post.image_path ? `/${post.image_path}` : 'https://images.unsplash.com/photo-1512428559083-a401c107f955?w=600&q=80');
                  const date = new Date(post.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <article key={post.id} className="bg-white rounded-2xl md:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full border border-gray-100">
                      <Link href={`/blog/${post.slug}`} className="relative block h-48 sm:h-64 overflow-hidden">
                        <img 
                          src={imageUrl} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-amber-500 text-[#060f1e] text-[10px] font-black uppercase px-3 py-1 rounded-full">
                            Article
                          </span>
                        </div>
                      </Link>
                      
                      <div className="p-6 md:p-8 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-4">
                          <i className="ri-calendar-line text-amber-500"></i>
                          {date}
                        </div>
                        
                        <h2 className="font-display font-black text-xl md:text-2xl text-[#060f1e] leading-tight mb-4 group-hover:text-amber-600 transition-colors">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h2>
                        
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                          {post.description}
                        </p>
                        
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-2 text-[#060f1e] font-black text-xs uppercase tracking-widest hover:text-amber-600 transition-colors"
                        >
                          Read Article <i className="ri-arrow-right-line"></i>
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 md:py-24 bg-white rounded-2xl md:rounded-[3rem] shadow-sm border border-gray-100">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                   <i className="ri-article-line text-4xl md:text-5xl"></i>
                </div>
                <h3 className="text-[#060f1e] font-black text-xl md:text-2xl mb-3">No articles yet</h3>
                <p className="text-gray-500 text-sm md:text-base max-w-sm mx-auto">We are currently preparing informative content for you. Please check back soon!</p>
              </div>
            )}

          </div>
        </section>

        {/* Subscribe Section */}
        <section className="py-12 md:py-20 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="font-display font-black text-2xl md:text-3xl text-[#060f1e] mb-4">Stay in the Loop</h2>
            <p className="text-gray-500 text-sm md:text-base mb-6 md:mb-8">Get the latest industry news and corporate updates delivered to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 outline-none focus:border-amber-500 transition-colors text-sm md:text-base"
              />
              <button className="bg-[#060f1e] text-white font-black px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl hover:bg-[#0f1f3d] transition-all shadow-lg text-sm md:text-base">
                Subscribe
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-bold">
              No spam, just quality updates. Unsubscribe anytime.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
