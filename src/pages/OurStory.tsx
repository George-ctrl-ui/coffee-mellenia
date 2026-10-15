import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Droplets, MapPin, Sparkles } from 'lucide-react';

export const OurStory: React.FC = () => {
  return (
    <div className="min-h-screen pt-28 pb-24 bg-transparent text-[#F7EFE9]">
      {/* Editorial Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F47A28] bg-[#1C120B]/90 px-3.5 py-1.5 rounded-full border border-[#F47A28]/40 shadow-xs rgb-frame">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About Coffee Mellenia</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#FFFDF8] tracking-tight text-balance leading-tight">
          Crafted with care, poured with intention.
        </h1>
        <p className="text-base sm:text-lg text-[#C5B5A5] leading-relaxed max-w-2xl mx-auto">
          We believe the simple ritual of specialty coffee has the power to brighten an entire day in Purok 3, San Francisco, Talibon, Bohol.
        </p>
      </section>

      {/* Hero Visual with RGB Glow */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="relative aspect-16/9 rounded-3xl overflow-hidden shadow-2xl rgb-frame rgb-image-frame rgb-glow">
          <img
            src="/src/assets/images/cafe_story_interior_1791815782466.jpg"
            alt="Warm architectural interior of Coffee Mellenia espresso bar"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Section 1: The Philosophy */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F47A28]">
              Our Philosophy
            </span>
            <h2 className="text-3xl font-extrabold text-[#FFFDF8] leading-tight">
              A gentle pause in a fast-paced world.
            </h2>
            <p className="text-sm sm:text-base text-[#C5B5A5] leading-relaxed">
              In the vibrant rush of modern life, Coffee Mellenia was envisioned as a calm sanctuary—a place where the warmth of the space mirrors the care poured into every beverage.
            </p>
            <p className="text-sm sm:text-base text-[#C5B5A5] leading-relaxed">
              We focus on specialty coffee without the pretense. Whether you are grabbing a quick morning Americano on your way to work or lingering over an afternoon Spanish latte with a fresh butter croissant, we want you to feel immediately welcomed.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-xl rgb-frame rgb-image-frame rgb-glow">
              <img
                src="/src/assets/images/hero_coffee_latte_art_1791815764504.jpg"
                alt="Delicate latte art poured by Coffee Mellenia baristas"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: The Sourcing & Craft */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-xl rgb-frame rgb-image-frame rgb-glow">
              <img
                src="/src/assets/images/coffee_matcha_latte_1791815816390.jpg"
                alt="Organic ceremonial matcha whisked with fresh milk"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F47A28]">
              Ethical Sourcing & Precision Roasting
            </span>
            <h2 className="text-3xl font-extrabold text-[#FFFDF8] leading-tight">
              Honoring the growers at every step.
            </h2>
            <p className="text-sm sm:text-base text-[#C5B5A5] leading-relaxed">
              Great coffee begins at origin. We partner with ethical specialty green bean importers who prioritize direct farmer equity and regenerative agriculture.
            </p>
            <p className="text-sm sm:text-base text-[#C5B5A5] leading-relaxed">
              Our beans are roasted locally in small batches. We tune each roasting curve carefully to highlight regional characteristics—from the floral acidity of washed lots to the comforting brown sugar and chocolate profiles of our house blend.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-3">
              <div className="p-4 rounded-xl bg-[#18110B]/90 border border-[#3E2818] rgb-frame shadow-md">
                <Flame className="w-5 h-5 text-[#F47A28] mb-2" />
                <h4 className="text-xs font-bold text-[#FFFDF8]">Small-Batch Profiles</h4>
                <p className="text-[11px] text-[#A39082] mt-0.5">Roasted weekly to lock in peak sweetness and balance.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#18110B]/90 border border-[#3E2818] rgb-frame shadow-md">
                <Droplets className="w-5 h-5 text-[#F47A28] mb-2" />
                <h4 className="text-xs font-bold text-[#FFFDF8]">Clean Extraction</h4>
                <p className="text-[11px] text-[#A39082] mt-0.5">Mineral-balanced water and calibrated espresso bars.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: The Bakery */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F47A28]">
              Daily Fresh Bakehouse
            </span>
            <h2 className="text-3xl font-extrabold text-[#FFFDF8] leading-tight">
              Flaky pastries baked fresh every morning.
            </h2>
            <p className="text-sm sm:text-base text-[#C5B5A5] leading-relaxed">
              Nothing pairs better with a steaming cappuccino than a fresh croissant. Our pastry chefs fold pure European cultured butter into flaky laminated layers, baking them before dawn so they arrive warm at your counter.
            </p>
            <div>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#D95E14] to-[#F47A28] hover:from-[#F47A28] hover:to-[#FFA05A] text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-98 rgb-frame"
              >
                <span>Browse Bakery Selection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-xl rgb-frame rgb-image-frame rgb-glow">
              <img
                src="/src/assets/images/bakery_fresh_croissant_1791815828881.jpg"
                alt="Golden buttery flaky French croissant served at Coffee Mellenia"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Invitation Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-[#17100B]/90 backdrop-blur-md p-10 sm:p-14 rounded-3xl border border-[#3E2818] space-y-5 rgb-frame rgb-glow shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-[#2A160A] text-[#F47A28] border border-[#F47A28]/40 flex items-center justify-center mx-auto shadow-md">
          <MapPin className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFFDF8]">
          Come visit our café in person.
        </h2>
        <p className="text-sm text-[#C5B5A5] max-w-lg mx-auto">
          Located in Purok 3, San Francisco, Talibon, Bohol. Whether you need a quiet corner to read, a sunny table to converse, or a swift specialty coffee for your commute, our doors are open.
        </p>
        <div className="pt-2">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#D95E14] to-[#F47A28] hover:from-[#F47A28] hover:to-[#FFA05A] text-white text-xs font-semibold rounded-xl shadow-lg transition-all active:scale-98 rgb-frame rgb-glow"
          >
            Find Our Location & Hours
          </Link>
        </div>
      </section>
    </div>
  );
};
