import { XMLParser } from 'fast-xml-parser';

export async function getLatestYouTubeVideos(channelId: string, limit: number = 5) {
  try {
    const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const xml = await response.text();
    
    // Simple regex parser if fast-xml-parser is not available, 
    // but I'll assume I can just use regex for 0 dependencies.
    const videos: { id: string, title: string, thumbnail: string, published: string }[] = [];
    const entries = xml.split('<entry>').slice(1);
    
    for (const entry of entries.slice(0, limit)) {
      const idMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>(.*?)<\/title>/);
      const thumbMatch = entry.match(/<media:thumbnail url="(.*?)"/);
      const publishedMatch = entry.match(/<published>(.*?)<\/published>/);
      
      if (idMatch && titleMatch) {
        videos.push({
          id: idMatch[1],
          title: titleMatch[1],
          thumbnail: thumbMatch ? thumbMatch[1] : `https://img.youtube.com/vi/${idMatch[1]}/maxresdefault.jpg`,
          published: publishedMatch ? publishedMatch[1] : ''
        });
      }
    }
    
    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
}
