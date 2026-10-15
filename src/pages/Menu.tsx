import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { Product, ProductCategory } from '../types';

const CATEGORIES: ProductCategory[] = [
  'All',
  'Espresso',
  'Iced Coffee',
  'Latte',
  'Non-Coffee',
  'Pastries',
];

export const Menu: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Product[]>({
    queryKey: ['products', selectedCategory, searchQuery],
    queryFn: () => api.getProducts(selectedCategory, searchQuery),
  });

  return (
    <div className="min-h-screen pt-28 pb-24 bg-transparent text-[#F7EFE9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F47A28] bg-[#1C120B]/90 px-3.5 py-1.5 rounded-full border border-[#F47A28]/40 shadow-xs rgb-frame">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Crafted with Care · Talibon, Bohol</span>
          </div>
          <h1 className="text-4xl font-extrabold text-[#FFFDF8] tracking-tight">
            Our Specialty Menu
          </h1>
          <p className="text-sm sm:text-base text-[#C5B5A5]">
            From velvety Spanish lattes to buttery French pastries, each cup and pastry is prepared with uncompromised ingredients.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-10 space-y-5">
          {/* Search Input */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A39082]" />
            <input
              type="text"
              placeholder="Search drinks, beans, or pastries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-[#17100B]/90 border border-[#3E2818] rounded-xl text-sm text-[#FFFDF8] placeholder:text-[#A39082]/60 focus:outline-hidden focus:ring-2 focus:ring-[#F47A28] focus:border-transparent transition-all shadow-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A39082] hover:text-[#FFFDF8]"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs (Segmented Buttons) */}
          <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F47A28] ${
                    active
                      ? 'bg-gradient-to-r from-[#D95E14] to-[#F47A28] text-white shadow-lg rgb-frame'
                      : 'bg-[#18110B]/80 text-[#C5B5A5] hover:bg-[#25170F] hover:text-[#FFFDF8] border border-[#3E2818]/60'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-96 rounded-2xl bg-[#17100B]/80 animate-pulse border border-[#3E2818]/60 rgb-frame"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="max-w-md mx-auto my-12 p-6 rounded-2xl bg-[#20100A] border border-red-500/40 text-center space-y-4 rgb-frame">
            <div className="w-12 h-12 rounded-full bg-red-950/80 text-red-400 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-red-200">
                Unable to load menu
              </h3>
              <p className="text-xs text-red-300/80 mt-1">
                We encountered an error connecting to the coffee catalog. Please check your network and try again.
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && products.length === 0 && (
          <div className="max-w-md mx-auto my-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#1C120B] text-[#F47A28] border border-[#3E2818] mx-auto flex items-center justify-center shadow-lg">
              <Search className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-bold text-[#FFFDF8]">
              No menu items match your search
            </h3>
            <p className="text-xs text-[#A39082]">
              Try adjusting your search terms or select another category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#25170F] hover:bg-[#342014] text-[#FFE4C6] border border-[#3E2818] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && !isError && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
