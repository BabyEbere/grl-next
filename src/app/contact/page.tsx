import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContactForm from '@/components/contact/ContactForm';
import { getSettings } from '@/lib/db';

export const metadata = {
  title: 'Contact Us | Global Resources Limited',
  description: "Reach out to Global Resources Limited for quotes on machinery, automobiles, petroleum, and retail services. We respond within 24 hours.",
};

export default async function ContactPage() {
  const settings = await getSettings(['phone1', 'phone2', 'email', 'whatsapp', 'address']);
  
  const phone1 = settings.phone1 || '+234 902 438 4244';
  const phone2 = settings.phone2 || '0911 155 5552';
  const email  = settings.email  || 'info@globalresourceslimited.com';
  const whatsapp = settings.whatsapp || '2349024384244';

  return (
    <>
      <Header />

      <main>
        {/* Banner */}
        <section className="relative py-24 bg-[#060f1e] overflow-hidden">
          <img src="/assets/images/machinery.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-[#060f1e]/70"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <p className="text-amber-400 text-xs font-black uppercase tracking-widest mb-3">Reach Out</p>
            <h1 className="font-display font-black text-5xl text-white mb-4">Contact Us</h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">We respond within 24 hours. Tell us what you need and let's build a solution together.</p>
            <div className="flex items-center justify-center gap-2 mt-5 text-sm text-gray-400">
              <a href="/" className="hover:text-amber-400 transition-colors">Home</a>
              <i className="ri-arrow-right-s-line"></i>
              <span className="text-amber-400">Contact Us</span>
            </div>
          </div>
        </section>

        {/* Contact Area */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-5 gap-12">

              {/* LEFT: info cards */}
              <div className="lg:col-span-2 reveal space-y-4">
                <p className="text-amber-500 text-xs font-black uppercase tracking-widest">Get In Touch</p>
                <h2 className="font-display font-black text-4xl text-[#0f1f3d] leading-tight">We&apos;d Love to<br />Hear From You</h2>
                <p className="text-gray-500 text-sm leading-relaxed pb-4">
                  Whether you need a quote on machinery, want to discuss a bulk petroleum order, 
                  enquire about vehicles, or visit our mall — our team is ready to help.
                </p>

                {/* Contact cards */}
                <a href={`tel:${phone1.replace(/\s+/g, '')}`} className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-lg transition-shadow group lift">
                  <div className="w-12 h-12 bg-[#060f1e] group-hover:bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                    <i className="ri-phone-fill text-amber-400 group-hover:text-[#060f1e] text-lg transition-colors"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Phone – Line 1</p>
                    <p className="font-bold text-[#060f1e]">{phone1}</p>
                  </div>
                </a>

                <a href={`tel:${phone2.replace(/\s+/g, '')}`} className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-lg transition-shadow group lift">
                  <div className="w-12 h-12 bg-[#060f1e] group-hover:bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                    <i className="ri-phone-fill text-amber-400 group-hover:text-[#060f1e] text-lg transition-colors"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Phone – Line 2</p>
                    <p className="font-bold text-[#060f1e]">{phone2}</p>
                  </div>
                </a>

                <a href={`mailto:${email}`} className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-lg transition-shadow group lift">
                  <div className="w-12 h-12 bg-[#060f1e] group-hover:bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                    <i className="ri-mail-fill text-amber-400 group-hover:text-[#060f1e] text-lg transition-colors"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Email Us</p>
                    <p className="font-bold text-[#060f1e] text-sm break-all">{email}</p>
                  </div>
                </a>

                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener" className="flex items-center gap-4 bg-green-50 border border-green-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-lg transition-shadow lift">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="ri-whatsapp-line text-white text-xl"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">WhatsApp</p>
                    <p className="font-bold text-green-700">Chat with us instantly</p>
                  </div>
                </a>

                {/* Business hours card */}
                <div className="bg-[#060f1e] rounded-2xl p-5 text-white">
                  <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <i className="ri-time-line text-amber-400"></i> Business Hours
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-gray-300">
                      <span>Monday – Friday</span><span className="text-white font-semibold">8:00 AM – 6:00 PM</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Saturday</span><span className="text-white font-semibold">9:00 AM – 4:00 PM</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Sunday</span><span className="text-gray-500">Closed</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT: form */}
              <div className="lg:col-span-3 reveal delay-200">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
                   <ContactForm />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Call strip */}
        <section className="py-12 bg-amber-500">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <p className="text-[#060f1e] text-xs font-black uppercase tracking-widest mb-1">Prefer to call directly?</p>
              <p className="font-display font-black text-2xl text-[#060f1e]">{phone1}  ·  {phone2}</p>
            </div>
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener"
               className="bg-green-600 hover:bg-green-500 text-white font-black px-6 py-3 rounded-xl flex items-center gap-2 transition-colors flex-shrink-0">
              <i className="ri-whatsapp-line text-lg"></i> WhatsApp Now
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
