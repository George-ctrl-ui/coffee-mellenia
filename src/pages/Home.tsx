import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ArrowRight, Sparkles, HeartHandshake, ShieldCheck, Coffee } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

// Artisanal Coffee Bean SVG with realistic roasting crease and depth
const CoffeeBean = ({
  className = '',
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    viewBox="0 0 24 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M12 2C6 2 2 8 2 16C2 24 6 30 12 30C18 30 22 24 22 16C22 8 18 2 12 2Z"
      fill="#D95E14"
    />
    <path
      d="M11 3.5C6.5 4 3.5 8.5 3.5 16C3.5 23.5 6.5 28 11 28.5C8.2 25.5 6.8 21 6.8 16C6.8 11 8.2 6.5 11 3.5Z"
      fill="#F47A28"
      opacity="0.9"
    />
    {/* Center cleft */}
    <path
      d="M12 3.5C11 8.5 14 12.5 11.5 16.5C9 20.5 12.5 25.5 12 29"
      stroke="#120803"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12.6 4.5C11.7 9 14.5 13 12.2 17C9.7 21 13 25.5 12.6 28"
      stroke="#221208"
      strokeWidth="0.8"
      strokeLinecap="round"
    />
  </svg>
);

// Floating Aromatic Coffee Steam
const CoffeeSteam = ({
  className = '',
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    viewBox="0 0 40 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M16 85C26 68 10 50 24 32C32 20 22 10 26 4"
      stroke="url(#steamGradientHome)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient id="steamGradientHome" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#F47A28" stopOpacity="0.45" />
        <stop offset="50%" stopColor="#FFE4C6" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFFDF8" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

export const Home: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // TanStack Query for backend products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => api.getProducts(),
  });

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  // Parallax Scroll Tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Parallax transformations for floating coffee elements
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Multi-depth coffee beans parallax
  const bean1Y = useTransform(smoothProgress, [0, 1], [0, -420]);
  const bean1Rotate = useTransform(smoothProgress, [0, 1], [0, 240]);

  const bean2Y = useTransform(smoothProgress, [0, 1], [0, -280]);
  const bean2Rotate = useTransform(smoothProgress, [0, 1], [0, -180]);

  const bean3Y = useTransform(smoothProgress, [0, 1], [0, 320]);
  const bean3Rotate = useTransform(smoothProgress, [0, 1], [0, 160]);

  const bean4Y = useTransform(smoothProgress, [0, 1], [0, -560]);
  const bean4Rotate = useTransform(smoothProgress, [0, 1], [0, -290]);

  const bean5Y = useTransform(smoothProgress, [0, 1], [0, 220]);
  const bean5Rotate = useTransform(smoothProgress, [0, 1], [0, 190]);

  // Steam particle parallax
  const steam1Y = useTransform(smoothProgress, [0, 1], [0, -350]);
  const steam2Y = useTransform(smoothProgress, [0, 1], [0, -220]);

  // Hero coffee image parallax
  const heroCoffeeY = useTransform(smoothProgress, [0, 0.4], [0, -70]);
  const heroTextY = useTransform(smoothProgress, [0, 0.4], [0, -35]);

  // Story section image parallax
  const storyImageY = useTransform(smoothProgress, [0.3, 0.8], [60, -60]);

  // Mouse interaction parallax in hero
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <div ref={containerRef} className="min-h-screen pt-20 relative overflow-x-hidden text-[#F7EFE9]">
      {/* GLOBAL COFFEE PARALLAX LAYER (Floating Coffee Beans & Steam) */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        {/* Floating Coffee Bean 1 - Upper Left */}
        <motion.div
          style={{ y: bean1Y, rotate: bean1Rotate }}
          className="absolute top-28 left-[6%] w-10 h-14 opacity-85 drop-shadow-xl"
        >
          <CoffeeBean className="w-full h-full filter drop-shadow-md" />
        </motion.div>

        {/* Floating Coffee Bean 2 - Upper Center-Right */}
        <motion.div
          style={{ y: bean2Y, rotate: bean2Rotate }}
          className="absolute top-44 right-[8%] w-12 h-16 opacity-90 drop-shadow-2xl"
        >
          <CoffeeBean className="w-full h-full filter drop-shadow-lg" />
        </motion.div>

        {/* Floating Coffee Bean 3 - Mid Left */}
        <motion.div
          style={{ y: bean3Y, rotate: bean3Rotate }}
          className="absolute top-[48%] left-[3%] w-14 h-20 opacity-80 drop-shadow-2xl"
        >
          <CoffeeBean className="w-full h-full filter drop-shadow-md" />
        </motion.div>

        {/* Floating Coffee Bean 4 - Mid-Right */}
        <motion.div
          style={{ y: bean4Y, rotate: bean4Rotate }}
          className="absolute top-[68%] right-[4%] w-11 h-15 opacity-85 drop-shadow-xl"
        >
          <CoffeeBean className="w-full h-full filter drop-shadow-md" />
        </motion.div>

        {/* Floating Coffee Bean 5 - Bottom Left */}
        <motion.div
          style={{ y: bean5Y, rotate: bean5Rotate }}
          className="absolute top-[85%] left-[8%] w-9 h-13 opacity-75 drop-shadow-lg"
        >
          <CoffeeBean className="w-full h-full filter drop-shadow-sm" />
        </motion.div>

        {/* Floating Coffee Steam Particles */}
        <motion.div
          style={{ y: steam1Y }}
          className="absolute top-36 right-[22%] w-12 h-24 opacity-60"
        >
          <CoffeeSteam className="w-full h-full" />
        </motion.div>

        <motion.div
          style={{ y: steam2Y }}
          className="absolute top-[55%] left-[18%] w-10 h-20 opacity-40"
        >
          <CoffeeSteam className="w-full h-full" />
        </motion.div>
      </div>

      {/* Hero Section */}
      <section
        onMouseMove={handleMouseMove}
        className="relative overflow-hidden bg-transparent pt-12 pb-20 lg:pt-16 lg:pb-28"
      >
        {/* Ambient background glow accents matching black & orange theme */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-br from-[#F47A28]/25 to-[#D95E14]/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse duration-1000" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-tl from-[#D95E14]/20 to-transparent rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content with Parallax Drift */}
            <motion.div
              style={{
                y: heroTextY,
                x: mousePos.x * -18,
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FFE4C6] bg-[#1A110B]/90 px-3.5 py-1.5 rounded-full border border-[#F47A28]/40 shadow-xs rgb-frame">
                <Sparkles className="w-3.5 h-3.5 text-[#F47A28]" />
                <span>Specialty Coffee · Talibon, Bohol</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#FFFDF8] tracking-tight leading-[1.08] text-balance">
                Good coffee.{' '}
                <span className="text-[#F47A28] drop-shadow-sm">Better moments.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#C5B5A5] leading-relaxed max-w-xl">
                Your everyday cup of comfort, crafted with care and served with a little sunshine in Purok 3, San Francisco, Talibon, Bohol.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/menu"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#D95E14] to-[#F47A28] hover:from-[#F47A28] hover:to-[#FFA05A] text-white font-semibold rounded-xl shadow-lg transition-all duration-200 active:scale-98 rgb-frame rgb-glow focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F47A28]"
                >
                  <span>Explore Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/story"
                  className="inline-flex items-center justify-center px-6 py-3.5 bg-[#1C120B] hover:bg-[#281A10] text-[#FFE4C6] border border-[#3E2818] font-semibold rounded-xl transition-all duration-200 active:scale-98 rgb-frame focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F47A28]"
                >
                  Our Story
                </Link>
              </div>

              {/* Trust Metric Cards with RGB Frames */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#3E2818] max-w-lg">
                <div className="p-3.5 rounded-xl bg-[#140E0A]/85 backdrop-blur-md border border-[#3E2818] rgb-frame shadow-md">
                  <div className="text-xl sm:text-2xl font-extrabold text-[#FFFDF8] font-mono tabular-nums">
                    100%
                  </div>
                  <div className="text-xs text-[#A39082]">Specialty Arabica</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#140E0A]/85 backdrop-blur-md border border-[#3E2818] rgb-frame shadow-md">
                  <div className="text-xl sm:text-2xl font-extrabold text-[#FFFDF8] font-mono tabular-nums">
                    Fresh
                  </div>
                  <div className="text-xs text-[#A39082]">Daily Small-Batch</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#140E0A]/85 backdrop-blur-md border border-[#3E2818] rgb-frame shadow-md">
                  <div className="text-xl sm:text-2xl font-extrabold text-[#FFFDF8] font-mono tabular-nums">
                    10 Min
                  </div>
                  <div className="text-xs text-[#A39082]">Fast Café Pickup</div>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Image with Coffee Parallax and RGB Frame */}
            <motion.div
              style={{
                y: heroCoffeeY,
                x: mousePos.x * 22,
              }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative"
            >
              {/* Rotating RGB Color Frame container */}
              <div className="rgb-frame rgb-glow rounded-3xl overflow-hidden shadow-2xl">
                <div className="relative aspect-4/3 lg:aspect-4/5 bg-[#140E0A] overflow-hidden group rgb-image-frame">
                  <img
                    src="/src/assets/images/hero_coffee_latte_art_1791815764504.jpg"
                    alt="Artisanal Café Latte with fern latte art at Coffee Mellenia"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0604]/85 via-black/25 to-transparent pointer-events-none" />

                  <div className="absolute bottom-5 left-5 right-5 text-white z-20">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#FFE4C6] flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00e676] animate-pulse" />
                      Fresh Brewed · Talibon, Bohol
                    </div>
                    <div className="text-base font-bold text-[#FFFDF8]">Artisanal Café Latte & Signature Roasts</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Coffee Section */}
      <section className="py-20 bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F47A28]">
                Customer Favorites
              </span>
              <h2 className="text-3xl font-extrabold text-[#FFFDF8] mt-1">
                Featured Coffee & Pastries
              </h2>
            </div>
            <Link
              to="/menu"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F47A28] hover:text-[#FFA05A] transition-colors"
            >
              <span>View full menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-80 rounded-2xl bg-[#17100B]/80 animate-pulse border border-[#3E2818]/60 rgb-frame"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand Story Preview with Parallax Image */}
      <section className="py-20 bg-[#120B07]/70 border-y border-[#3E2818]/70 relative z-10 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story Visual with Parallax Offset and RGB Frame */}
            <div className="lg:col-span-6">
              <motion.div
                style={{ y: storyImageY }}
                className="rgb-frame rgb-glow rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="relative aspect-4/3 bg-[#160E09] overflow-hidden rgb-image-frame group">
                  <img
                    src="/src/assets/images/cafe_story_interior_1791815782466.jpg"
                    alt="Interior of Coffee Mellenia espresso bar and cafe"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
                  />
                </div>
              </motion.div>
            </div>

            {/* Story Text */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F47A28]">
                The Mellenia Philosophy
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FFFDF8] leading-tight">
                Slow down, savor the brew, and recharge.
              </h2>

              <p className="text-sm sm:text-base text-[#C5B5A5] leading-relaxed">
                Coffee Mellenia started with a simple belief: that great coffee isn’t just a morning routine—it’s an intentional pause in a hurried world. Every bean is sourced from certified ethical farms, roasted with precision to accentuate sweet chocolate and bright fruit notes, and extracted by baristas who genuinely care about the craft.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-[#18110B]/90 border border-[#3E2818] rgb-frame flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#2A160A] text-[#F47A28] mt-0.5 shrink-0">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#FFFDF8]">Direct Trade</h4>
                    <p className="text-[11px] text-[#A39082]">Sourced directly from mindful growers</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#18110B]/90 border border-[#3E2818] rgb-frame flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#2A160A] text-[#F47A28] mt-0.5 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#FFFDF8]">Small Batches</h4>
                    <p className="text-[11px] text-[#A39082]">Roasted weekly for peak aromatics</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/story"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#F47A28] hover:text-[#FFA05A] transition-colors"
                >
                  <span>Read our complete story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Call to Action with RGB Frame */}
      <section className="py-20 bg-transparent text-center relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-[#1C120B] via-[#140D08] to-[#0A0604] border border-[#3E2818] rgb-frame rgb-glow space-y-6 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D95E14] to-[#F47A28] text-white mx-auto flex items-center justify-center shadow-lg">
              <Coffee className="w-6 h-6" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FFFDF8]">
              Your next favorite cup is waiting.
            </h2>
            <p className="text-sm sm:text-base text-[#C5B5A5] max-w-lg mx-auto">
              Order ahead for speedy café pickup in Purok 3, San Francisco, Talibon, Bohol. Hot or iced, espresso or matcha—crafted fresh the moment you step through our doors.
            </p>
            <div>
              <Link
                to="/menu"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-[#D95E14] to-[#F47A28] hover:from-[#F47A28] hover:to-[#FFA05A] text-white font-semibold rounded-xl shadow-xl transition-all active:scale-98 rgb-frame rgb-glow"
              >
                Explore Our Menu
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
