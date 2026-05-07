'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import AdminSidebar from '@/components/layout/AdminSidebar';

declare global {
  interface Window {
    tinymce: any;
  }
}

function BlogFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  const isEdit = !!postId;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    image_url: '',
    image_path: '',
    meta_title: '',
    meta_description: '',
    is_active: 1
  });

  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (isEdit) {
      fetch(`/api/admin/blog?id=${postId}`)
        .then(r => r.json())
        .then(data => {
          if (data.post) {
            setForm(data.post);
            if (window.tinymce?.activeEditor) {
              window.tinymce.activeEditor.setContent(data.post.content || '');
            }
          }
          setLoading(false);
        });
    }
  }, [postId, isEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: string) => {
    setForm(prev => ({ ...prev, [name as keyof typeof form]: prev[name as keyof typeof form] ? 0 : 1 }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const content = window.tinymce?.activeEditor ? window.tinymce.activeEditor.getContent() : form.content;
    const submissionData = { ...form, content };

    try {
      const resp = await fetch('/api/admin/blog', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { ...submissionData, id: postId } : submissionData),
      });

      if (resp.ok) {
        router.push('/grl-ops-x7/blog');
      } else {
        alert('Failed to save post');
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
        selector: '#content_editor',
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
        height: 500,
        setup: (editor: any) => {
          editorRef.current = editor;
          editor.on('change', () => {
            // Optional: sync to state on change if needed
          });
          if (isEdit && form.content) {
            editor.on('init', () => {
              editor.setContent(form.content);
            });
          }
        }
      });
    }
  };

  if (loading) return <div className="p-20 text-center font-bold">Loading post...</div>;

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
            <Link href="/grl-ops-x7/blog" className="text-gray-400 text-xs hover:text-amber-500 transition-colors mb-2 inline-block uppercase font-bold tracking-widest">
              ← Back to List
            </Link>
            <h1 className="font-display font-black text-3xl text-[#060f1e]">
              {isEdit ? 'Edit Blog Post' : 'Create New Article'}
            </h1>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8 pb-20">

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-[#060f1e] font-bold mb-6 text-lg border-b border-gray-50 pb-4">Content</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Post Title *</label>
                  <input
                    name="title" value={form.title} onChange={handleInputChange} required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-colors"
                    placeholder="The Future of Industrial Machinery in Nigeria"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">URL Slug *</label>
                  <input
                    name="slug" value={form.slug} onChange={handleInputChange} required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-colors font-mono"
                    placeholder="the-future-of-industrial-machinery"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Short Description / Excerpt *</label>
                  <textarea
                    name="description" value={form.description} onChange={handleInputChange} required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-colors h-24"
                    placeholder="A brief overview of the article for listing pages..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-[#060f1e] font-bold mb-6 text-lg border-b border-gray-50 pb-4">Article Body</h2>
              <textarea id="content_editor" defaultValue={form.content}></textarea>
            </div>

          </div>

          <div className="space-y-6">

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-[#060f1e] font-bold mb-6 text-lg border-b border-gray-50 pb-4">Publishing</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-[#0f1f3d]">Post Status</div>
                    <div className="text-[10px] text-gray-400">Visible on public blog</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleChange('is_active')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${form.is_active ? 'bg-green-500' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.is_active ? 'left-7' : 'left-1'}`}></span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-[#060f1e] font-bold mb-6 text-lg border-b border-gray-50 pb-4">Thumbnail Image</h2>
              <div className="space-y-4">
                {form.image_path && (
                  <div className="w-full aspect-video rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 mb-4">
                    <img src={form.image_url || (form.image_path.startsWith('http') ? form.image_path : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://'}/${form.image_path}`)} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'blog')}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Asset Path (Stored)</label>
                  <input
                    name="image_path" value={form.image_path} readOnly
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:border-amber-500 outline-none transition-colors font-mono"
                    placeholder="assets/images/blog/..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 border-dashed border-amber-200">
              <h2 className="text-[#060f1e] font-bold mb-4 text-xs uppercase tracking-widest">SEO Meta</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Meta Title</label>
                  <input
                    name="meta_title" value={form.meta_title} onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-amber-500 outline-none transition-colors"
                    placeholder="SEO optimized title..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Meta Description</label>
                  <textarea
                    name="meta_description" value={form.meta_description} onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-amber-500 outline-none transition-colors h-20"
                    placeholder="Brief summary for search results..."
                  ></textarea>
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
                <><i className="ri-save-line text-amber-500"></i> {isEdit ? 'Update Post' : 'Publish Article'}</>
              )}
            </button>

          </div>

        </form>
      </main>
    </div>
  );
}

export default function BlogFormPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-bold">Loading Editor...</div>}>
      <BlogFormInner />
    </Suspense>
  );
}
