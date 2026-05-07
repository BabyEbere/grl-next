import Link from 'next/link';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imgSrc = product.image_path || product.image_url;

  return (
    <div className="lift group bg-white rounded-2xl overflow-hidden shadow-md flex flex-col reveal transition-all border border-gray-100/50">
      <div className="relative h-64 overflow-hidden bg-gray-100">
        {imgSrc ? (
          <img 
            src={imgSrc.startsWith('http') ? imgSrc : `/${imgSrc}`} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <i className="ri-image-line text-4xl text-gray-300"></i>
          </div>
        )}
        
        {product.badge && (
          <span className="absolute top-4 left-4 bg-amber-500 text-[#0f1f3d] text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg">
            {product.badge}
          </span>
        )}
        
        {product.tag && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <span className="bg-white/90 backdrop-blur-sm text-[#0f1f3d] text-xs font-bold px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {product.tag}
             </span>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-2 mb-3">
          <Link href={`/product/${product.slug}`} className="hover:text-amber-500 transition-colors">
            <h3 className="font-display font-bold text-xl text-[#0f1f3d] leading-tight line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>
        
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1 mb-6">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <Link 
            href={`/product/${product.slug}`} 
            className="text-[#0f1f3d] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
          >
            Details <i className="ri-arrow-right-line"></i>
          </Link>
          <Link 
            href="/contact" 
            className="bg-[#0f1f3d] text-white p-2 rounded-lg hover:bg-amber-500 transition-colors"
            title="Enquire"
          >
            <i className="ri-mail-send-line"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
