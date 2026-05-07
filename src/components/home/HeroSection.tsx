import Link from 'next/link';

interface HeroSectionProps {
  imgSrc: string;
}

export default function HeroSection({ imgSrc }: HeroSectionProps) {
  const stats = [
    { value: '500+', label: 'Machines Delivered' },
    { value: '12+', label: 'Years Active' },
    { value: '800+', label: 'Happy Clients' }
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#060f1e]">
      {/* Background imagery */}
      <img 
        src={imgSrc} 
        alt="Global Resources Heavy Machinery"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#060f1e] via-[#060f1e]/80 to-transparent"></div>
      {/* Amber accent glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="fade-up inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Nigeria's Premier Conglomerate
          </div>

          <h1 className="fade-up d1 font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] mb-6">
            Powering<br />
            <span className="text-amber-400">Industry.</span><br />
            Driving Growth.
          </h1>

          <p className="fade-up d2 text-gray-300 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
            Global Resources Limited — your trusted Nigerian conglomerate for 
            <strong className="text-white"> heavy machinery</strong>, 
            <strong className="text-white"> premium automobiles</strong>, 
            <strong className="text-white"> petroleum products</strong> and a vibrant 
            <strong className="text-white"> shopping mall</strong>.
          </p>

          <div className="fade-up d3 flex flex-wrap gap-4 mb-12">
            <Link href="/products" className="bg-amber-500 hover:bg-amber-400 text-[#0f1f3d] font-black px-8 py-4 rounded-xl transition-colors flex items-center gap-2 text-base shadow-lg shadow-amber-500/30">
              Explore Products <i className="ri-arrow-right-line"></i>
            </Link>
            <Link href="/contact" className="border-2 border-white/30 hover:border-amber-400 text-white hover:text-amber-400 font-bold px-8 py-4 rounded-xl transition-all flex items-center gap-2 text-base">
              <i className="ri-mail-send-line"></i> Get a Quote
            </Link>
          </div>

          {/* Quick stats inline */}
          <div className="fade-up d4 flex flex-wrap gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-display font-black text-2xl text-amber-400">{s.value}</div>
                <div className="text-gray-400 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center gap-1 text-xs">
        <span>Scroll</span>
        <i className="ri-arrow-down-line animate-bounce"></i>
      </div>
    </section>
  );
}
