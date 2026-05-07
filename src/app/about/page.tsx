import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StatsSection from '@/components/home/StatsSection';

export const metadata = {
  title: 'About Us | Global Resources Limited',
  description: "Learn about Global Resources Limited — Nigeria's trusted conglomerate for industrial machinery, automobiles, petroleum, and retail.",
};

export default function AboutPage() {
  return (
    <>
      <Header />

      <main>
        {/* Page banner */}
        <section className="relative py-24 bg-[#060f1e] overflow-hidden">
          <img src="/assets/images/machinery.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060f1e] to-[#060f1e]/60"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <p className="text-amber-400 text-xs font-black uppercase tracking-widest mb-3">Company Overview</p>
            <h1 className="font-display font-black text-5xl text-white mb-4">About Us</h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">Learn who we are, what drives us and why Global Resources Limited is Nigeria&apos;s most trusted conglomerate.</p>
            <div className="flex items-center justify-center gap-2 mt-5 text-sm text-gray-400">
              <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
              <i className="ri-arrow-right-s-line"></i>
              <span className="text-amber-400">About Us</span>
            </div>
          </div>
        </section>

        {/* Who we are */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              <div className="reveal">
                <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-2">Our Story</p>
                <h2 className="font-display font-black text-4xl md:text-5xl text-[#0f1f3d] mb-6 leading-tight">Who Is Global<br />Resources Limited?</h2>
                <p className="text-gray-500 leading-relaxed mb-5">
                  Global Resources Limited is a Nigerian conglomerate with deep roots in industrial supply, 
                  automotive trade, petroleum distribution and retail. We were founded on the belief that 
                  Nigerian businesses deserve access to world-class products without compromise.
                </p>
                <p className="text-gray-500 leading-relaxed mb-5">
                  Over more than a decade we have grown from a focused machinery supplier to a multi-sector 
                  powerhouse — with divisions covering industrial machinery, automobiles, petroleum products 
                  and a thriving shopping mall experience.
                </p>
                <p className="text-gray-500 leading-relaxed">
                  Our clients range from construction firms and oil companies to government agencies, 
                  logistics operators and private individuals. Each receives the same unwavering commitment 
                  to service, timeliness and product integrity.
                </p>
              </div>
              <div className="reveal delay-200 relative">
                <img src="/assets/images/bulldozer.png" alt="Heavy machinery operations"
                     className="rounded-3xl w-full h-[440px] object-cover shadow-2xl" />
                <div className="absolute -bottom-5 -right-5 bg-amber-500 rounded-2xl p-6 shadow-xl text-center">
                  <div className="font-display font-black text-4xl text-[#0f1f3d] mb-1">12+</div>
                  <div className="text-[#0f1f3d] text-xs font-bold uppercase tracking-wide">Years Active</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission / Vision / Values */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14 reveal">
              <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-2">Our Pillars</p>
              <h2 className="font-display font-black text-4xl text-[#0f1f3d]">Mission, Vision & Values</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">

              <div className="bg-white rounded-3xl p-8 shadow-md reveal lift">
                <div className="w-14 h-14 bg-[#0f1f3d] rounded-2xl flex items-center justify-center mb-5">
                  <i className="ri-focus-3-line text-amber-400 text-2xl"></i>
                </div>
                <h3 className="font-display font-bold text-xl text-[#0f1f3d] mb-3">Our Mission</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  To bridge the gap between global industrial quality and Nigerian demand — delivering premium 
                  machinery, vehicles, petroleum and retail products with speed, integrity and unmatched service.
                </p>
              </div>

              <div className="bg-[#0f1f3d] rounded-3xl p-8 shadow-md reveal lift delay-100">
                <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-5">
                  <i className="ri-eye-line text-amber-400 text-2xl"></i>
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-3">Our Vision</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  To be the most trusted and comprehensive multi-sector conglomerate in West Africa, setting 
                  the gold standard for product quality and client relationships in every division we operate.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-md reveal lift delay-200">
                <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center mb-5">
                  <i className="ri-heart-line text-[#060f1e] text-2xl"></i>
                </div>
                <h3 className="font-display font-bold text-xl text-[#0f1f3d] mb-3">Our Values</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  {['Integrity in every transaction', 'Quality without compromise', 'Client-first service culture', 'Timely and reliable delivery', 'Innovation across all sectors'].map((v, i) => (
                    <li key={i} className="flex items-center gap-2">
                       <i className="ri-check-line text-amber-500 font-bold"></i>{v}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* Stats dark band (Re-using component) */}
        <StatsSection imgSrc="/assets/images/crane.png" />

        {/* CTA */}
        <section className="py-20 bg-white text-center">
          <div className="max-w-2xl mx-auto px-6 reveal">
            <h2 className="font-display font-black text-4xl text-[#0f1f3d] mb-4">Ready to Work With Us?</h2>
            <p className="text-gray-500 mb-8">Get in touch — our team responds with a tailored solution within 24 hours.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="bg-amber-500 hover:bg-amber-400 text-[#0f1f3d] font-black px-8 py-4 rounded-xl transition-colors flex items-center gap-2">
                Get a Quote <i className="ri-arrow-right-line"></i>
              </Link>
              <Link href="/products" className="border-2 border-[#0f1f3d] text-[#0f1f3d] hover:bg-[#0f1f3d] hover:text-white font-bold px-8 py-4 rounded-xl transition-all">
                View Products
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
