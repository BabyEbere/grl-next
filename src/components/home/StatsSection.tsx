interface StatsSectionProps {
  imgSrc: string;
}

export default function StatsSection({ imgSrc }: StatsSectionProps) {
  const stats = [
    { value: '500', suffix: '+', label: 'Machines Delivered' },
    { value: '12',  suffix: '+', label: 'Years of Excellence' },
    { value: '800', suffix: '+', label: 'Satisfied Clients' },
    { value: '4',   suffix: '',  label: 'Core Divisions' }
  ];

  return (
    <section className="py-16 bg-[#060f1e] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <img src={imgSrc} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i} className="reveal">
              <div className="font-display font-black text-5xl text-amber-400 mb-2">
                {s.value}{s.suffix}
              </div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
