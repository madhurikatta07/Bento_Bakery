/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppState } from '../context/AppContext';
import { STANDARD_BAKERY_CAKES } from '../data';
import { FAQSection } from './FAQSection';
import { ReviewSection } from './ReviewSection';
import { Sparkles, ArrowRight, Heart, Star, Sparkle, Tag, Gift, BadgeAlert, Cake, LogIn, LogOut } from 'lucide-react';

export const Catalog: React.FC = () => {
  const { setView, toggleWish, wishlist, addToCart, currentUser, logoutUser, showToast } = useAppState();

  const activeVouchers = [
    { code: 'BENTO10', percent: '10%', desc: '10% Off custom designed bento cakes' },
    { code: 'WELCOME15', percent: '15%', desc: '15% Off your introductory bento box' },
  ];

  const handleAddPremadeToCart = (cake: typeof STANDARD_BAKERY_CAKES[0]) => {
    addToCart({
      isCustom: false,
      standardCake: cake,
      name: cake.name,
      price: cake.price,
      quantity: 1,
      imageUrl: cake.imageUrl
    });
    setView('cart');
  };

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-100 via-[#FFF9F2] to-amber-100 p-8 sm:p-12 lg:p-16 border border-pink-200/50 shadow-xs flex flex-col lg:flex-row items-center gap-10">
        {/* Visual floating decorations */}
        <div className="absolute top-4 left-6 text-pink-300 text-lg animate-pulse">✿</div>
        <div className="absolute bottom-8 right-16 text-amber-300 text-sm animate-spin">✦</div>

        <div className="space-y-5 flex-1 max-w-xl text-center lg:text-left">
          <span className="px-3 py-1 bg-white border border-pink-250 text-rose-500 font-bold uppercase tracking-widest text-[10px] rounded-full inline-flex items-center space-x-1 shadow-xs">
            <Sparkle className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Korean Lunchbox Bento Bakery</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-gray-800 leading-tight">
            Soft Layers, Sweet Moments.
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base leading-relaxed">
            Beautiful, miniature 4-inch Korean bento cakes crafted individually by Head Baker Deepika. Tailor the icing palette, piped scripts, and toppings to construct your customized confection box!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={() => setView('customize')}
              className="px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm rounded-2xl shadow-md transition-all inline-flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Design Your Bento Cake</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#featured-menu"
              className="px-6 py-3.5 bg-white hover:bg-gray-50 border border-rose-100 text-rose-600 font-bold text-sm rounded-2xl transition-all text-center inline-flex items-center justify-center"
            >
              <span>Browse Bakery Menu</span>
            </a>
          </div>
        </div>

        {/* Visual Hero Bento Image Banner */}
        <div className="flex-1 w-full max-w-[380px] aspect-square relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform hover:rotate-2 transition-transform">
          <img 
            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80" 
            alt="Adorable Korean Bento Cake" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 text-white">
            <h5 className="font-serif text-lg font-black">Minimalist Pastel Berry</h5>
            <p className="text-xs text-rose-250 font-bold block mt-0.5">Customizable from ₹250.00</p>
          </div>
        </div>
      </section>

      {/* active promotional coupon row */}
      <section className="bg-rose-50/40 p-5 rounded-2xl border border-pink-100/60">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-center sm:text-left select-none">
            <div className="p-2.5 bg-pink-100 text-rose-500 rounded-xl">
              <Gift className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest block">Active Deals &amp; Vouchers</span>
              <span className="text-xs text-rose-700/80">Copy code to apply during Shopping Cart checkout!</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {activeVouchers.map((v) => (
              <div 
                key={v.code}
                onClick={() => {
                  navigator.clipboard.writeText(v.code);
                  showToast(`Copied Coupon: "${v.code}". Apply during Oven Cart checkout!`, 'success');
                }}
                className="bg-white px-3.5 py-1.5 border border-dashed border-rose-200 rounded-xl flex items-center space-x-2.5 cursor-pointer hover:border-rose-455 transition-colors"
                title="Click to copy coupon code"
              >
                <Tag className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-mono text-xs font-black text-rose-600 tracking-wider uppercase">{v.code}</span>
                <span className="text-[10px] bg-rose-50 text-rose-500 px-2 py-0.5 rounded font-black">{v.percent} OFF</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hand-crafted dynamic login/logout banner */}
      {currentUser ? (
        <section id="auth-catalog-banner" className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-8 border border-amber-200/50 text-gray-800 relative overflow-hidden shadow-sm">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-8 translate-y-8 select-none text-9xl">🎂</div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="bg-[#8E4D3E]/10 text-amber-900 font-bold text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block leading-none">
                Welcome Back
              </span>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-gray-800">Greetings, {currentUser.displayName}! <strong className="text-rose-500 font-bold">✨</strong></h4>
              <p className="text-xs sm:text-sm text-gray-500 max-w-xl">
                You are signed in as <strong className="text-[#8E4D3E] font-semibold">{currentUser.email}</strong>. Ready to design another sweet Korean bento box?
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0 justify-center">
              <button
                onClick={() => setView('account')}
                className="px-5 py-3 bg-[#8E4D3E] hover:bg-[#723B2F] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm cursor-pointer leading-none"
              >
                Go to My Account
              </button>
              <button
                onClick={logoutUser}
                className="px-5 py-3 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center space-x-1.5 leading-none"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section id="auth-catalog-banner" className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12 select-none text-9xl">🧁</div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="bg-white/20 text-white font-bold text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block leading-none">
                Baking Member Club
              </span>
              <h4 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">Join Cakes &amp; Creams as a Sweet Member!</h4>
              <p className="text-xs sm:text-sm text-pink-100 max-w-xl">
                Create an account instantly using your name &amp; email to log custom orders, save shipping address binders, and bookmark bento designs to your personal wishlist!
              </p>
            </div>
            <button
              onClick={() => setView('account')}
              className="px-6 py-3.5 bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs sm:text-sm rounded-xl shrink-0 transition-all shadow-md active:scale-95 cursor-pointer leading-none flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Login or Sign Up</span>
            </button>
          </div>
        </section>
      )}

      {/* Featured Menu Grid */}
      <section id="featured-menu" className="scroll-mt-24 space-y-8">
        <div className="text-center max-w-md mx-auto space-y-1.5">
          <span className="text-[10px] bg-rose-100 text-rose-600 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest text-[9px]">Sweet Preset bakes</span>
          <h2 className="font-serif text-3xl font-bold text-gray-800">Best Selling Bento Cakes</h2>
          <p className="text-xs sm:text-sm text-gray-400">Order Deepika\'s signature recipe designs directly with a single click</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STANDARD_BAKERY_CAKES.map((cake) => {
            const isListedWish = wishlist.includes(cake.name);
            return (
              <div 
                key={cake.id} 
                className="bg-white border border-rose-100/40 rounded-3xl overflow-hidden hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                {/* Visual Image Block */}
                <div className="relative aspect-square bg-rose-50 overflow-hidden">
                  <img 
                    src={cake.imageUrl} 
                    alt={cake.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  
                  {/* Rating Tag */}
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold text-gray-700 shadow-sm flex items-center space-x-0.5">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span>{cake.rating}</span>
                  </span>

                  {/* Best Seller Ring */}
                  {cake.isBestSeller && (
                    <span className="absolute top-3 right-3 bg-rose-500 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs leading-none">
                      Best Seller
                    </span>
                  )}
                </div>

                {/* Info and Actions */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="font-serif text-base font-bold text-gray-800 leading-tight block">{cake.name}</h4>
                      <span className="text-base font-black text-rose-600 font-sans tracking-tight">₹{cake.price.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed font-normal">{cake.description}</p>
                  </div>

                  {/* Options row */}
                  <div className="pt-3.5 border-t border-rose-50/60 flex items-center justify-between gap-1 select-none">
                    <span className="text-[10px] text-amber-800 bg-amber-500/5 px-2.5 py-0.5 rounded font-bold">
                      Sponge: {cake.flavor.split(' ')[1] || 'Vanilla'}
                    </span>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => toggleWish(cake.name)}
                        className={`p-2 rounded-full border transition-colors ${isListedWish ? 'border-rose-200 bg-rose-50 text-rose-500' : 'border-rose-100 text-rose-300 hover:text-rose-500'}`}
                        title="Add to Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${isListedWish ? 'fill-rose-500' : ''}`} />
                      </button>
                      <button 
                        onClick={() => handleAddPremadeToCart(cake)}
                        className="px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Customize Invitation Wide Banner */}
      <section className="bg-gradient-to-r from-amber-50 to-pink-50 p-8 rounded-3xl border border-amber-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 flex-1 text-center md:text-left">
          <h4 className="font-serif text-xl font-bold text-amber-950">🎂 Need a bespoke creation?</h4>
          <p className="text-xs sm:text-sm text-amber-800">
            Tell Head Baker Deepika what exact frosting color, lettering, font type, toppings &amp; style you dream of!
          </p>
        </div>

        <button
          onClick={() => setView('customize')}
          className="px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs leading-none shrink-0 transition-colors cursor-pointer"
        >
          Customize My Bento Now
        </button>
      </section>

      {/* Customer Feedback Review section */}
      <section className="bg-white">
        <ReviewSection />
      </section>

      {/* Accordion FAQ Grid */}
      <section>
        <FAQSection />
      </section>
    </div>
  );
};
