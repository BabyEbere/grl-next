'use client';

import { useState, useEffect } from 'react';

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  published: string;
}

export default function YoutubeSection({ videos }: { videos: YouTubeVideo[] }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!videos || videos.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] uppercase font-black tracking-widest mb-4">
              <i className="ri-youtube-fill text-sm"></i> Media Hub
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-[#060f1e] leading-tight">
              Watch Us in <span className="text-amber-500">Action</span>
            </h2>
            <p className="text-gray-400 mt-4 text-lg">
              Stay updated with our latest industrial projects, machinery demos, and corporate highlights directly from our YouTube channel.
            </p>
          </div>
          <a 
            href="https://www.youtube.com/channel/UCqyyhEXOcO8vc9hn1XbXoHg" 
            target="_blank" 
            className="inline-flex items-center gap-2 bg-[#060f1e] text-white px-8 py-4 rounded-2xl font-black transition-all hover:bg-amber-500 hover:text-[#060f1e] group"
          >
            Visit Our Channel <i className="ri-arrow-right-up-line transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"></i>
          </a>
        </header>

        {/* Video Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Featured Video */}
          <div className="lg:col-span-7">
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 group">
              <iframe 
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${activeVideo || videos[0].id}?autoplay=${activeVideo ? 1 : 0}`} 
                title="YouTube video player" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Playlist Sidebar */}
          <div className="lg:col-span-5 space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {videos.map((video) => (
              <button 
                key={video.id}
                onClick={() => setActiveVideo(video.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all text-left border-2 ${
                  (activeVideo === video.id || (!activeVideo && video.id === videos[0].id)) 
                  ? 'bg-amber-50 border-amber-200' 
                  : 'bg-gray-50 border-transparent hover:bg-white hover:border-gray-100'
                }`}
              >
                <div className="relative w-32 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                  <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <i className="ri-play-fill text-white text-xl"></i>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-bold text-sm leading-snug line-clamp-2 ${
                    (activeVideo === video.id || (!activeVideo && video.id === videos[0].id)) 
                    ? 'text-amber-900' 
                    : 'text-[#060f1e]'
                  }`}>
                    {video.title}
                  </h4>
                  <div className="text-[10px] text-gray-400 mt-2 flex items-center gap-2">
                    <i className="ri-calendar-line"></i> {mounted ? new Date(video.published).toLocaleDateString() : '...'}
                  </div>
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </section>
  );
}
