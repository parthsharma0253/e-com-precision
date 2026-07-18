import React from 'react';

interface HeroProps {
  onShopAll: () => void;
  onSelectCategory: (category: string) => void;
}

export default function Hero({ onShopAll, onSelectCategory }: HeroProps) {
  return (
    <section 
      className="bg-gradient-to-br from-indigo-50/40 via-white to-slate-50 border border-slate-200 rounded-xl p-8 md:p-16 mb-12 text-left shadow-sm animate-fadeIn" 
      id="hero-banner"
    >
      <div className="max-w-2xl">
        {/* Giant editorial header matching the precise design and layout */}
        <h1 className="font-sans text-4xl md:text-5xl font-bold tracking-tight text-slate-950 mb-4 leading-tight">
          Precision in Every Detail.
        </h1>
        
        {/* Curated subtitle */}
        <p className="font-sans text-sm md:text-base text-slate-500 mb-8 leading-relaxed">
          Curated high-performance essentials for the modern professional workspace.
        </p>

        {/* Action buttons following the exact style: rectangular, bold uppercase text, indigo and clear outline border */}
        <div className="flex flex-wrap gap-4" id="hero-actions">
          <button
            onClick={onShopAll}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold tracking-wider px-6 py-3 rounded-md shadow-sm uppercase transition duration-150 cursor-pointer"
          >
            SHOP ALL
          </button>
          
          <button
            onClick={() => onSelectCategory('Workstation')}
            className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold tracking-wider px-6 py-3 rounded-md shadow-sm uppercase transition duration-150 cursor-pointer"
          >
            CATEGORIES
          </button>
        </div>
      </div>
    </section>
  );
}
