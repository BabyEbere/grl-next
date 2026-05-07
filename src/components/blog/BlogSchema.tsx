'use client';

interface BlogSchemaProps {
  post: {
    title: string;
    description: string;
    slug: string;
    image_url?: string;
    image_path?: string;
    created_at: string;
    updated_at: string;
  };
}

export default function BlogSchema({ post }: BlogSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://globalresourceslimited.com';
  const imageUrl = post.image_url || (post.image_path ? `${siteUrl}/${post.image_path}` : `${siteUrl}/assets/images/logo.jpeg`);

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": imageUrl,
    "datePublished": post.created_at,
    "dateModified": post.updated_at,
    "author": {
      "@type": "Organization",
      "name": "Global Resources Limited",
      "url": siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Global Resources Limited",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/assets/images/logo.jpeg`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
