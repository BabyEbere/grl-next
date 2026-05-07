import Link from 'next/link';
import { getSetting } from '@/lib/db';

export default async function Footer() {
  const phone1    = await getSetting('phone1',    '+234 902 438 4244');
  const phone2    = await getSetting('phone2',    '0911 155 5552');
  const email     = await getSetting('email',     'info@globalresourceslimited.com');
  const whatsapp  = await getSetting('whatsapp',  '2349024384244');
  const address   = await getSetting('address',   'Lagos, Nigeria');
  const facebook  = await getSetting('facebook_url',  '');
  const instagram = await getSetting('instagram_url', '');
  const twitter   = await getSetting('twitter_url',   '');
  const linkedin  = await getSetting('linkedin_url',  '');

  return (
    <footer className="bg-[#060f1e] text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <div className="font-display font-black text-white text-xl mb-1">Global Resources</div>
          <div className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-4">Limited</div>
          <p className="text-sm leading-relaxed mb-5">
            Nigeria's trusted conglomerate for industrial machinery, automobiles, petroleum products and retail.
          </p>
          <div className="flex gap-3">
            {facebook && facebook !== '#' && <SocialLink href={facebook}  icon="ri-facebook-fill" />}
            {instagram && instagram !== '#' && <SocialLink href={instagram} icon="ri-instagram-line" />}
            {twitter && twitter !== '#' && <SocialLink href={twitter}   icon="ri-twitter-x-line" />}
            {linkedin && linkedin !== '#' && <SocialLink href={linkedin}  icon="ri-linkedin-box-fill" />}
            <SocialLink href={`https://wa.me/${whatsapp}`} icon="ri-whatsapp-line" />
          </div>
        </div>

        {/* Products */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-widest">Products</h4>
          <ul className="space-y-2 text-sm">
            {[
              ['Excavators & Loaders','/products/excavators'],
              ['Cranes & Lifting',    '/products/cranes'],
              ['Automobiles',         '/products/automobiles'],
              ['Petroleum Products',  '/products/petroleum'],
              ['Shopping Mall',       '/products/shopping'],
            ].map(([label,href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-amber-400 transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-widest">Company</h4>
          <ul className="space-y-2 text-sm">
            {[['Home','/'],['About Us','/about'],['Products','/products'],['Blog','/blog'],['Contact','/contact']].map(([l,h]) => (
              <li key={h}><Link href={h} className="hover:text-amber-400 transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-widest">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><i className="ri-phone-fill text-amber-500" /><a href={`tel:${phone1}`} className="hover:text-amber-400 transition-colors">{phone1}</a></li>
            <li className="flex items-center gap-2"><i className="ri-phone-fill text-amber-500" /><a href={`tel:${phone2}`} className="hover:text-amber-400 transition-colors">{phone2}</a></li>
            <li className="flex items-center gap-2"><i className="ri-mail-fill text-amber-500" /><a href={`mailto:${email}`} className="hover:text-amber-400 transition-colors">{email}</a></li>
            <li className="flex items-start gap-2"><i className="ri-map-pin-fill text-amber-500 mt-0.5" /><span>{address}</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5 text-xs text-gray-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>&copy; {new Date().getFullYear()} Global Resources Limited. All rights reserved.</span>

          {/* PookieTech watermark */}
          <a href="https://pookietech.com.ng" target="_blank" rel="noopener"
             className="group flex items-center gap-1 opacity-50 hover:opacity-90 transition-opacity">
            <span className="text-gray-500 text-[11px] tracking-wide">Powered by</span>
            <span className="text-gray-400 group-hover:text-amber-500 transition-colors text-[11px] font-semibold tracking-tight font-mono">
              PookieTech
            </span>
          </a>

          <span>Delivering Excellence Across Every Division</span>
        </div>
      </div>

      {/* WhatsApp float */}
      <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener"
         className="fixed bottom-6 right-6 z-50 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:bg-green-400 transition-all hover:scale-110">
        <i className="ri-whatsapp-line text-2xl" />
      </a>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: string }) {
  return (
    <a href={href} target="_blank" rel="noopener"
       className="w-9 h-9 bg-white/5 hover:bg-amber-500 hover:text-[#0f1f3d] text-gray-400 rounded-xl flex items-center justify-center transition-all">
      <i className={`${icon} text-sm`} />
    </a>
  );
}
