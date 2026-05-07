import AdminSidebar from '@/components/layout/AdminSidebar';
import { query } from '@/lib/db';
import { Product } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

export default async function AdminProductsPage() {
  const products = await query<Product>(
    `SELECT p.*, c.name as cat_name 
     FROM products p 
     LEFT JOIN product_categories c ON p.category_slug = c.slug 
     ORDER BY p.id DESC`
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <header className="mb-10 flex justify-between items-center">
           <div>
              <h1 className="font-display font-black text-3xl text-[#060f1e]">Products Management</h1>
              <p className="text-gray-400 mt-1">Manage GRL&apos;s digital catalogue across all divisions.</p>
           </div>
           <Link 
             href="/grl-ops-x7/product-form"
             className="bg-amber-500 hover:bg-amber-400 text-[#060f1e] font-black px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
           >
             <i className="ri-add-line text-lg"></i> Add New Product
           </Link>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                 <thead>
                    <tr className="bg-gray-50 text-[#0f1f3d] font-bold border-b border-gray-100">
                       <th className="px-6 py-4">Product Info</th>
                       <th className="px-6 py-4">Division</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4">Featured</th>
                       <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {products.map((p) => {
                      const imgSrc = p.image_path || p.image_url;
                      return (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                                    {imgSrc ? (
                                      <img 
                                        src={imgSrc.startsWith('http') ? imgSrc : `/${imgSrc}`} 
                                        alt="" 
                                        className="w-full h-full object-cover" 
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <i className="ri-image-line"></i>
                                      </div>
                                    )}
                                 </div>
                                 <div>
                                    <div className="font-bold text-[#0f1f3d]">{p.name}</div>
                                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">/{p.slug}</div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
                                 {p.cat_name || 'Uncategorized'}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`flex items-center gap-1.5 text-xs font-bold ${p.is_active ? 'text-green-600' : 'text-red-400'}`}>
                                 <span className={`w-1.5 h-1.5 rounded-full ${p.is_active ? 'bg-green-500' : 'bg-red-400'}`}></span>
                                 {p.is_active ? 'Active' : 'Hidden'}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              {p.is_featured ? (
                                <span className="text-amber-500" title="Featured on Home">
                                   <i className="ri-star-fill"></i>
                                </span>
                              ) : (
                                <span className="text-gray-200">
                                   <i className="ri-star-line"></i>
                                </span>
                              )}
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                 <Link 
                                   href={`/grl-ops-x7/product-form?id=${p.id}`}
                                   className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                   title="Edit"
                                 >
                                    <i className="ri-edit-line"></i>
                                 </Link>
                                 <Link 
                                   href={`/product/${p.slug}`}
                                   target="_blank"
                                   className="w-9 h-9 bg-gray-50 text-gray-500 rounded-lg flex items-center justify-center hover:bg-[#060f1e] hover:text-white transition-all shadow-sm"
                                   title="View Live"
                                 >
                                    <i className="ri-external-link-line"></i>
                                 </Link>
                              </div>
                           </td>
                        </tr>
                      );
                    })}
                 </tbody>
              </table>
           </div>
        </div>
      </main>
    </div>
  );
}
