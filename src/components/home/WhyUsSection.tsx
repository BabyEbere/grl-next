export default function WhyUsSection() {
  const cards = [
    {
      icon: 'ri-shield-check-line',
      bg: 'bg-amber-500',
      title: 'Zero-Compromise Quality',
      desc: 'Every product passes rigorous inspection. What we sell is what you get — no surprises.'
    },
    {
      icon: 'ri-customer-service-2-line',
      bg: 'bg-blue-600',
      title: '24/7 Support',
      desc: "Our team is available round the clock. One call and we're on it for you, anytime."
    },
    {
      icon: 'ri-global-line',
      bg: 'bg-green-600',
      title: 'Global Sourcing',
      desc: 'We source from world-leading manufacturers so you always get international standards locally.'
    },
    {
      icon: 'ri-handshake-line',
      bg: 'bg-purple-600',
      title: 'Transparent Process',
      desc: 'No hidden charges, no inflated prices. Clear quotes, honest timelines, reliable delivery.'
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14 reveal">
          <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-2">Why Choose Us</p>
          <h2 className="font-display font-black text-4xl md:text-5xl text-[#0f1f3d]">Built on Trust.<br />Driven by Quality.</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <div 
              key={i} 
              className="bg-white rounded-2xl p-6 shadow-md reveal lift" 
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center mb-5`}>
                <i className={`${c.icon} text-white text-2xl`}></i>
              </div>
              <h3 className="font-display font-bold text-lg text-[#0f1f3d] mb-2">{c.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
