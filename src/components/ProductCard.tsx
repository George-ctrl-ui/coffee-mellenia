import React, { useState } from 'react';
import { Plus, Check, Sparkles, Flame, Eye, Coffee, Layers, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

// Detailed artisanal Coffee Bean SVG with realistic roasting crease
const ArtisanalBean = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 20 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M10 1.5C5 1.5 1.5 6.5 1.5 14C1.5 21.5 5 26.5 10 26.5C15 26.5 18.5 21.5 18.5 14C18.5 6.5 15 1.5 10 1.5Z"
      fill="#D95E14"
    />
    <path
      d="M9.5 2.5C5.5 3.2 2.8 7.5 2.8 14C2.8 20.5 5.5 24.8 9.5 25.2C7 22.5 5.8 18.5 5.8 14C5.8 9.5 7 5.5 9.5 2.5Z"
      fill="#F47A28"
      opacity="0.9"
    />
    {/* Center crease */}
    <path
      d="M10 2.5C9.2 6.5 11.8 10.5 9.8 14.5C7.8 18.5 10.5 22.8 10 25.5"
      stroke="#120803"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [pinnedIngredients, setPinnedIngredients] = useState(false);

  // Default fallback ingredients tailored to product type
  const ingredients = product.ingredients && product.ingredients.length > 0
    ? product.ingredients
    : ['Single-Origin Arabica', 'Artesian Spring Water', 'Specialty Roast'];

  const tastingNotes = product.tastingNotes && product.tastingNotes.length > 0
    ? product.tastingNotes
    : ['Dark Chocolate', 'Caramel', 'Velvety Crema'];

  const roastLevel = product.roastLevel || 'Medium Roast';

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const showOverlay = isHovered || pinnedIngredients;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setPinnedIngredients(!pinnedIngredients)}
      className="group relative flex flex-col rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-2 rgb-frame rgb-glow cursor-pointer bg-gradient-to-b from-[#1C130D] via-[#120B07] to-[#0A0604] border border-[#3A2213] text-[#F7EFE9]"
    >
      {/* Product Image Container with RGB Frame & Interactive Hover Reveal */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-[#160E09] rgb-image-frame">
        {!imgError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-95 group-hover:brightness-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#1E150F] to-[#2B1B11] text-[#F47A28] text-sm font-medium">
            <span>{product.name}</span>
          </div>
        )}

        {/* Ambient Dark Gradient Vignette matching Black & Orange theme */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0604] via-black/20 to-black/40 pointer-events-none" />

        {/* Badges on Image */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <div className="bg-[#0A0604]/85 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider text-[#FFE4C6] uppercase border border-[#F47A28]/35 shadow-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F47A28]" />
            <span>{product.category}</span>
          </div>

          <div className="bg-gradient-to-r from-[#D95E14]/90 to-[#F47A28]/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-semibold text-white tracking-wide flex items-center gap-1 shadow-xs">
            <Flame className="w-2.5 h-2.5" />
            <span>{roastLevel}</span>
          </div>
        </div>

        {/* INTERACTIVE FLOATING COFFEE BEANS WHEN CURSOR TOUCHES CARD */}
        <AnimatePresence>
          {isHovered && (
            <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
              {/* Floating Bean 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30, x: -10, rotate: -20, scale: 0.7 }}
                animate={{ opacity: 0.9, y: -25, x: 15, rotate: 45, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                className="absolute bottom-6 left-6 w-5 h-7 drop-shadow-md"
              >
                <ArtisanalBean className="w-full h-full" />
              </motion.div>

              {/* Floating Bean 2 */}
              <motion.div
                initial={{ opacity: 0, y: 40, x: 20, rotate: 30, scale: 0.6 }}
                animate={{ opacity: 0.85, y: -30, x: -10, rotate: -35, scale: 0.9 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 2.2, delay: 0.3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                className="absolute bottom-8 right-8 w-6 h-8 drop-shadow-md"
              >
                <ArtisanalBean className="w-full h-full" />
              </motion.div>

              {/* Floating Bean 3 (Center subtle) */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.5 }}
                animate={{ opacity: 0.75, y: -15, rotate: 180, scale: 0.75 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.5, delay: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                className="absolute top-10 left-1/2 -translate-x-1/2 w-4 h-6 drop-shadow-sm"
              >
                <ArtisanalBean className="w-full h-full" />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* INTERACTIVE INGREDIENTS OVERLAY ON CURSOR TOUCH / TAP */}
        <AnimatePresence>
          {showOverlay && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-[#0B0705]/94 p-4 flex flex-col justify-between z-20 text-[#F7EFE9] border-b border-[#F47A28]/40 overflow-y-auto"
            >
              <div>
                {/* Header with animated coffee bean badge */}
                <div className="flex items-center justify-between gap-1 mb-2.5 pb-2 border-b border-[#3A2213]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#F47A28] uppercase tracking-wider">
                    <ArtisanalBean className="w-3.5 h-4.5 animate-bounce" />
                    <span>Pure Ingredients</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F47A28]/20 text-[#FFE4C6] border border-[#F47A28]/40">
                    {pinnedIngredients ? 'Pinned' : 'Touch to Pin'}
                  </span>
                </div>

                {/* Ingredients Pill List */}
                <div className="space-y-1.5 mb-3">
                  {ingredients.map((ing, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-2 text-[11px] text-[#FFE8D6] bg-[#1A110B]/90 hover:bg-[#25170F] px-2.5 py-1.5 rounded-lg border border-[#3A2213] transition-colors"
                    >
                      <ArtisanalBean className="w-2.5 h-3.5 shrink-0" />
                      <span className="truncate font-medium">{ing}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Tasting Notes & Brew Profile */}
              <div className="pt-2 border-t border-[#3A2213]">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#F47A28] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#F47A28]" />
                    <span>Aroma & Flavor Notes</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {tastingNotes.map((note, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#24150D] text-[#FFE4C6] border border-[#F47A28]/30 font-medium"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Content Matching Dark Obsidian & Warm Orange Gradient */}
      <div className="flex flex-1 flex-col p-5 bg-gradient-to-b from-[#1C130D] via-[#120B07] to-[#0A0604]">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-base font-bold text-[#FFFDF8] group-hover:text-[#F47A28] transition-colors leading-snug">
            {product.name}
          </h3>
          <span className="text-base font-extrabold text-[#F47A28] font-mono tabular-nums shrink-0">
            ₱{product.price}
          </span>
        </div>

        <p className="text-xs text-[#A39082] line-clamp-2 leading-relaxed mb-3.5 flex-1">
          {product.description}
        </p>

        {/* Interactive Ingredients Quick Bar (Touches & Hover trigger) */}
        <div className="flex items-center gap-2 mb-4 text-[11px] text-[#FFE4C6]/85 bg-[#17100B] hover:bg-[#22160E] px-2.5 py-1.5 rounded-lg border border-[#3A2213] transition-colors">
          <ArtisanalBean className="w-3 h-3.5 shrink-0" />
          <span className="truncate">
            {ingredients.slice(0, 2).join(' · ')}
          </span>
          <span className="ml-auto text-[10px] text-[#F47A28] font-bold shrink-0 flex items-center gap-0.5">
            <Eye className="w-2.5 h-2.5" />
            <span>Ingredients</span>
          </span>
        </div>

        {/* Action Button & Availability */}
        <div className="pt-3 border-t border-[#2A180D] flex items-center justify-between">
          <span className="text-[11px] text-[#A39082]">
            {product.available ? 'Ready in ~10 mins' : 'Sold out'}
          </span>

          <button
            onClick={handleAdd}
            disabled={!product.available}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F47A28] shadow-sm cursor-pointer ${
              added
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-gradient-to-r from-[#D95E14] to-[#F47A28] hover:from-[#F47A28] hover:to-[#FFA05A] text-white shadow-md'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
