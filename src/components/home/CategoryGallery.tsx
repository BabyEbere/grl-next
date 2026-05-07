import Link from 'next/link';

interface GalleryCardProps {
  title: string;
  subtitle: string;
  imgSrc: string;
  href: string;
  delay?: string;
}

function GalleryCard({ title, subtitle, imgSrc, href, delay = '' }: GalleryCardProps) {
  return (
    <Link href={href} className={`lift group rounded-3xl overflow-hidden relative h-72 reveal ${delay}`}>
      <img 
        src={imgSrc} 
        alt={title} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060f1e] via-[#060f1e]/40 to-transparent"></div>
      <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
        <div>
          <h3 className="font-display font-black text-2xl text-white mb-1">{title}</h3>
          <p className="text-gray-300 text-sm">{subtitle}</p>
        </div>
        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <i className="ri-arrow-right-line text-[#0f1f3d] font-bold"></i>
        </div>
      </div>
    </Link>
  );
}

interface CategoryGalleryProps {
  imgBulldozer: string;
  imgCrane: string;
}

export default function CategoryGallery({ imgBulldozer, imgCrane }: CategoryGalleryProps) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14 reveal">
          <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-2">More Machinery</p>
          <h2 className="font-display font-black text-4xl text-[#0f1f3d]">Heavy Equipment Gallery</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <GalleryCard 
            title="Bulldozers & Graders"
            subtitle="Land clearing, earthmoving & road prep"
            imgSrc={imgBulldozer}
            href="/products/bulldozers"
          />
          <GalleryCard 
            title="Cranes & Lifting"
            subtitle="Mobile, tower & crawler cranes"
            imgSrc={imgCrane}
            href="/products/cranes"
            delay="delay-100"
          />
        </div>
      </div>
    </section>
  );
}
