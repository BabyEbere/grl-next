'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const resp = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.user) {
          localStorage.setItem('grl_admin_user', JSON.stringify(data.user));
        }
        router.push('/grl-ops-x7/dashboard');
      } else {
        const data = await resp.json();
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#060f1e] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
           <div className="inline-block bg-white p-3 rounded-2xl mb-4">
              <Image src="/assets/images/logo.jpeg" alt="GRL" width={60} height={60} className="rounded" />
           </div>
           <h1 className="font-display font-black text-3xl text-white">GRL Command Center</h1>
           <p className="text-gray-400 mt-2">Sign in to manage Global Resources Limited</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
              <i className="ri-error-warning-line"></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-widest">Username</label>
              <div className="relative">
                <i className="ri-user-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:border-amber-500 transition-colors outline-none"
                  placeholder="admin"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-widest">Password</label>
              <div className="relative">
                <i className="ri-lock-password-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:border-amber-500 transition-colors outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-[#060f1e] font-black py-4 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-[#060f1e] border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>Sign In <i className="ri-login-box-line"></i></>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
             <Link href="/" className="text-gray-400 text-xs hover:text-amber-500 transition-colors">
               ← Return to Public Website
             </Link>
          </div>
        </div>
        
        <p className="text-center text-gray-500 text-[10px] mt-10 uppercase tracking-widest">
           Secure Administration Interface v2.0
        </p>
      </div>
    </main>
  );
}
