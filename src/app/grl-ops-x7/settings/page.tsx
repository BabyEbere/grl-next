'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        setSettings(data.settings || {});
        setLoading(false);
      });
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      const resp = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });

      if (resp.ok) {
        setMsg({ type: 'success', text: 'Settings updated successfully!' });
      } else {
        setMsg({ type: 'error', text: 'Failed to update settings.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Network error.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    }
  };

  const Section = ({ title, icon, children }: { title: string, icon: string, children: React.ReactNode }) => (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full">
      <h2 className="text-[#060f1e] font-bold mb-6 text-lg border-b border-gray-50 pb-4 flex items-center gap-2">
        <i className={`${icon} text-amber-500`}></i> {title}
      </h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const Field = ({ label, s_key, placeholder, type = 'text' }: { label: string, s_key: string, placeholder?: string, type?: string }) => (
    <div>
      <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5 tracking-wider">{label}</label>
      {type === 'textarea' ? (
        <textarea 
          value={settings[s_key] || ''} 
          onChange={e => handleChange(s_key, e.target.value)}
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none h-24 resize-none"
          placeholder={placeholder}
        ></textarea>
      ) : (
        <input 
          type={type}
          value={settings[s_key] || ''} 
          onChange={e => handleChange(s_key, e.target.value)}
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none"
          placeholder={placeholder}
        />
      )}
    </div>
  );

  const handleSecurityUpdate = async (section: 'username' | 'password', data: any) => {
    setSaving(true);
    setMsg({ type: '', text: '' });
    try {
      const resp = await fetch(`/api/admin/settings/security?section=${section}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await resp.json();
      if (resp.ok) {
        setMsg({ type: 'success', text: result.message || 'Security updated!' });
      } else {
        setMsg({ type: 'error', text: result.message || 'Update failed.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg({ type: '', text: '' }), 5000);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold">Loading configurations...</div>;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 text-[#060f1e]">
        <header className="mb-10 flex justify-between items-end">
           <div>
              <h1 className="font-display font-black text-3xl">Site Settings</h1>
              <p className="text-gray-400 mt-1">Configure GRL global variables and contact information.</p>
           </div>
           {msg.text && (
             <div className={`px-6 py-3 rounded-2xl text-sm font-bold animate-fade-up ${msg.type === 'success' ? 'bg-green-600 text-white shadow-lg shadow-green-500/20' : 'bg-red-500 text-white shadow-lg shadow-red-500/20'}`}>
                <i className={msg.type === 'success' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'}></i> {msg.text}
             </div>
           )}
        </header>

        <div className="space-y-8 pb-32">
           <form onSubmit={handleSave} className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                 <Section title="Basic Identity" icon="ri-id-card-line">
                    <Field label="Company Name" s_key="company_name" placeholder="Global Resources Limited" />
                    <Field label="Slogan / Tagline" s_key="company_tagline" placeholder="Powering Industry. Driving Growth." />
                 </Section>
                 
                 <Section title="Contact Information" icon="ri-phone-line">
                    <div className="grid sm:grid-cols-2 gap-4">
                       <Field label="Phone Line 1" s_key="phone1" placeholder="+234 902 438 4244" />
                       <Field label="Phone Line 2" s_key="phone2" placeholder="0911 155 5552" />
                    </div>
                    <Field label="Email Address" s_key="email" placeholder="info@globalresourceslimited.com" type="email" />
                    <Field label="WhatsApp (No '+' sign)" s_key="whatsapp" placeholder="2349024384244" />
                    <Field label="Office Address" s_key="company_address" placeholder="Physical location..." type="textarea" />
                 </Section>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                 <Section title="Social Media Links" icon="ri-share-line">
                    <div className="grid sm:grid-cols-2 gap-4">
                       <Field label="Facebook URL" s_key="facebook_url" placeholder="https://facebook.com/..." />
                       <Field label="Instagram URL" s_key="instagram_url" placeholder="https://instagram.com/..." />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                       <Field label="Twitter / X" s_key="twitter_url" placeholder="https://twitter.com/..." />
                       <Field label="LinkedIn" s_key="linkedin_url" placeholder="https://linkedin.com/..." />
                    </div>
                 </Section>

                 <Section title="Homepage & Supply Notes" icon="ri-oil-line">
                    <Field label="Petroleum Supply Note" s_key="petroleum_delivery_note" placeholder="Note shown on the petroleum products page..." type="textarea" />
                 </Section>
              </div>

              <div className="flex justify-end pt-4">
                 <button 
                   type="submit" 
                   disabled={saving}
                   className="bg-[#060f1e] hover:bg-[#0f1f3d] text-white font-black px-12 py-4 rounded-2xl transition-all shadow-xl flex items-center gap-3"
                 >
                    {saving ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <><i className="ri-save-3-line text-amber-500"></i> Save All Settings</>
                    )}
                 </button>
              </div>
           </form>

           <div className="border-t border-gray-100 pt-12 pb-4">
              <h2 className="font-display font-black text-2xl mb-2 text-red-600 flex items-center gap-2">
                 <i className="ri-shield-keyhole-line"></i> Security Settings
              </h2>
              <p className="text-gray-400 text-sm mb-8">Manage administrative credentials.</p>
              
              <div className="grid lg:grid-cols-2 gap-8">
                 <Section title="Change Username" icon="ri-user-settings-line">
                    <form onSubmit={async (e) => {
                       e.preventDefault();
                       const formData = new FormData(e.currentTarget);
                       handleSecurityUpdate('username', Object.fromEntries(formData));
                       (e.target as HTMLFormElement).reset();
                    }} className="space-y-4">
                       <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">New Username</label>
                          <input name="new_username" required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500" />
                       </div>
                       <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">Current Password</label>
                          <input type="password" name="current_password" required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500" />
                       </div>
                       <button type="submit" className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all">Update Username</button>
                    </form>
                 </Section>

                 <Section title="Change Password" icon="ri-lock-password-line">
                    <form onSubmit={async (e) => {
                       e.preventDefault();
                       const formData = new FormData(e.currentTarget);
                       const data = Object.fromEntries(formData);
                       if (data.new_password !== data.confirm_password) return alert("Passwords don't match");
                       handleSecurityUpdate('password', data);
                       (e.target as HTMLFormElement).reset();
                    }} className="space-y-4">
                       <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">Current Password</label>
                          <input type="password" name="current_password" required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">New Password</label>
                             <input type="password" name="new_password" required minLength={8} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500" />
                          </div>
                          <div>
                             <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">Confirm</label>
                             <input type="password" name="confirm_password" required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500" />
                          </div>
                       </div>
                       <button type="submit" className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-xl transition-all">Update Password</button>
                    </form>
                 </Section>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
