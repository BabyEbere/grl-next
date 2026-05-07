'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const MENU_ITEMS = [
  { icon: 'ri-dashboard-line',     label: 'Dashboard',   href: '/grl-ops-x7/dashboard', perm: 'dashboard' },
  { icon: 'ri-product-hunt-line',  label: 'Products',    href: '/grl-ops-x7/products',  perm: 'products'  },
  { icon: 'ri-apps-line',          label: 'Categories',  href: '/grl-ops-x7/categories',perm: 'categories'},
  { icon: 'ri-layout-grid-line',   label: 'Divisions',   href: '/grl-ops-x7/divisions', perm: 'divisions' },
  { icon: 'ri-article-line',       label: 'Blog',        href: '/grl-ops-x7/blog',      perm: 'blog'      },
  { icon: 'ri-chat-voice-line',    label: 'Customer Leads',href: '/grl-ops-x7/leads',     perm: 'leads'     },
  { icon: 'ri-inbox-archive-line', label: 'Webmail Inbox', href: '/grl-ops-x7/inbox',     perm: 'inbox'     },
  { icon: 'ri-team-line',          label: 'Staff Access',href: '/grl-ops-x7/staff',     perm: 'admin'     }, 
  { icon: 'ri-mail-settings-line', label: 'Email Setup', href: '/grl-ops-x7/settings/email', perm: 'settings' },
  { icon: 'ri-settings-4-line',    label: 'Settings',    href: '/grl-ops-x7/settings',  perm: 'settings'  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('grl_admin_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const hasPerm = (item: any) => {
    // 1. Initial Load or missing data: show dashboard at minimum
    if (!user || !user.username) return item.perm === 'dashboard';
    
    // 2. Primary Owner: check by username or explicit role
    const isAdmin = user.role === 'admin' || user.username === 'grladmin';
    if (isAdmin) return true;
    
    // 3. Modules: Dashboard is always free
    if (item.perm === 'dashboard') return true; 

    // 4. Staff Access: forbidden for non-admins
    if (item.perm === 'admin') return false;
    
    // 5. Specific Permissions (check if user.permissions is an array)
    const perms = Array.isArray(user.permissions) ? user.permissions : [];
    return perms.includes(item.perm);
  };

  return (
    <div className="w-64 bg-[#060f1e] text-gray-400 flex flex-col min-h-screen sticky top-0">
      {/* Brand */}
      <div className="p-6 border-b border-white/5">
        <Link href="/" target="_blank" className="flex items-center gap-3">
          <Image src="/assets/images/logo.jpeg" alt="GRL" width={32} height={32} className="rounded" />
          <div>
            <div className="text-white font-display font-black text-xs leading-none">GRL Ops</div>
            <div className="text-[9px] text-amber-500 font-bold uppercase tracking-widest mt-1">
              {user ? (user.role === 'admin' ? 'Root Admin' : 'Staff Editor') : 'Loading...'}
            </div>
          </div>
        </Link>
      </div>

      {/* Permission Debug (Useful for the user to see what's happening) */}
      {user && user.role !== 'admin' && (
        <div className="px-6 py-2 bg-white/5 border-b border-white/5">
           <div className="text-[8px] uppercase font-black text-gray-500 mb-1">My Modules</div>
           <div className="flex flex-wrap gap-1">
             {Array.isArray(user.permissions) && user.permissions.length > 0 ? (
                user.permissions.map((p: any) => (
                  <span key={p} className="text-[8px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded uppercase font-bold">{p}</span>
                ))
             ) : (
                <span className="text-[8px] text-red-400 uppercase font-bold">None Assigned</span>
             )}
           </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-2">
         {MENU_ITEMS.filter(hasPerm).map(item => {
           const active = pathname.startsWith(item.href);
           return (
             <Link 
               key={item.href}
               href={item.href}
               className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-amber-500 text-[#060f1e] font-bold shadow-lg shadow-amber-500/20' : 'hover:bg-white/5 hover:text-white'}`}
             >
               <i className={`${item.icon} text-lg ${active ? 'text-[#060f1e]' : 'text-gray-500'}`}></i>
               <span className="text-sm">{item.label}</span>
             </Link>
           );
         })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
         <form action="/api/admin/logout" method="POST">
           <button 
             type="submit"
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all text-sm group"
           >
             <i className="ri-logout-box-line text-lg text-gray-500 group-hover:text-red-400"></i>
             Sign Out
           </button>
         </form>
      </div>
    </div>
  );
}
