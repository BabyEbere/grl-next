'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { Division } from '@/lib/types';

export default function AdminDivisionsPage() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Division>>({
    title: '', description: '', icon: 'ri-apps-line', icon_bg: 'bg-amber-50', icon_color: 'text-amber-500',
    link_href: '#', badge_text: '', cta_text: 'Learn More', sort_order: 0, is_active: 1, image_url: '', image_path: ''
  });

  const fetchDivs = () => {
    setLoading(true);
    fetch('/api/admin/divisions')
      .then(r => r.json())
      .then(data => {
        setDivisions(data.divisions || []);
        setLoading(false);
      });
  };

  useEffect(fetchDivs, []);

  const handleEdit = (div: Division) => {
    setEditingId(div.id);
    setForm(div);
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({
      title: '', description: '', icon: 'ri-apps-line', icon_bg: 'bg-amber-50', icon_color: 'text-amber-500',
      link_href: '#', badge_text: '', cta_text: 'Learn More', sort_order: 0, is_active: 1, image_url: '', image_path: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resp = await fetch('/api/admin/divisions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
    });
    if (resp.ok) {
       handleCancel();
       fetchDivs();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this homepage division?')) return;
    const resp = await fetch(`/api/admin/divisions?id=${id}`, { method: 'DELETE' });
    if (resp.ok) fetchDivs();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const resp = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await resp.json();
      if (data.success) {
        setForm(prev => ({ ...prev, image_path: data.path, image_url: data.url }));
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (err) {
      alert('Upload error');
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 text-[#060f1e]">
        <header className="mb-10">
           <h1 className="font-display font-black text-3xl">Homepage Divisions</h1>
           <p className="text-gray-400 mt-1">Manage the core business areas featured on your landing page.</p>
        </header>

        <div className="grid lg:grid-cols-5 gap-8">
           
           {/* Add/Edit Form */}
           <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                 <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <i className={`ri-${editingId ? 'edit' : 'add'}-circle-line text-amber-500`}></i>
                    {editingId ? 'Edit Division' : 'Create New Division'}
                 </h2>
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                       <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">Division Title *</label>
                       <input 
                         name="title" required value={form.title} onChange={handleInputChange}
                         className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none"
                         placeholder="e.g. Industrial Machinery"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">Short Description</label>
                       <textarea 
                         name="description" value={form.description} onChange={handleInputChange}
                         className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none h-20"
                         placeholder="Brief summary..."
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">Icon Class</label>
                          <input 
                            name="icon" value={form.icon} onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none"
                            placeholder="ri-crane-line"
                          />
                       </div>
                       <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">CTA Text</label>
                          <input 
                            name="cta_text" value={form.cta_text} onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none"
                            placeholder="Learn More"
                          />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">Icon BG (Tailwind)</label>
                          <input 
                            name="icon_bg" value={form.icon_bg} onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none"
                            placeholder="bg-amber-100"
                          />
                       </div>
                       <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">Icon Color (Tailwind)</label>
                          <input 
                            name="icon_color" value={form.icon_color} onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none"
                            placeholder="text-amber-500"
                          />
                       </div>
                    </div>
                    
                    <div>
                        {form.image_path && (
                           <div className="w-full h-32 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 mb-2">
                              <img src={form.image_url || `/${form.image_path}`} alt="Preview" className="w-full h-full object-cover" />
                           </div>
                        )}
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">Upload Division Image</label>
                        <input 
                           type="file"
                           accept="image/*"
                           onChange={(e) => handleFileUpload(e, 'divisions')}
                           className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200"
                        />
                        <input 
                           name="image_path" value={form.image_path} readOnly
                           className="w-full bg-gray-100 border border-gray-100 rounded-xl px-4 py-2 mt-2 text-[10px] outline-none font-mono"
                           placeholder="Path will appear here..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">Link URL</label>
                          <input 
                            name="link_href" value={form.link_href} onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none"
                            placeholder="products/excavators"
                          />
                       </div>
                       <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">Sort Order</label>
                          <input 
                            type="number" name="sort_order" value={form.sort_order} onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none"
                          />
                       </div>
                    </div>
                    <div className="pt-4 flex gap-2">
                       <button type="submit" className="flex-1 bg-[#060f1e] hover:bg-[#0f1f3d] text-white font-black py-4 rounded-2xl transition-all shadow-xl">
                          {editingId ? 'Save Changes' : 'Add Division'}
                       </button>
                       {editingId && (
                         <button type="button" onClick={handleCancel} className="bg-gray-100 text-gray-500 font-bold px-6 py-4 rounded-2xl">
                            Cancel
                         </button>
                       )}
                    </div>
                 </form>
              </div>
           </div>

           {/* List */}
           <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                 <table className="w-full text-left text-sm">
                    <thead>
                       <tr className="bg-gray-50 text-gray-400 font-bold border-b border-gray-100 uppercase text-[10px] tracking-widest">
                          <th className="px-6 py-4">Preview</th>
                          <th className="px-6 py-4">Infomation</th>
                          <th className="px-6 py-4">Visibility</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {loading ? (
                         <tr><td colSpan={4} className="p-10 text-center text-gray-400">Loading...</td></tr>
                       ) : divisions.map(div => {
                         const dImg = div.image_path || div.image_url;
                         return (
                           <tr key={div.id} className={`hover:bg-gray-50/50 transition-all ${editingId === div.id ? 'bg-amber-50' : ''}`}>
                              <td className="px-6 py-4">
                                 <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                    {dImg && <img src={dImg.startsWith('http') ? dImg : '/'+dImg} alt="" className="w-full h-full object-cover" />}
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="font-bold text-[#0f1f3d]">{div.title}</div>
                                 <div className="text-[11px] text-gray-400 line-clamp-1">{div.link_href}</div>
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${div.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                    {div.is_active ? 'Active' : 'Hidden'}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <div className="inline-flex gap-1">
                                    <button onClick={() => handleEdit(div)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all">
                                       <i className="ri-edit-line"></i>
                                    </button>
                                    <button onClick={() => handleDelete(div.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all">
                                       <i className="ri-delete-bin-line"></i>
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         );
                       })}
                    </tbody>
                 </table>
              </div>
           </div>

        </div>
      </main>
    </div>
  );
}
