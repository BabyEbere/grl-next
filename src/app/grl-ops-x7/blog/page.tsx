'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/layout/AdminSidebar';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  is_active: number;
  created_at: string;
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const resp = await fetch('/api/admin/blog');
      const data = await resp.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const resp = await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' });
      if (resp.ok) {
        setPosts(posts.filter(p => p.id !== id));
      }
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="font-display font-black text-3xl text-[#060f1e]">Blog Posts</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your website articles and news</p>
          </div>
          <Link 
            href="/grl-ops-x7/blog-form" 
            className="bg-amber-500 hover:bg-amber-600 text-[#060f1e] font-black px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
          >
            <i className="ri-add-line"></i> New Post
          </Link>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Title</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Slug</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">Loading posts...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">No blog posts found.</td></tr>
              ) : posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#060f1e]">{post.title}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-400">{post.slug}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${post.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {post.is_active ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        href={`/grl-ops-x7/blog-form?id=${post.id}`}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-amber-100 hover:text-amber-600 transition-all"
                      >
                        <i className="ri-edit-line"></i>
                      </Link>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-100 hover:text-red-500 transition-all"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
