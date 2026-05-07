'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { Category } from '@/lib/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Category>>({
    name: '', slug: '', icon: 'ri-apps-line', description: '', sort_order: 0, meta_title: '', meta_description: ''
  });

  const fetchCats = () => {
    setLoading(true);
    fetch('/api/admin/categories')
      .then(r => r.json())
      .then(data => {
        setCategories(data.categories || []);
        setLoading(false);
      });
  };

  useEffect(fetchCats, []);

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm(cat);
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: '', slug: '', icon: 'ri-apps-line', description: '', sort_order: 0, meta_title: '', meta_description: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resp = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
    });
    if (resp.ok) {
       handleCancel();
       fetchCats();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure? All products in this category will become uncategorized.')) return;
    const resp = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
    if (resp.ok) fetchCats();
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 text-[#060f1e]">
        <header className="mb-10">
           <h1 className="font-display font-black text-3xl">Categories Management</h1>
           <p className="text-gray-400 mt-1">Organize your products into divisions and groups.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
           
           {/* Add/Edit Form */}
           <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-8">
                 <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <i className={`ri-${editingId ? 'edit' : 'add'}-circle-line text-amber-500`}></i>
                    {editingId ? 'Edit Category' : 'Create New Category'}
                 </h2>
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                       <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Category Name</label>
                       <input 
                         required
                         value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none"
                         placeholder="e.g. Excavators"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Slug (URL)</label>
                       <input 
                         required
                         value={form.slug} onChange={e => setForm({...form, slug: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none font-mono"
                         placeholder="excavators"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 leading-none">Remix Icon Name</label>
                       <div className="flex gap-2">
                          <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 text-amber-500">
                             <i className={form.icon || 'ri-apps-line'}></i>
                          </div>
                          <input 
                            value={form.icon} onChange={e => setForm({...form, icon: e.target.value})}
                            className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none"
                            placeholder="ri-crane-line"
                          />
                       </div>
                    </div>
                    <div>
                       <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Page Description</label>
                       <textarea 
                         value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none h-20"
                         placeholder="This appears on the public category page banner..."
                       />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                       <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Sort Order</label>
                          <input 
                            type="number"
                            value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value)})}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none"
                          />
                       </div>
                    </div>
                    <div className="border-t border-gray-50 pt-4 mt-6">
                       <h3 className="text-[10px] uppercase font-black text-amber-500 tracking-widest mb-4">SEO Settings</h3>
                       <div className="space-y-4">
                          <div>
                             <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Page Meta Title</label>
                             <input 
                               value={form.meta_title || ''} onChange={e => setForm({...form, meta_title: e.target.value})}
                               className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none"
                               placeholder="e.g. Best Excavators in Lagos"
                             />
                          </div>
                          <div>
                             <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Page Meta Description</label>
                             <textarea 
                               value={form.meta_description || ''} onChange={e => setForm({...form, meta_description: e.target.value})}
                               className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none h-24"
                               placeholder="Provide a search-friendly description..."
                             />
                          </div>
                       </div>
                    </div>
                    <div className="pt-4 flex gap-2">
                       <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-400 text-[#060f1e] font-black py-4 rounded-2xl transition-all shadow-lg shadow-amber-500/20">
                          {editingId ? 'Save Changes' : 'Create Category'}
                       </button>
                       {editingId && (
                         <button type="button" onClick={handleCancel} className="bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold px-6 py-4 rounded-2xl transition-all">
                            Cancel
                         </button>
                       )}
                    </div>
                 </form>
              </div>
           </div>

           {/* List */}
           <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                 <table className="w-full text-left text-sm">
                    <thead>
                       <tr className="bg-gray-50 text-gray-400 font-bold border-b border-gray-100 uppercase text-[10px] tracking-widest">
                          <th className="px-8 py-4">Sort</th>
                          <th className="px-6 py-4">Icon</th>
                          <th className="px-6 py-4">Category Name</th>
                          <th className="px-8 py-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {loading ? (
                         <tr><td colSpan={5} className="p-10 text-center text-gray-400">Loading...</td></tr>
                       ) : categories.map(cat => (
                         <tr key={cat.id} className={`hover:bg-gray-50/50 transition-all ${editingId === cat.id ? 'bg-amber-50/50' : ''}`}>
                            <td className="px-8 py-4 font-mono text-gray-400 text-xs">{cat.sort_order}</td>
                            <td className="px-6 py-4">
                               <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-amber-500">
                                  <i className={`${cat.icon} text-lg`}></i>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                               <div className="font-bold text-[#0f1f3d]">{cat.name}</div>
                               <div className="text-[10px] text-gray-400 font-mono tracking-tighter">/products/{cat.slug}</div>
                            </td>
                            <td className="px-8 py-4 text-right">
                               <div className="inline-flex gap-2">
                                  <button onClick={() => handleEdit(cat)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all">
                                     <i className="ri-edit-line"></i>
                                  </button>
                                  <button onClick={() => handleDelete(cat.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all">
                                     <i className="ri-delete-bin-line"></i>
                                  </button>
                                </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

        </div>
      </main>
    </div>
  );
}
