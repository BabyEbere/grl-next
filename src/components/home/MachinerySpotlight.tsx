import Link from 'next/link';

interface MachinerySpotlightProps {
  imgSrc: string;
}

export default function MachinerySpotlight({ imgSrc }: MachinerySpotlightProps) {
  const equipment = [
    'Excavators','Cranes','Bulldozers','Dump Trucks',
    'Forklifts','Road Rollers','Graders','Generators'
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Image side */}
          <div className="reveal relative">
            <img 
              src={imgSrc} 
              alt="Heavy Excavator"
              className="rounded-3xl w-full h-[480px] object-cover shadow-2xl"
            />
            {/* badge */}
            <div className="absolute -bottom-5 -right-5 bg-amber-500 rounded-2xl p-5 shadow-xl text-center">
              <div className="font-display font-black text-3xl text-[#0f1f3d] counter">500+</div>
              <div className="text-[#0f1f3d] text-xs font-bold">Machines Delivered</div>
            </div>
          </div>

          {/* Text side */}
          <div className="reveal delay-200">
            <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-2">Machinery Division</p>
            <h2 className="font-display font-black text-4xl md:text-5xl text-[#0f1f3d] leading-tight mb-5">
              World-Class Equipment<br />Delivered to Nigeria
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              We source, supply and support the full range of construction and industrial machinery 
              from the world's leading manufacturers. Whether you need one excavator or a full fleet 
              — we deliver on time and within budget.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {equipment.map((m, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <i className="ri-check-line text-amber-500 font-bold flex-shrink-0"></i>{m}
                </div>
              ))}
            </div>

            <Link 
              href="/products/excavators" 
              className="bg-[#0f1f3d] hover:bg-[#1a3260] text-white font-bold px-7 py-3.5 rounded-xl transition-colors inline-flex items-center gap-2"
            >
              Browse Machinery <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
