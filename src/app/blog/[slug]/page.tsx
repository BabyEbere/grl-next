import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SITE_URL } from '@/lib/config';
import BlogSchema from '@/components/blog/BlogSchema';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image_url?: string;
  image_path?: string;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const posts = await query<BlogPost>('SELECT * FROM blog_posts WHERE slug = ? AND is_active = 1 LIMIT 1', [slug]);
  const post = posts[0];

  if (!post) {
     return { title: 'Post Not Found' };
  }

  return {
    title: post.meta_title || `${post.title} | Blog | Global Resources Limited`,
    description: post.meta_description || post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.image_url || (post.image_path ? `${SITE_URL}/${post.image_path}` : `${SITE_URL}/assets/images/logo.jpeg`)],
    }
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const posts = await query<BlogPost>('SELECT * FROM blog_posts WHERE slug = ? AND is_active = 1 LIMIT 1', [slug]);
  const post = posts[0];

  if (!post) {
    notFound();
  }

  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const imageUrl = post.image_url || (post.image_path ? `/${post.image_path}` : null);

  // Fetch recent posts for interlinking
  const recentPosts = await query<BlogPost>(
    'SELECT title, slug FROM blog_posts WHERE is_active=1 AND id != ? ORDER BY created_at DESC LIMIT 5',
    [post.id]
  );

  return (
    <>
      <Header />
      <BlogSchema post={post} />

      <main className="bg-white">
        {/* Article Header */}
        <section className="pt-32 pb-16 bg-gray-50 border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-widest mb-6 hover:translate-x-[-4px] transition-transform"
            >
              <i className="ri-arrow-left-line"></i> Back to Blog
            </Link>
            
            <h1 className="font-display font-black text-4xl md:text-5xl text-[#060f1e] leading-tight mb-8">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 border-t border-gray-200 pt-8">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-[#060f1e] font-black text-[10px]">GRL</div>
                  <span className="font-bold text-[#060f1e]">By Global Resources Limited</span>
               </div>
               <div className="flex items-center gap-2">
                  <i className="ri-calendar-line text-amber-500"></i>
                  {date}
               </div>
               <div className="flex items-center gap-2">
                  <i className="ri-time-line text-amber-500"></i>
                  5 min read
               </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16">
            
            <div className="lg:col-span-8">
              {imageUrl && (
                <div className="mb-12 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200">
                  <img src={imageUrl} alt={post.title} className="w-full h-auto" />
                </div>
              )}

              <div 
                className="prose prose-lg prose-amber max-w-none 
                  prose-headings:font-display prose-headings:font-black prose-headings:text-[#060f1e]
                  prose-p:text-gray-600 prose-p:leading-relaxed
                  prose-img:rounded-3xl prose-table:border prose-table:rounded-xl"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="mt-16 pt-10 border-t border-gray-100 flex flex-wrap items-center justify-between gap-6">
                 <div className="flex items-center gap-3">
                    <span className="text-xs font-black uppercase text-gray-400">Share:</span>
                    <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:bg-[#1877F2] hover:text-white transition-all flex items-center justify-center">
                       <i className="ri-facebook-fill"></i>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:bg-[#1DA1F2] hover:text-white transition-all flex items-center justify-center">
                       <i className="ri-twitter-fill"></i>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:bg-[#0077B5] hover:text-white transition-all flex items-center justify-center">
                       <i className="ri-linkedin-fill"></i>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center">
                       <i className="ri-link"></i>
                    </button>
                 </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-12">
               
               <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100">
                  <h3 className="font-display font-black text-xl text-[#060f1e] mb-6">Recent Articles</h3>
                  <div className="space-y-6">
                    {recentPosts.map(rp => (
                      <Link 
                        key={rp.slug} 
                        href={`/blog/${rp.slug}`}
                        className="group flex flex-col"
                      >
                         <h4 className="text-[#060f1e] font-bold text-sm leading-tight group-hover:text-amber-500 transition-colors">
                           {rp.title}
                         </h4>
                         <div className="h-[2px] w-0 group-hover:w-full bg-amber-500 mt-2 transition-all duration-300"></div>
                      </Link>
                    ))}
                  </div>
                  <Link 
                    href="/blog" 
                    className="mt-8 inline-block text-xs font-black uppercase tracking-widest text-amber-500 hover:text-[#060f1e] transition-colors"
                  >
                    View All Posts →
                  </Link>
               </div>

               <div className="bg-[#060f1e] rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
                  <h3 className="font-display font-black text-2xl mb-4 relative z-10">Need Assistance?</h3>
                  <p className="text-gray-400 text-sm mb-8 relative z-10">Contact our experts for inquiries about our services and products.</p>
                  <Link 
                    href="/contact" 
                    className="block bg-amber-500 hover:bg-white text-[#060f1e] font-black text-center py-4 rounded-2xl transition-all shadow-lg"
                  >
                    Contact Us Now
                  </Link>
               </div>

            </aside>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
