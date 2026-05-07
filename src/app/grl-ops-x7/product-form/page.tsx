'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { Category, Product } from '@/lib/types';

declare global {
  interface Window {
    tinymce: any;
  }
}

export default function ProductFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const isEdit = !!productId;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Partial<Product>>({
    name: '', slug: '', category_slug: '', description: '', 
    full_description: '', features: '', specifications: '', 
    meta_title: '', meta_description: '', tag: '', badge: '', 
    image_url: '', image_path: '', sort_order: 0, 
    is_active: 1, is_featured: 0
  });

  const editorRef = useRef<any>(null);

  useEffect(() => {
    // Fetch categories
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => setCategories(data.categories || []));

    // Fetch product if editing
    if (isEdit) {
      fetch(`/api/admin/products?id=${productId}`) 
        .then(r => r.json())
        .then(data => {
          if (data.product) {
            setForm(data.product);
            if (window.tinymce?.activeEditor) {
               window.tinymce.activeEditor.setContent(data.product.full_description || '');
            }
          }
          setLoading(false);
        });
    }
  }, [productId, isEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
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

  const handleToggleChange = (name: string) => {
    setForm(prev => ({ ...prev, [name]: prev[name as keyof Product] ? 0 : 1 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const full_description = window.tinymce?.activeEditor ? window.tinymce.activeEditor.getContent() : form.full_description;
    const submissionData = { ...form, full_description };

    try {
      const resp = await fetch('/api/admin/products', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { ...submissionData, id: productId } : submissionData),
      });

      if (resp.ok) {
        router.push('/grl-ops-x7/products');
      } else {
        alert('Failed to save product');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setSaving(false);
    }
  };

  const initTinyMCE = () => {
    if (window.tinymce) {
      window.tinymce.init({
        selector: '#full_description',
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
        height: 400,
        setup: (editor: any) => {
          editorRef.current = editor;
          editor.on('change', () => {
            setForm(prev => ({ ...prev, full_description: editor.getContent() }));
          });
        }
      });
    }
  };

  if (loading) return <div className="p-20 text-center font-bold">Loading product...</div>;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <Script 
        src="https://cdn.tiny.cloud/1/68p6fs0nyu59icihoyv7sk06p6olzz92r68eg3heah8qx3tb/tinymce/8/tinymce.min.js" 
        onLoad={initTinyMCE}
      />
      
      <main className="flex-1 p-8">
        <header className="mb-10 flex justify-between items-center">
           <div>
              <Link href="/grl-ops-x7/products" className="text-gray-400 text-xs hover:text-amber-500 transition-colors mb-2 inline-block uppercase font-bold tracking-widest">
                 ← Back to List
              </Link>
              <h1 className="font-display font-black text-3xl text-[#060f1e]">
                {isEdit ? 'Edit Product' : 'Add New Product'}
              </h1>
           </div>
        </header>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8 pb-20">
           
           {/* Main Column */}
           <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                 <h2 className="text-[#060f1e] font-bold mb-6 text-lg border-b border-gray-50 pb-4">Basic Information</h2>
                 <div className="space-y-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Product Name *</label>
                       <input 
                         name="name" value={form.name} onChange={handleInputChange} required
                         className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-colors"
                         placeholder="Hydraulic Excavator ZX-200"
                       />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                       <div>
                          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">URL Slug *</label>
                          <input 
                            name="slug" value={form.slug} onChange={handleInputChange} required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-colors font-mono"
                            placeholder="hydraulic-excavator-zx-200"
                          />
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Division / Category *</label>
                          <select 
                            name="category_slug" value={form.category_slug} onChange={handleInputChange} required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-colors"
                          >
                             <option value="">-- Select Category --</option>
                             {categories.map(c => (
                               <option key={c.slug} value={c.slug}>{c.name}</option>
                             ))}
                          </select>
                       </div>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Short Description *</label>
                       <textarea 
                         name="description" value={form.description} onChange={handleInputChange} required
                         className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-colors h-24"
                         placeholder="A brief summary of the product for listing pages..."
                       ></textarea>
                    </div>
                 </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                 <h2 className="text-[#060f1e] font-bold mb-6 text-lg border-b border-gray-50 pb-4">Full Rich Text Description</h2>
                 <textarea id="full_description" name="full_description" defaultValue={form.full_description}></textarea>
                 <p className="text-[10px] text-gray-400 mt-3 italic">Use this section for detailed info, tables, and formatted content.</p>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                 <h2 className="text-[#060f1e] font-bold mb-6 text-lg border-b border-gray-50 pb-4">Features &amp; Specifications</h2>
                 <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Key Features (One per line)</label>
                       <textarea 
                         name="features" value={form.features} onChange={handleInputChange}
                         className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-colors h-40 font-mono text-[11px]"
                         placeholder="High performance engine&#10;Reinforced bucket&#10;Low fuel consumption"
                       ></textarea>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Specs (Key: Value per line)</label>
                       <textarea 
                         name="specifications" value={form.specifications} onChange={handleInputChange}
                         className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-colors h-40 font-mono text-[11px]"
                         placeholder="Operating Weight: 21,500 kg&#10;Engine Power: 110 kW&#10;Max Depth: 6.7 m"
                       ></textarea>
                    </div>
                 </div>
              </div>

           </div>

           {/* Sidebar Column */}
           <div className="space-y-6">
              
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                 <h2 className="text-[#060f1e] font-bold mb-6 text-lg border-b border-gray-50 pb-4">Visibility &amp; Order</h2>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div>
                          <div className="text-sm font-bold text-[#0f1f3d]">Active Status</div>
                          <div className="text-[10px] text-gray-400">Show on website</div>
                       </div>
                       <button 
                         type="button" 
                         onClick={() => handleToggleChange('is_active')}
                         className={`w-12 h-6 rounded-full transition-colors relative ${form.is_active ? 'bg-green-500' : 'bg-gray-200'}`}
                       >
                          <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.is_active ? 'left-7' : 'left-1'}`}></span>
                       </button>
                    </div>
                    <div className="flex items-center justify-between">
                       <div>
                          <div className="text-sm font-bold text-[#0f1f3d]">Feature on Home</div>
                          <div className="text-[10px] text-gray-400">Add to carousel/sections</div>
                       </div>
                       <button 
                         type="button" 
                         onClick={() => handleToggleChange('is_featured')}
                         className={`w-12 h-6 rounded-full transition-colors relative ${form.is_featured ? 'bg-amber-500' : 'bg-gray-200'}`}
                       >
                          <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.is_featured ? 'left-7' : 'left-1'}`}></span>
                       </button>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Sort Order (Lower = First)</label>
                       <input 
                         type="number" name="sort_order" value={form.sort_order} onChange={handleInputChange}
                         className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-colors"
                       />
                    </div>
                 </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                 <h2 className="text-[#060f1e] font-bold mb-6 text-lg border-b border-gray-50 pb-4">Visuals (Images)</h2>
                 <div className="space-y-4">
                    {form.image_path && (
                       <div className="w-full aspect-video rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 mb-4">
                          <img src={form.image_url || `/${form.image_path}`} alt="Preview" className="w-full h-full object-cover" />
                       </div>
                    )}
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Upload Product Photo</label>
                       <input 
                         type="file"
                         accept="image/*"
                         onChange={(e) => handleFileUpload(e, 'products')}
                         className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200"
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Image Asset Path</label>
                       <input 
                         name="image_path" value={form.image_path} readOnly
                         className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:border-amber-500 outline-none transition-colors font-mono"
                         placeholder="assets/images/products/..."
                       />
                    </div>
                 </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 border-dashed border-amber-200">
                 <h2 className="text-[#060f1e] font-bold mb-4 text-xs uppercase tracking-widest">Labels</h2>
                 <div className="space-y-4">
                    <div>
                       <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Badge (Top Left)</label>
                       <input 
                         name="badge" value={form.badge} onChange={handleInputChange}
                         className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-amber-500 outline-none transition-colors"
                         placeholder="New Arrival"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Overlay Tag (Hover)</label>
                       <input 
                         name="tag" value={form.tag} onChange={handleInputChange}
                         className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-amber-500 outline-none transition-colors"
                         placeholder="View Specs"
                       />
                    </div>
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={saving}
                className="w-full !bg-[#060f1e] hover:!bg-[#0f1f3d] text-white font-black py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2"
              >
                 {saving ? (
                   <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                 ) : (
                   <><i className="ri-save-line text-amber-500"></i> {isEdit ? 'Save Changes' : 'Publish Product'}</>
                 )}
              </button>

           </div>

        </form>
      </main>
    </div>
  );
}
