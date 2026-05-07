'use client';

import { useState, useEffect, useRef } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import Script from 'next/script';

declare global {
  interface Window {
    tinymce: any;
  }
}

export default function InboxPage() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
  const [replyMode, setReplyMode] = useState(false);
  const [sending, setSending] = useState(false);
  
  const [availableInboxes, setAvailableInboxes] = useState<string[]>([]);
  const [activeInbox, setActiveInbox] = useState<string>('');

  const editorRef = useRef<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('grl_admin_user');
    let allowed: string[] = [];
    if (userStr) {
      const u = JSON.parse(userStr);
      if (u.role === 'admin' || u.username === 'grladmin') {
        allowed = ['support', 'admin_notify', 'autoresponder'];
      } else {
        allowed = Array.isArray(u.allowed_inboxes) ? u.allowed_inboxes : [];
      }
    }
    if (allowed.length === 0) allowed = ['support']; // fallback
    setAvailableInboxes(allowed);
    setActiveInbox(allowed[0]);
  }, []);

  const fetchInbox = async (purpose: string) => {
    if (!purpose) return;
    setLoading(true);
    setErrorMsg("");
    setStatusMsg("");
    setSelectedEmail(null);
    setReplyMode(false);
    try {
      const r = await fetch(`/api/admin/comms?action=get_inbox&purpose=${purpose}`);
      const d = await r.json();
      if (!r.ok) {
        setErrorMsg(d.message || "Failed to load emails.");
      } else {
        setEmails(d.emails || []);
        setStatusMsg(d.message || "Connected successfully.");
      }
    } catch (e) {
      setErrorMsg("Network error connecting to IMAP server.");
    }
    setLoading(false);
  };

  useEffect(() => { 
    if (activeInbox) fetchInbox(activeInbox); 
  }, [activeInbox]);

  useEffect(() => {
    if (replyMode && selectedEmail) {
      setTimeout(() => initTinyMCE('inbox_reply'), 100);
    } else {
      if (editorRef.current && window.tinymce) {
        window.tinymce.remove(editorRef.current);
        editorRef.current = null;
      }
    }
  }, [replyMode, selectedEmail]);

  const initTinyMCE = (id: string) => {
    if (window.tinymce) {
      if (editorRef.current) {
        window.tinymce.remove(editorRef.current);
      }
      window.tinymce.init({
        selector: `#${id}`,
        plugins: 'lists link',
        toolbar: 'undo redo | bold italic underline | forecolor backcolor link | bullist numlist',
        height: 300,
        menubar: false,
        setup: (editor: any) => {
          editorRef.current = editor;
        }
      });
    }
  };

  const sendReply = async () => {
    const replyMsg = editorRef.current ? editorRef.current.getContent() : '';
    if (!replyMsg.trim()) {
      alert("Please enter a message.");
      return;
    }
    
    setSending(true);
    
    // Simple email extraction from "Name <email@dom.com>" format if needed
    let targetEmail = selectedEmail.from;
    const match = targetEmail.match(/<([^>]+)>/);
    if (match) targetEmail = match[1];

    const r = await fetch('/api/admin/comms?action=reply_inbox', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: targetEmail, 
        subject: `Re: ${selectedEmail.subject.replace(/^Re:\s*/i, '')}`, 
        message: replyMsg,
        purpose: activeInbox
      })
    });
    setSending(false);
    if (r.ok) {
      setReplyMode(false);
      alert(`Reply sent successfully via ${activeInbox.replace('_', ' ')} mailer!`);
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
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="p-8 pb-4 flex flex-col border-b border-gray-200 bg-white shadow-sm z-10 w-full shrink-0">
           <div className="flex justify-between items-center mb-6">
               <div>
                  <h1 className="font-display font-black text-3xl text-[#060f1e]">Webmail Inbox</h1>
                  <p className="text-gray-400 mt-1">Check and sync external emails directly via IMAP.</p>
               </div>
               <button 
                 onClick={() => fetchInbox(activeInbox)}
                 disabled={loading}
                 className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"
               >
                 <i className={`ri-refresh-line ${loading ? 'animate-spin' : ''}`}></i> Sync Server
               </button>
           </div>
           
           {/* Inbox Tabs */}
           <div className="flex gap-2">
             {availableInboxes.map(ibx => (
               <button
                 key={ibx}
                 onClick={() => setActiveInbox(ibx)}
                 className={`px-6 py-3 font-bold text-sm rounded-t-xl transition-all capitalize border-b-2 items-center flex gap-2 ${
                   activeInbox === ibx 
                   ? 'bg-amber-50 text-amber-700 border-amber-500' 
                   : 'bg-transparent text-gray-400 hover:bg-gray-50 border-transparent hover:text-[#0f1f3d]'
                 }`}
               >
                 {activeInbox === ibx && <i className="ri-inbox-archive-fill"></i>}
                 {ibx.replace('_', ' ')}
               </button>
             ))}
           </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          
          {/* Email List Left Pane */}
          <div className="w-1/3 border-r border-gray-200 bg-white overflow-y-auto flex flex-col">
            {statusMsg && !loading && !errorMsg && (
              <div className="px-5 py-2.5 bg-green-50 border-b border-green-100/50 text-green-700 text-[9px] font-black uppercase flex items-center justify-between tracking-widest sticky top-0 z-10 shadow-sm shadow-green-500/10">
                 <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500/50 flex animate-ping absolute"></span><span className="w-2 h-2 rounded-full bg-green-500 flex z-10"></span> Connected</span>
                 <span className="opacity-80 truncate" title={statusMsg}>{statusMsg}</span>
              </div>
            )}
            
            {loading && emails.length === 0 ? (
              <div className="p-8 text-center text-gray-400 font-bold animate-pulse">Syncing IMAP...</div>
            ) : errorMsg ? (
              <div className="p-8 m-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-bold text-center">
                <i className="ri-error-warning-line text-2xl block mb-2"></i>
                {errorMsg}
              </div>
            ) : emails.length === 0 ? (
              <div className="p-10 text-center text-gray-400 font-bold">No emails found in the inbox.</div>
            ) : (
              emails.map((email) => (
                <div 
                  key={email.id} 
                  onClick={() => { setSelectedEmail(email); setReplyMode(false); }}
                  className={`p-5 border-b border-gray-50 cursor-pointer transition-all hover:bg-gray-50 ${selectedEmail?.id === email.id ? 'bg-amber-50/50 border-l-4 border-l-amber-500' : 'border-l-4 border-l-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-[#0f1f3d] text-sm truncate pr-4">{email.from}</h4>
                    <span className="text-[10px] text-gray-400 font-black whitespace-nowrap">{email.date.split(' ')[0]}</span>
                  </div>
                  <h5 className="text-xs font-bold text-gray-700 truncate mb-1">{email.subject}</h5>
                  <p className="text-xs text-gray-400 truncate opacity-80">{email.snippet}</p>
                </div>
              ))
            )}
          </div>

          {/* Reading / Reply Right Pane */}
          <div className="w-2/3 bg-gray-50/50 overflow-y-auto hidden md:block relative">
            {selectedEmail ? (
              <div className="p-10 max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-6">
                  <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-50">
                    <div>
                      <h2 className="font-black text-2xl text-[#0f1f3d] mb-2">{selectedEmail.subject}</h2>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 bg-amber-100 text-amber-700 font-black flex items-center justify-center rounded-full uppercase">
                           {selectedEmail.from.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-700">{selectedEmail.from}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                      {selectedEmail.date}
                    </span>
                  </div>

                  <div className="text-gray-600 text-sm leading-loose whitespace-pre-wrap">
                    {/* Because we are picking raw snippets and doing plain text fallback, displaying the snippet as mail content for now until full MIME parsing is built */ 
                      selectedEmail.snippet
                    }
                  </div>
                </div>

                {replyMode ? (
                  <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 animate-in slide-in-from-bottom-4">
                    <h3 className="text-sm font-black text-amber-800 uppercase tracking-widest mb-4">Drafting Reply</h3>
                    <div className="bg-white rounded-xl mb-4 overflow-hidden outline-none">
                      <textarea id="inbox_reply" className="hidden"></textarea>
                    </div>
                    
                    <div className="flex gap-4">
                      <button 
                        onClick={sendReply}
                        disabled={sending}
                        className="bg-[#060f1e] text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-amber-500 hover:text-[#0f1f3d] transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {sending ? 'Sending...' : 'Send HTML Reply'} <i className="ri-send-plane-fill"></i>
                      </button>
                      <button 
                        onClick={() => setReplyMode(false)}
                        className="text-gray-500 font-bold px-6 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        Discard
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setReplyMode(true)}
                    className="bg-white border-2 border-dashed border-gray-200 text-gray-500 w-full py-6 rounded-3xl font-black text-lg hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50/30 transition-all flex items-center justify-center gap-3"
                  >
                    <i className="ri-reply-line"></i> Click to Reply
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center p-20">
                <div>
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="ri-mail-open-line text-4xl text-gray-300"></i>
                  </div>
                  <h3 className="font-black text-2xl text-gray-400 mb-2">No Email Selected</h3>
                  <p className="text-gray-400 font-bold">Select an email from the left to read and reply.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
