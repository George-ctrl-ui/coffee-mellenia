import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, MapPin, Clock, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#090504] text-[#FFE4C6] pt-16 pb-12 border-t border-[#3E2818]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D95E14] to-[#F47A28] flex items-center justify-center text-white shadow-md">
                <Coffee className="w-4 h-4" />
              </span>
              <span className="font-display font-extrabold tracking-wider uppercase text-lg text-[#FFFDF8]">
                Coffee Mellenia
              </span>
            </div>
            <p className="text-xs text-[#C5B5A5] leading-relaxed">
              Your everyday cup of comfort, crafted with care and served with a little sunshine in Purok 3, San Francisco, Talibon, Bohol. Thoughtfully sourced beans, small-batch roasted and prepared by passionate baristas.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1C120B] border border-[#3E2818] hover:bg-[#F47A28] text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1C120B] border border-[#3E2818] hover:bg-[#F47A28] text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1C120B] border border-[#3E2818] hover:bg-[#F47A28] text-white flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-[#C5B5A5]">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-white transition-colors">
                  Full Menu & Orders
                </Link>
              </li>
              <li>
                <Link to="/story" className="hover:text-white transition-colors">
                  Our Story & Craft
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact & Café Location
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white transition-colors">
                  Track Pickup Order
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors opacity-70">
                  Staff Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Hours */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Opening Hours
            </h4>
            <ul className="space-y-2.5 text-xs text-[#C5B5A5]">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#F47A28] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Monday – Friday</div>
                  <div>7:00 AM – 9:00 PM</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#F47A28] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Saturday – Sunday</div>
                  <div>8:00 AM – 10:00 PM</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Visit Café
            </h4>
            <ul className="space-y-2.5 text-xs text-[#C5B5A5]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F47A28] shrink-0 mt-0.5" />
                <span>Purok 3, San Francisco, Talibon, Bohol, Philippines</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F47A28] shrink-0" />
                <span>+63 (02) 8812 3456</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F47A28] shrink-0" />
                <span>hello@coffeemellenia.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#3E2818] flex flex-col sm:flex-row items-center justify-between text-xs text-[#A29486] gap-4">
          <p>© {new Date().getFullYear()} Coffee Mellenia. All rights reserved.</p>
          <p className="text-[11px]">
            Specialty single-origin Arabica & Robusta blends · Purok 3, San Francisco, Talibon, Bohol
          </p>
        </div>
      </div>
    </footer>
  );
};
