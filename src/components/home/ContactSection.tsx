interface ContactSectionProps {
  phone1: string;
  phone2: string;
  whatsapp: string;
}

export default function ContactSection({ phone1, phone2, whatsapp }: ContactSectionProps) {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-start">

          {/* Left info */}
          <div className="reveal">
            <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-2">Contact Us</p>
            <h2 className="font-display font-black text-4xl text-[#0f1f3d] mb-5">Ready to Place an<br />Order or Get a Quote?</h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              We don't list prices because every order is unique. 
              Contact us and our team responds with a custom quote within 24 hours.
            </p>
            <div className="space-y-4">
              <a href={`tel:${phone1.replace(/\s+/g, '')}`} className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-[#0f1f3d] rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="ri-phone-fill text-amber-400 text-lg"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Line 1</p>
                  <p className="font-bold text-[#0f1f3d]">{phone1}</p>
                </div>
              </a>
              <a href={`tel:${phone2.replace(/\s+/g, '')}`} className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-[#0f1f3d] rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="ri-phone-fill text-amber-400 text-lg"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Line 2</p>
                  <p className="font-bold text-[#0f1f3d]">{phone2}</p>
                </div>
              </a>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener" className="flex items-center gap-4 bg-green-50 border border-green-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="ri-whatsapp-line text-white text-lg"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400">WhatsApp</p>
                  <p className="font-bold text-green-700">Chat with us instantly</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right form */}
          <div className="reveal delay-200 bg-white rounded-3xl shadow-xl p-8">
            <h3 className="font-display font-bold text-2xl text-[#0f1f3d] mb-6">Quick Enquiry</h3>
            <form id="contact-form" method="POST" className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="text" name="name" placeholder="Full Name *" required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 transition-colors outline-none" />
                <input type="tel" name="phone" placeholder="Phone Number *" required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 transition-colors outline-none" />
              </div>
              <input type="email" name="email" placeholder="Email Address *" required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 transition-colors outline-none" />
              <select name="product" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 focus:border-amber-500 transition-colors outline-none bg-white">
                <option value="">-- Product Category --</option>
                <option>Industrial Machinery</option>
                <option>Automobiles / Cars</option>
                <option>Petroleum Products (AGO/Diesel)</option>
                <option>Shopping Mall</option>
                <option>Other</option>
              </select>
              <textarea name="message" rows={4} placeholder="Describe what you need..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 transition-colors outline-none resize-none"></textarea>
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-[#0f1f3d] font-black py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-base shadow-lg shadow-amber-500/30">
                <i className="ri-send-plane-line"></i> Send Enquiry
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
