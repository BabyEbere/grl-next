'use client';

import { useState, useEffect, useRef } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import Script from 'next/script';

declare global {
  interface Window {
    tinymce: any;
  }
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const editorRef = useRef<any>(null);

  const fetchLeads = async () => {
    const r = await fetch('/api/admin/comms?action=get_leads');
    const d = await r.json();
    setLeads(d.leads || []);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  // Whenever replyingTo changes, wait a tick and initialize TinyMCE if script is loaded
  useEffect(() => {
    if (replyingTo !== null) {
      setTimeout(() => initTinyMCE(replyingTo), 100);
    } else {
      if (editorRef.current && window.tinymce) {
        window.tinymce.remove(editorRef.current);
        editorRef.current = null;
      }
    }
  }, [replyingTo]);

  const initTinyMCE = (id: number) => {
    if (window.tinymce) {
      if (editorRef.current) {
        window.tinymce.remove(editorRef.current);
      }
      window.tinymce.init({
        selector: `#reply_box_${id}`,
        plugins: 'lists link',
        toolbar: 'undo redo | bold italic underline | forecolor backcolor link | bullist numlist',
        height: 250,
        menubar: false,
        setup: (editor: any) => {
          editorRef.current = editor;
        }
      });
    }
  };

  const deleteLead = async (id: number) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    const r = await fetch(`/api/admin/comms?action=delete_lead&id=${id}`, { method: 'DELETE' });
    if (r.ok) fetchLeads();
  };

  const sendReply = async (id: number) => {
    const replyMsg = editorRef.current ? editorRef.current.getContent() : '';
    if (!replyMsg.trim()) {
      alert("Please enter a message.");
      return;
    }

    setSending(true);
    const r = await fetch('/api/admin/comms?action=reply_lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, message: replyMsg })
    });
    setSending(false);
    if (r.ok) {
      // alert("Reply sent successfully!");
      setReplyingTo(null);
      fetchLeads();
    } else {
      alert("Failed to send reply. Please check Email Setup.");
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans text-slate-800">
      <AdminSidebar />
      <Script
        src="https://cdn.tiny.cloud/1/68p6fs0nyu59icihoyv7sk06p6olzz92r68eg3heah8qx3tb/tinymce/8/tinymce.min.js"
      />

      <main className="flex-1 p-8">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="font-display font-black text-3xl text-[#060f1e]">Customer Leads</h1>
            <p className="text-gray-400 mt-1">Manage inquiries and contact requests from the website.</p>
          </div>
        </header>

        {loading ? (
          <div className="py-20 text-center font-bold text-gray-400 animate-pulse">Loading leads...</div>
        ) : (
          <div className="space-y-4">
            {leads.length === 0 ? (
              <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-chat-voice-line text-gray-300 text-2xl"></i>
                </div>
                <p className="text-gray-400 font-bold">No leads found yet.</p>
              </div>
            ) : (
              leads.map(lead => (
                <div key={lead.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all group relative overflow-hidden">
                  {/* Status indicator */}
                  <div className="absolute top-0 right-0 p-6 flex gap-2">
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {lead.status}
                    </span>
                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="bg-red-50 text-red-400 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-64 border-r border-gray-50 pr-8">
                      <div className="w-12 h-12 bg-[#060f1e] text-white rounded-2xl flex items-center justify-center font-black text-lg mb-4">
                        {lead.name[0]}
                      </div>
                      <h3 className="font-black text-lg text-[#0f1f3d] truncate">{lead.name}</h3>
                      <p className="text-xs text-blue-500 font-bold mb-4">{lead.email}</p>
                      <div className="space-y-1 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        <div className="flex items-center gap-2"><i className="ri-phone-line"></i> {lead.phone || 'No phone'}</div>
                        <div className="flex items-center gap-2"><i className="ri-time-line"></i> {new Date(lead.created_at).toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="text-[10px] text-amber-500 font-black uppercase tracking-widest mb-2">Subject</div>
                      <h4 className="font-black text-xl text-[#0f1f3d] mb-4">{lead.subject || 'Website Inquiry'}</h4>
                      <div className="bg-gray-50 rounded-2xl p-6 text-gray-600 text-sm leading-relaxed italic border border-gray-100">
                        "{lead.message}"
                      </div>

                      <div className="mt-6 flex flex-col gap-4">
                        {replyingTo === lead.id ? (
                          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 animate-in slide-in-from-top-2">
                            <label className="block text-[10px] font-black text-amber-800 uppercase mb-2 tracking-widest">Your HTML Response</label>

                            <div className="mb-4 bg-white">
                              <textarea
                                id={`reply_box_${lead.id}`}
                                placeholder="Write your beautiful HTML email reply here..."
                                className="w-full h-40 border-none outline-none hidden"
                              ></textarea>
                            </div>

                            <div className="flex gap-3">
                              <button
                                onClick={() => sendReply(lead.id)}
                                disabled={sending}
                                className="bg-[#060f1e] text-white px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-amber-500 hover:text-[#060f1e] transition-all disabled:opacity-50"
                              >
                                {sending ? 'Sending...' : 'Send HTML Email'} <i className="ri-send-plane-fill"></i>
                              </button>
                              <button
                                onClick={() => setReplyingTo(null)}
                                className="bg-transparent text-gray-500 hover:text-gray-800 px-4 py-2 rounded-xl font-bold text-xs transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-4">
                            {lead.status !== 'replied' && (
                              <button
                                onClick={() => setReplyingTo(lead.id)}
                                className="bg-amber-500 text-[#060f1e] px-8 py-3 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
                              >
                                <i className="ri-reply-line"></i> Reply In-App
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
