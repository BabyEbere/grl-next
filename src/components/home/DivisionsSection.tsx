import Link from 'next/link';
import { Division } from '@/lib/types';

interface DivisionsSectionProps {
  heading: string;
  subheading: string;
  divisions: Division[];
}

export default function DivisionsSection({ heading, subheading, divisions }: DivisionsSectionProps) {
  const delays = ['', 'delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500'];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-2">What We Do</p>
          <h2 className="font-display font-black text-4xl md:text-5xl text-[#0f1f3d] leading-tight">
            {heading}
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">{subheading}</p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {divisions.map((d, i) => {
            const imgSrc = d.image_path || d.image_url;
            const delay = delays[i] || '';
            const href = d.link_href || '#';

            return (
              <Link 
                key={d.id} 
                href={href} 
                className={`lift group rounded-2xl overflow-hidden bg-white shadow-md flex flex-col reveal ${delay}`}
              >
                <div className="relative h-52 overflow-hidden">
                  {imgSrc ? (
                    <img 
                      src={imgSrc.startsWith('http') ? imgSrc : `/${imgSrc}`} 
                      alt={d.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#0f1f3d] flex items-center justify-center">
                      <i className={`${d.icon} text-5xl text-amber-500 opacity-40`}></i>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060f1e]/80 to-transparent"></div>
                  {d.badge_text && (
                    <span className="absolute bottom-3 left-4 bg-amber-500 text-[#0f1f3d] text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                      {d.badge_text}
                    </span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className={`w-10 h-10 ${d.icon_bg} rounded-xl flex items-center justify-center mb-3`}>
                    <i className={`${d.icon} ${d.icon_color} text-xl`}></i>
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#0f1f3d] mb-2">{d.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{d.description}</p>
                  <span className="mt-4 text-amber-500 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    {d.cta_text} <i className="ri-arrow-right-line"></i>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
