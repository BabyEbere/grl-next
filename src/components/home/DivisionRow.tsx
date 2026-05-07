import Link from 'next/link';

interface DivisionRowProps {
  title: string;
  description: string;
  imgSrc: string;
  icon: string;
  colorClass: string;
  tags: string[];
  linkHref: string;
  ctaText: string;
  reverse?: boolean;
  delay?: string;
}

export default function DivisionRow({
  title, description, imgSrc, icon, colorClass, tags, linkHref, ctaText, reverse, delay = ''
}: DivisionRowProps) {
  return (
    <div className={`grid lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden shadow-xl reveal ${delay}`}>
      <div className={`lg:col-span-3 relative h-80 lg:h-auto ${reverse ? 'order-1 lg:order-2' : ''}`}>
        <img 
          src={imgSrc} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent to-[#0f1f3d]/60 ${reverse ? 'lg:bg-gradient-to-l lg:from-transparent lg:to-orange-900/40' : 'lg:bg-gradient-to-l lg:from-transparent lg:to-[#0f1f3d]/60'}`}></div>
      </div>
      <div className={`lg:col-span-2 ${colorClass} flex flex-col justify-center p-10 ${reverse ? 'order-2 lg:order-1' : ''}`}>
        <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-5">
          <i className={`${icon} text-amber-400 text-2xl`}></i>
        </div>
        <h3 className="font-display font-black text-3xl text-white mb-3">{title}</h3>
        <p className="text-gray-200 text-sm leading-relaxed mb-6">{description}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((t, i) => (
            <span key={i} className="bg-white/10 text-gray-200 text-xs px-3 py-1.5 rounded-full">{t}</span>
          ))}
        </div>
        <Link 
          href={linkHref} 
          className="bg-amber-500 hover:bg-amber-400 text-[#0f1f3d] font-black px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-2 self-start text-sm"
        >
          {ctaText} <i className="ri-arrow-right-line"></i>
        </Link>
      </div>
    </div>
  );
}
