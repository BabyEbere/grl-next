'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default function EmailSettingsPage() {
  const [mailers, setMailers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  const fetchMailers = async () => {
    const r = await fetch('/api/admin/comms?action=get_mailers');
    const d = await r.json();
    setMailers(d.mailers || []);
    setLoading(false);
  };

  useEffect(() => { fetchMailers(); }, []);

  const handleChange = (id: number, field: string, value: any) => {
    setMailers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const saveMailer = async (mailer: any) => {
    setSaving(mailer.id);
    const r = await fetch('/api/admin/comms?action=save_mailer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mailer)
    });
    if (r.ok) {
       alert('Settings saved successfully!');
    }
    setSaving(null);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <header className="mb-10">
            <h1 className="font-display font-black text-3xl text-[#060f1e]">Email System Branding</h1>
            <p className="text-gray-400 mt-1">Configure SMTP accounts for specific mailing purposes.</p>
        </header>

        {loading ? (
          <div className="py-20 text-center font-bold text-gray-400 animate-pulse">Loading mailers...</div>
        ) : (
          <div className="space-y-12 max-w-4xl">
            {mailers.map(mailer => (
              <div key={mailer.id} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                 <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-xl">
                          <i className={mailer.purpose === 'autoresponder' ? 'ri-reply-all-line' : (mailer.purpose === 'admin_notify' ? 'ri-notification-3-line' : 'ri-service-line')}></i>
                       </div>
                       <div>
                          <h2 className="font-black text-xl text-[#0f1f3d] capitalize underline decoration-amber-500/30 decoration-4 underline-offset-4">
                            {mailer.purpose.replace('_', ' ')} Mailer
                          </h2>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">SMTP Configuration</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black uppercase text-gray-400">Active</span>
                       <button 
                         onClick={() => handleChange(mailer.id, 'is_active', mailer.is_active ? 0 : 1)}
                         className={`w-12 h-6 rounded-full transition-all relative ${mailer.is_active ? 'bg-green-500' : 'bg-gray-200'}`}
                       >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${mailer.is_active ? 'right-1' : 'left-1'}`}></div>
                       </button>
                    </div>
                 </div>

                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">SMTP Host</label>
                       <input 
                         value={mailer.host}
                         onChange={e => handleChange(mailer.id, 'host', e.target.value)}
                         className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Port</label>
                       <input 
                         type="number" value={mailer.port}
                         onChange={e => handleChange(mailer.id, 'port', e.target.value)}
                         className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Encryption</label>
                       <select 
                         value={mailer.encryption}
                         onChange={e => handleChange(mailer.id, 'encryption', e.target.value)}
                         className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all bg-no-repeat appearance-none"
                       >
                          <option value="ssl">SSL (Port 465)</option>
                          <option value="tls">TLS (Port 587)</option>
                          <option value="none">None</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Username / Email</label>
                       <input 
                         value={mailer.username}
                         onChange={e => handleChange(mailer.id, 'username', e.target.value)}
                         className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Password</label>
                       <input 
                         type="password" value={mailer.password}
                         onChange={e => handleChange(mailer.id, 'password', e.target.value)}
                         className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all"
                       />
                    </div>
                 </div>

                  <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col gap-6">
                     <div>
                        <h3 className="text-sm font-black text-[#0f1f3d] mb-4 uppercase tracking-widest flex items-center gap-2">
                           <i className="ri-inbox-archive-line text-amber-500"></i> Incoming Mail Server (IMAP)
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                           <div>
                              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">IMAP Host</label>
                              <input 
                                value={mailer.imap_host || ''}
                                onChange={e => handleChange(mailer.id, 'imap_host', e.target.value)}
                                placeholder="imap.domain.com"
                                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all"
                              />
                           </div>
                           <div>
                              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">IMAP Port</label>
                              <input 
                                type="number" 
                                value={mailer.imap_port || ''}
                                onChange={e => handleChange(mailer.id, 'imap_port', e.target.value)}
                                placeholder="993"
                                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="pt-8 border-t border-gray-50 grid md:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">From Name (Display)</label>
                           <input 
                             value={mailer.from_name}
                             onChange={e => handleChange(mailer.id, 'from_name', e.target.value)}
                             className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                           />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">From Email (Sender)</label>
                           <input 
                             value={mailer.from_email}
                             onChange={e => handleChange(mailer.id, 'from_email', e.target.value)}
                             className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                           />
                        </div>
                     </div>
                  </div>

                 <div className="mt-10">
                    <button 
                      onClick={() => saveMailer(mailer)}
                      disabled={saving === mailer.id}
                      className="w-full bg-[#060f1e] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-amber-500 hover:text-[#060f1e] transition-all shadow-xl shadow-black/10 disabled:opacity-50"
                    >
                      {saving === mailer.id ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        <>Save {mailer.purpose.replace('_', ' ')} Settings <i className="ri-save-line"></i></>
                      )}
                    </button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
