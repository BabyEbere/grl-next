import Link from 'next/link';

interface MallCTAProps {
  imgSrc: string;
}

export default function MallCTA({ imgSrc }: MallCTAProps) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden reveal">
          <img 
            src={imgSrc} 
            alt="Shopping Mall" 
            className="w-full h-[400px] object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-indigo-900/80 to-transparent"></div>
          <div className="absolute inset-0 flex items-center">
            <div className="px-10 md:px-16 max-w-xl">
              <p className="text-purple-300 text-xs font-black uppercase tracking-widest mb-3">Retail Division</p>
              <h2 className="font-display font-black text-3xl md:text-5xl text-white mb-4 leading-tight">Visit Our Shopping Mall</h2>
              <p className="text-gray-200 text-sm leading-relaxed mb-7">
                Fashion, food, electronics, home décor, beauty and lifestyle — all curated under one vibrant roof 
                for the modern Nigerian shopper.
              </p>
              <Link 
                href="/products/shopping" 
                className="bg-white text-purple-900 font-black px-7 py-3.5 rounded-xl hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                <i className="ri-store-2-line"></i> Explore the Mall
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
