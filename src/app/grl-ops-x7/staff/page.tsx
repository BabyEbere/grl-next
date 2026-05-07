'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';

const ALL_PERMS = [
  { id: 'products', label: 'Manage Products' },
  { id: 'categories', label: 'Manage Categories' },
  { id: 'divisions', label: 'Manage Divisions' },
  { id: 'blog', label: 'Post Blog Content' },
  { id: 'leads', label: 'Manage Customer Leads' },
  { id: 'inbox', label: 'Incoming Webmail Server' },
  { id: 'settings', label: 'Site Settings' },
];

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    role: 'editor',
    notify_leads: false,
    permissions: [] as string[],
    allowed_inboxes: [] as string[]
  });

  const fetchStaff = async () => {
    const r = await fetch('/api/admin/staff');
    const d = await r.json();
    setStaff(d.staff || []);
    setLoading(false);
  };

  useEffect(() => { fetchStaff(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ username: '', password: '', email: '', role: 'editor', notify_leads: false, permissions: [], allowed_inboxes: [] });
    setIsModalOpen(true);
  };

  const openEdit = (user: any) => {
    setEditing(user);
    setForm({ 
      username: user.username, 
      password: '', 
      email: user.email || '',
      role: user.role, 
      notify_leads: !!user.notify_leads,
      permissions: user.permissions || [],
      allowed_inboxes: user.allowed_inboxes || []
    });
    setIsModalOpen(true);
  };

  const handleTogglePerm = (permId: string) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId]
    }));
  };

  const handleToggleInbox = (inboxId: string) => {
    setForm(prev => ({
      ...prev,
      allowed_inboxes: prev.allowed_inboxes.includes(inboxId)
        ? prev.allowed_inboxes.filter(p => p !== inboxId)
        : [...prev.allowed_inboxes, inboxId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resp = await fetch('/api/admin/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, id: editing?.id })
    });
    if (resp.ok) {
      setIsModalOpen(false);
      fetchStaff();
    }
  };

  const deleteStaff = async (id: number) => {
    if (!confirm('Are you sure? This will revoke all access for this user.')) return;
    const resp = await fetch(`/api/admin/staff?id=${id}`, { method: 'DELETE' });
    if (resp.ok) fetchStaff();
  };

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <header className="mb-10 flex justify-between items-center">
           <div>
              <h1 className="font-display font-black text-3xl text-[#060f1e]">Staff Access</h1>
              <p className="text-gray-400 mt-1">Manage team members and their specific permissions.</p>
           </div>
           <button 
             onClick={openAdd}
             className="bg-[#060f1e] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-amber-500 hover:text-[#060f1e] transition-all shadow-xl shadow-black/10"
           >
              <i className="ri-user-add-line"></i> Add Team Member
           </button>
        </header>

        {loading ? (
          <div className="py-20 text-center font-bold text-gray-400 animate-pulse">Loading staff records...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map(user => (
              <div key={user.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col group hover:shadow-xl transition-all">
                 <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl font-black text-amber-600 border border-gray-100 uppercase">
                       {user.username[0]}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-600'}`}>
                       {user.role}
                    </div>
                 </div>
                 
                 <h3 className="text-lg font-black text-[#0f1f3d] mb-1">{user.username}</h3>
                 <p className="text-[10px] text-gray-400 font-bold mb-1">{user.email || 'No email assigned'}</p>
                 <div className="flex gap-2 items-center mb-4 text-[10px] uppercase font-bold tracking-tighter">
                    <span className="text-gray-400 bg-gray-50 px-2 py-0.5 rounded">Joined {new Date(user.created_at).toLocaleDateString()}</span>
                    {user.notify_leads ? <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded"><i className="ri-notification-3-fill"></i> Alerts On</span> : null}
                 </div>
                 
                 <div className="flex-1">
                    <div className="text-[10px] text-gray-400 font-black uppercase mb-3 block tracking-widest">Active Permissions</div>
                    <div className="flex flex-wrap gap-2 mb-6">
                       {user.role === 'admin' ? (
                         <span className="text-[10px] bg-gray-900 text-gray-100 px-3 py-1 rounded-lg font-bold">Full Access</span>
                       ) : (
                         user.permissions?.length > 0 ? (
                           <>
                             {user.permissions.map((p: string) => (
                               <span key={p} className="text-[10px] bg-gray-50 text-gray-600 px-2 py-1 rounded-lg border border-gray-100 font-semibold">{p}</span>
                             ))}
                             {user.permissions.includes('inbox') && user.allowed_inboxes?.map((ibx: string) => (
                               <span key={ibx} className="text-[10px] bg-amber-50 text-amber-700 px-2 py-1 rounded-lg border border-amber-100 font-semibold">[{ibx}]</span>
                             ))}
                           </>
                         ) : (
                           <span className="text-[10px] text-gray-300 italic">No modules assigned</span>
                         )
                       )}
                    </div>
                 </div>

                 <div className="flex gap-2 pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openEdit(user)}
                      className="flex-1 py-2 rounded-xl bg-gray-50 text-gray-600 text-xs font-bold hover:bg-amber-500 hover:text-white transition-colors"
                    >
                      Edit
                    </button>
                    {user.id !== 1 && (
                      <button 
                        onClick={() => deleteStaff(user.id)}
                        className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                      >
                         <i className="ri-delete-bin-line"></i>
                      </button>
                    )}
                 </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
           <div className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                 <h2 className="text-2xl font-black text-[#0f1f3d]">{editing ? 'Edit Member' : 'New Member'}</h2>
                 <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-red-50 transition-colors"><i className="ri-close-line"></i></button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto">
                 <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Username</label>
                       <input 
                         required value={form.username}
                         onChange={e => setForm({...form, username: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm outline-none focus:border-amber-500 transition-all font-bold"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Email Address</label>
                       <input 
                         type="email" required
                         value={form.email}
                         onChange={e => setForm({...form, email: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm outline-none focus:border-amber-500 transition-all font-bold"
                       />
                    </div>
                    <div className="sm:col-span-2">
                       <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">
                         {editing ? 'New Password (Leave blank to keep)' : 'Initial Password'}
                       </label>
                       <input 
                         type="password" required={!editing}
                         value={form.password}
                         onChange={e => setForm({...form, password: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm outline-none focus:border-amber-500 transition-all font-bold"
                       />
                    </div>
                 </div>

                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Global Role</label>
                    <div className="grid grid-cols-2 gap-4">
                       <button 
                         type="button" 
                         onClick={() => setForm({...form, role: 'editor'})}
                         className={`py-3 rounded-2xl border-2 text-xs font-bold transition-all ${form.role === 'editor' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                       >
                         Limited Editor
                       </button>
                       <button 
                         type="button" 
                         onClick={() => setForm({...form, role: 'admin'})}
                         className={`py-3 rounded-2xl border-2 text-xs font-bold transition-all ${form.role === 'admin' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                       >
                         Full Admin
                       </button>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <input 
                       type="checkbox" 
                       checked={form.notify_leads}
                       onChange={e => setForm({...form, notify_leads: e.target.checked})}
                       id="notify_leads"
                       className="w-5 h-5 rounded accent-amber-500 cursor-pointer"
                    />
                    <label htmlFor="notify_leads" className="text-sm font-bold text-amber-800 cursor-pointer select-none">
                       Receive Email Notifications for Customer Leads
                    </label>
                 </div>

                  {form.role === 'editor' && (
                    <div className="animate-in slide-in-from-top-4 duration-300">
                       <label className="block text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Assign Access Modules</label>
                       <div className="grid grid-cols-1 gap-3">
                          {ALL_PERMS.map(p => (
                            <label key={p.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                               <span className="text-sm font-bold text-gray-600 group-hover:text-[#0f1f3d]">{p.label}</span>
                               <input 
                                 type="checkbox" 
                                 checked={form.permissions.includes(p.id)}
                                 onChange={() => handleTogglePerm(p.id)}
                                 className="w-5 h-5 rounded-lg accent-blue-500"
                               />
                            </label>
                          ))}
                       </div>

                       {form.permissions.includes('inbox') && (
                         <div className="mt-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top-4">
                            <label className="block text-[10px] font-black text-amber-600 uppercase mb-4 tracking-widest">Target Webmail Inboxes</label>
                            <div className="grid grid-cols-1 gap-3">
                               {['support', 'admin_notify', 'autoresponder'].map(ibox => (
                                 <label key={ibox} className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/50 hover:bg-amber-50 transition-colors cursor-pointer group border border-amber-100/50">
                                    <span className="text-sm font-bold text-amber-800 capitalize">{ibox.replace('_', ' ')} Mailer</span>
                                    <input 
                                      type="checkbox" 
                                      checked={form.allowed_inboxes.includes(ibox)}
                                      onChange={() => handleToggleInbox(ibox)}
                                      className="w-5 h-5 rounded-lg accent-amber-500 cursor-pointer"
                                    />
                                 </label>
                               ))}
                            </div>
                         </div>
                       )}
                    </div>
                 )}

                 <button className="w-full !bg-[#060f1e] text-white py-5 rounded-[2rem] font-black text-lg hover:!bg-amber-500 hover:text-[#060f1e] transition-all shadow-2xl shadow-black/10 mt-6">
                    {editing ? 'Update Access' : 'Create Access Record'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
