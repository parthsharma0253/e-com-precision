import React, { useState } from 'react';
import { ShoppingCart, Edit, Trash2, Check, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onEditClick: (product: Product) => void;
  onDeleteClick: (id: number) => void;
  onProductClick?: (productId: number) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onEditClick,
  onDeleteClick,
  onProductClick
}: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  /**
   * Helper function to parse binary image arrays if present,
   * or fall back to high-quality unsplash links.
   */
  const getProductImage = () => {
    if (product.imageData) {
      // If it's a URL (like our initial mock products), return it directly
      if (product.imageData.startsWith('http')) {
        return product.imageData;
      }
      // If it's binary or base64 from our spring boot server, format it appropriately
      if (product.imageData.startsWith('data:')) {
        return product.imageData;
      }
      // Assuming raw base64 string
      return `data:${product.imageType || 'image/jpeg'};base64,${product.imageData}`;
    }
    // Universal placeholder
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop";
  };

  /**
   * Temporary feedback animation when adding to cart
   */
  const handleAddToCart = () => {
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <article 
      className="group flex flex-col bg-white border border-slate-200 hover:border-indigo-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      id={`product-card-${product.id}`}
      onClick={() => {
        if (product.id && onProductClick) {
          onProductClick(product.id);
        }
      }}
    >
      {/* Visual Product Box with Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50 border-b border-slate-100">
        
        <img
          src={getProductImage()}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Dynamic Mockup Badges */}
        {product.isNewBadge && (
          <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-md shadow-sm uppercase">
            NEW
          </span>
        )}

        {product.isLimitedBadge && (
          <span className="absolute top-3 right-3 bg-rose-600 text-white text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-md shadow-sm uppercase">
            LIMITED
          </span>
        )}

        {/* Stock status indicator */}
        {!product.productAvailable || product.stockQuantity === 0 ? (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-slate-900 text-white text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-md shadow-sm uppercase">
              OUT OF STOCK
            </span>
          </div>
        ) : product.stockQuantity <= 5 ? (
          <span className="absolute bottom-3 left-3 bg-amber-500 text-white text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-md shadow-sm">
            ONLY {product.stockQuantity} LEFT
          </span>
        ) : null}

        {/* Hover Admin Actions: Edit & Delete (Simulates PUT and DELETE endpoints) */}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditClick(product);
            }}
            className="p-2.5 bg-white text-slate-800 rounded-full hover:bg-slate-50 shadow-md hover:text-indigo-600 transition cursor-pointer"
            title="Edit Product details (PUT /api/product/{id})"
          >
            <Edit className="h-4 w-4 stroke-[2]" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirmDelete(true);
            }}
            className="p-2.5 bg-white text-rose-600 rounded-full hover:bg-rose-50 shadow-md transition cursor-pointer"
            title="Delete Product (DELETE /api/product/{id})"
          >
            <Trash2 className="h-4 w-4 stroke-[2]" />
          </button>
        </div>

        {/* Inline Delete Confirmation Popover */}
        {showConfirmDelete && (
          <div className="absolute inset-0 bg-slate-900/95 text-white p-4 flex flex-col items-center justify-center text-center z-10 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
            <p className="text-xs font-medium mb-3">Delete this product from catalog?</p>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (product.id) onDeleteClick(product.id);
                  setShowConfirmDelete(false);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-md cursor-pointer transition shadow-sm"
              >
                YES, DELETE
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirmDelete(false);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-md cursor-pointer transition"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Information text below the image */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category: Uppercase spacing */}
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
          {product.category || 'GENERIC'}
        </span>

        {/* Name: Bold text */}
        <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-1 mb-0.5 transition-colors">
          {product.name}
        </h3>

        {/* Brand / Artist subtext */}
        <span className="text-[11px] text-slate-500 mb-4 font-normal">
          {product.brand || 'Precision Brand'}
        </span>

        {/* Price and Cart checkout trigger */}
        <div className="mt-auto flex items-center justify-between">
          <span className="font-mono text-sm font-bold text-slate-900">
            ${Number(product.price).toFixed(2)}
          </span>

          {/* Quick Cart ADD button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={!product.productAvailable || product.stockQuantity === 0}
            className={`p-2.5 rounded-md transition cursor-pointer flex items-center justify-center shadow-sm ${
              isAdded 
                ? 'bg-emerald-600 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
            } disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none`}
            title="Add this item to your cart"
          >
            {isAdded ? (
              <Check className="h-4 w-4 stroke-[2.5]" />
            ) : (
              <ShoppingCart className="h-4 w-4 stroke-[2]" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
