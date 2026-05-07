'use client';

import Link        from 'next/link';
import Image       from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname }         from 'next/navigation';

const MACHINERY = [
  { slug:'excavators',  label:'Excavators & Loaders',  icon:'ri-building-2-line' },
  { slug:'cranes',      label:'Cranes & Lifting',       icon:'ri-layout-top-line' },
  { slug:'bulldozers',  label:'Bulldozers & Graders',   icon:'ri-hammer-line'     },
  { slug:'trucks',      label:'Industrial Trucks',       icon:'ri-truck-line'      },
  { slug:'forklifts',   label:'Forklifts',               icon:'ri-stack-line'      },
];
const DIVISIONS = [
  { slug:'automobiles', label:'Automobiles & Cars',     icon:'ri-car-line'        },
  { slug:'petroleum',   label:'Petroleum Products',      icon:'ri-oil-line'        },
  { slug:'shopping',    label:'Shopping Mall',           icon:'ri-store-2-line'    },
];

export default function Header() {
  const pathname    = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // close mobile menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  const isProducts = pathname.startsWith('/products') || pathname.startsWith('/product');

  return (
    <>
      {/* ── Top bar ── */}
      <div className="bg-[#060f1e] text-[10px] md:text-xs text-gray-400 py-2">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-6">
            <a href="tel:+2349024384244" className="flex items-center gap-1 hover:text-amber-400 transition-colors">
              <i className="ri-phone-fill text-amber-500" /> <span className="hidden sm:inline">+234 902 438 4244</span><span className="sm:hidden">9024384244</span>
            </a>
            <a href="tel:09111555552" className="flex items-center gap-1 hover:text-amber-400 transition-colors">
              <i className="ri-phone-fill text-amber-500" /> <span className="hidden sm:inline">0911 155 5552</span><span className="sm:hidden">09111555552</span>
            </a>
            <a href="mailto:info@globalresourceslimited.com" className="hidden lg:flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <i className="ri-mail-fill text-amber-500" /> info@globalresourceslimited.com
            </a>
          </div>
          <Link href="/contact" className="bg-amber-500 hover:bg-amber-400 text-[#0f1f3d] font-bold px-3 md:px-4 py-1 rounded text-[10px] md:text-xs transition-colors">
            Quote
          </Link>
        </div>
      </div>

      {/* ── Navbar ── */}
      <nav className={`sticky top-0 z-50 bg-white transition-shadow ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-[72px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/assets/images/logo.jpeg"
                alt="Global Resources Limited"
                width={48} height={48}
                className="rounded object-contain"
              />
              <div>
                <div className="font-display font-black text-[#0f1f3d] leading-tight text-sm">Global Resources</div>
                <div className="text-amber-500 text-[10px] font-bold tracking-widest uppercase">Limited</div>
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-1">
              <NavLink href="/"       active={pathname === '/'}>Home</NavLink>

              {/* Products mega-dropdown */}
              <div className="relative group">
                <button className={`px-4 py-2 text-sm font-semibold flex items-center gap-1 transition-colors ${isProducts ? 'text-[#0f1f3d] border-b-2 border-amber-500' : 'text-gray-600 hover:text-[#0f1f3d]'}`}>
                  Products <i className="ri-arrow-down-s-line group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="w-[620px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-2 divide-x divide-gray-100">
                      <div className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-3">Machinery & Equipment</p>
                        {MACHINERY.map(d => (
                          <Link key={d.slug} href={`/products/${d.slug}`}
                            className="flex items-center gap-2.5 text-sm text-gray-600 px-3 py-2 rounded-xl hover:bg-[#0f1f3d] hover:text-white transition-all group">
                            <i className={`${d.icon} text-amber-500 group-hover:text-amber-400`} />
                            {d.label}
                          </Link>
                        ))}
                      </div>
                      <div className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-3">Other Divisions</p>
                        {DIVISIONS.map(d => (
                          <Link key={d.slug} href={`/products/${d.slug}`}
                            className="flex items-center gap-2.5 text-sm text-gray-600 px-3 py-2 rounded-xl hover:bg-[#0f1f3d] hover:text-white transition-all group">
                            <i className={`${d.icon} text-amber-500 group-hover:text-amber-400`} />
                            {d.label}
                          </Link>
                        ))}
                        <div className="mt-4 bg-[#0f1f3d] rounded-xl p-3">
                          <p className="text-white text-xs font-semibold">Need something specific?</p>
                          <Link href="/contact" className="text-amber-400 text-xs hover:underline">Contact our team →</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <NavLink href="/about"   active={pathname === '/about'}>About Us</NavLink>
              <NavLink href="/blog"    active={pathname === '/blog'}>Blog</NavLink>
              <NavLink href="/contact" active={pathname === '/contact'}>Contact</NavLink>
              <Link href="/contact" className="ml-3 bg-amber-500 hover:bg-amber-400 text-[#0f1f3d] font-bold text-sm px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2">
                Get a Quote <i className="ri-arrow-right-line" />
              </Link>
            </div>

            {/* Hamburger */}
            <button onClick={() => setOpen(o => !o)} className="lg:hidden p-2 flex flex-col gap-1.5" aria-label="Menu">
              <span className={`w-6 h-0.5 bg-gray-800 rounded transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-6 h-0.5 bg-gray-800 rounded transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`w-6 h-0.5 bg-gray-800 rounded transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-6 pb-6">
            <div className="pt-4 space-y-1">
              <MobLink href="/">Home</MobLink>
              <MobLink href="/products">Products</MobLink>
              <MobLink href="/products/excavators" sub>↳ Machinery & Equipment</MobLink>
              <MobLink href="/products/automobiles" sub>↳ Automobiles & Cars</MobLink>
              <MobLink href="/products/petroleum"   sub>↳ Petroleum Products</MobLink>
              <MobLink href="/products/shopping"    sub>↳ Shopping Mall</MobLink>
              <MobLink href="/about">About Us</MobLink>
              <MobLink href="/blog">Blog</MobLink>
              <MobLink href="/contact">Contact</MobLink>
              <Link href="/contact" className="block mt-3 bg-amber-500 text-[#0f1f3d] font-bold text-sm text-center px-5 py-3 rounded-xl">
                Get a Quote
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href}
      className={`px-4 py-2 text-sm font-semibold transition-colors ${active ? 'text-[#0f1f3d] border-b-2 border-amber-500' : 'text-gray-600 hover:text-[#0f1f3d]'}`}>
      {children}
    </Link>
  );
}

function MobLink({ href, sub, children }: { href: string; sub?: boolean; children: React.ReactNode }) {
  return (
    <Link href={href}
      className={`block py-${sub ? '2' : '3'} px-${sub ? '7' : '4'} text-sm ${sub ? 'text-gray-500' : 'font-semibold text-gray-700'} hover:text-[#0f1f3d] ${sub ? '' : 'rounded-xl hover:bg-gray-50'}`}>
      {children}
    </Link>
  );
}
