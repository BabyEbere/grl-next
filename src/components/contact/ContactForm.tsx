'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (resp.ok) {
        setStatus('success');
      } else {
        const err = await resp.json();
        setError(err.message || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch (e) {
      setError('Network error. Please check your connection.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <i className="ri-check-double-line text-green-500 text-4xl"></i>
        </div>
        <h3 className="font-display font-black text-2xl text-[#0f1f3d] mb-3">Message Received!</h3>
        <p className="text-gray-500 mb-6">Our team will get back to you within 24 hours with a tailored response.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="bg-amber-500 hover:bg-amber-400 text-[#0f1f3d] font-black px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-2"
        >
          Send Another Message <i className="ri-refresh-line"></i>
        </button>
      </div>
    );
  }

  return (
    <>
      <h3 className="font-display font-black text-2xl text-[#0f1f3d] mb-2">Send Us a Message</h3>
      <p className="text-gray-400 text-sm mb-8">Fill in the form — we'll respond with an honest, custom quote within 24 hours.</p>

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
          <i className="ri-error-warning-line"></i>{error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Full Name *</label>
            <input 
              type="text" name="name" required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-colors" 
              placeholder="John Doe" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Phone Number *</label>
            <input 
              type="tel" name="phone" required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-colors" 
              placeholder="+234 ..." 
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Email Address *</label>
          <input 
            type="email" name="email" required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-colors" 
            placeholder="you@company.com" 
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Product / Division</label>
            <select name="product" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 focus:border-amber-500 outline-none transition-colors bg-white">
              <option value="">-- Select Category --</option>
              {['Industrial Machinery','Cranes & Lifting','Bulldozers & Graders','Industrial Trucks','Forklifts','Automobiles / Cars','Petroleum Products (AGO/Diesel)','Shopping Mall','Other'].map(opt => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Inquiry Type</label>
            <select name="inquiry" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 focus:border-amber-500 outline-none transition-colors bg-white">
              <option value="">-- Select Type --</option>
              <option>Request a Quote</option>
              <option>General Enquiry</option>
              <option>Bulk Purchase</option>
              <option>Partnership / Trade</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Your Message *</label>
          <textarea 
            name="message" rows={5} required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-colors resize-none"
            placeholder="Describe what you need — type, quantity, location, timeframe..."
          ></textarea>
        </div>
        <button 
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-gray-300 text-[#0f1f3d] font-black py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-base shadow-lg shadow-amber-500/30"
        >
          {status === 'loading' ? (
            <span className="w-5 h-5 border-2 border-[#0f1f3d] border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <i className="ri-send-plane-line"></i>
          )}
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </>
  );
}
