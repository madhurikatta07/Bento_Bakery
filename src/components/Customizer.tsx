/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useAppState } from '../context/AppContext';
import { CAKE_SIZES, FLAVORS, FROSTING_COLORS, CREAM_TYPES, THEME_DESIGNS, FONTS, TOPPINGS, PRESET_INSPIRATIONS } from '../data';
import { Sparkles, ShoppingBag, Plus, Sparkle, Upload, Image as ImageIcon, CheckCircle, Flame } from 'lucide-react';

export const Customizer: React.FC = () => {
  const { addToCart, setView } = useAppState();

  // Selected state
  const [selectedSize, setSelectedSize] = useState(CAKE_SIZES[0]);
  const [selectedFlavor, setSelectedFlavor] = useState(FLAVORS[0]);
  const [selectedFrosting, setSelectedFrosting] = useState(FROSTING_COLORS[1]); // pink
  const [selectedCream, setSelectedCream] = useState(CREAM_TYPES[0]);
  const [selectedTheme, setSelectedTheme] = useState(THEME_DESIGNS[0]);
  const [inputText, setInputText] = useState('Happy Day ✨');
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [textColor, setTextColor] = useState('#8C4A60'); // matching pink text
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  
  // Inspiration Upload / Selection state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Price Calculation
  const BASE_PRICE = 250.00;
  const sizeCost = selectedSize.addedPrice;
  const flavorCost = selectedFlavor.price;
  const creamCost = selectedCream.price || 0;
  const themeCost = selectedTheme.price;
  const toppingsCost = selectedToppings.reduce((sum, topName) => {
    const toppingObj = TOPPINGS.find(t => t.name === topName);
    return sum + (toppingObj ? toppingObj.price : 0);
  }, 0);

  const totalPrice = BASE_PRICE + sizeCost + flavorCost + creamCost + themeCost + toppingsCost;

  // Handle Toppings selection change
  const handleToppingToggle = (topName: string) => {
    setSelectedToppings(prev => 
      prev.includes(topName) 
        ? prev.filter(t => t !== topName) 
        : [...prev, topName]
    );
  };

  // Profile Upload simulation
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        setSelectedPreset(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPresetInspiration = (presetUrl: string, name: string) => {
    setSelectedPreset(name);
    setUploadedImage(presetUrl);
  };

  const handleAddToCartSubmit = () => {
    const customDetails = {
      flavor: selectedFlavor.name,
      size: selectedSize.label,
      frostingColor: selectedFrosting.name,
      creamType: selectedCream.name,
      themeDesign: selectedTheme.name,
      customText: inputText,
      fontStyle: selectedFont.name,
      textColor: textColor,
      toppings: selectedToppings,
      inspirationImage: uploadedImage || selectedPreset,
      price: totalPrice
    };

    addToCart({
      isCustom: true,
      customDetails,
      name: `Bespoke Bento - ${selectedFlavor.name}`,
      price: totalPrice,
      quantity: 1,
      imageUrl: selectedTheme.img
    });

    setView('cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="px-3.5 py-1 bg-pink-100 text-rose-600 text-xs font-semibold rounded-full uppercase tracking-widest inline-flex items-center space-x-1.5 leading-none shadow-sm">
          <Sparkles className="w-3 h-3 animate-pulse text-pink-500" />
          <span>Bake Your Dream Cake</span>
        </span>
        <h2 className="font-serif text-4xl font-bold text-gray-800 mt-2">Bento Cake Studio</h2>
        <p className="text-gray-500 mt-1.5 text-sm sm:text-base">
          Our Korean-style lunchbox cakes are hand-baked and meticulously detailed by Deepika. Adjust colors, borders, piping text, and toppings to construct your sweet masterpiece!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Real-Time Cake Preview (Interactive Canvas) */}
        <div id="cake-preview-canvas" className="lg:col-span-5 sticky top-24 bg-gradient-to-b from-[#FFFDF9] to-[#FFF5E1] p-6 rounded-3xl border border-amber-100/60 shadow-md">
          <h3 className="font-serif text-lg font-bold text-amber-900/80 mb-4 flex items-center space-x-1.5">
            <span>🎂 Your Bake-Box Preview</span>
          </h3>

          {/* Clamshell Bento Box container */}
          <div className="relative aspect-square w-full max-w-[340px] mx-auto bg-amber-50 rounded-2xl p-6 border border-amber-100 shadow-inner flex items-center justify-center">
            
            {/* Clamshell Box Shadow & Lid Mockup */}
            <div className="absolute inset-2 border border-dashed border-amber-200/50 rounded-xl pointer-events-none" />
            <div className="absolute top-2 left-2 text-xs font-mono text-amber-600/60 font-medium">clamshell bento</div>

            {/* Baking Parchment Paper */}
            <div className="absolute w-72 h-72 bg-amber-50 border border-amber-100 rotate-6 rounded-lg opacity-40 shadow-sm" />
            <div className="absolute w-68 h-68 bg-[#FFFDF9] rotate-3 rounded-lg shadow-md flex items-center justify-center p-4">
              
              {/* Actual Cake Base - Color driven by frostingSelection */}
              <div 
                className="relative w-48 h-48 rounded-full shadow-lg border border-black/5 transition-all duration-500 flex items-center justify-center"
                style={{ backgroundColor: selectedFrosting.hex }}
              >
                {/* 3D gradient look on cake edges */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/5 via-transparent to-white/10" />

                {/* Theme Border / Shells Styling */}
                {selectedTheme.name === 'Retro Vintage Border' && (
                  <div className="absolute inset-1.5 rounded-full border-[8px] border-double opacity-80 border-white/60 animate-pulse" />
                )}

                {selectedTheme.name === 'Sweet Daisy Floral' && (
                  <div className="absolute inset-0">
                    {[1, 2, 3, 4, 5, 6].map((deg) => (
                      <div 
                        key={deg}
                        className="absolute w-3.5 h-3.5 bg-yellow-100 border border-amber-200 rounded-full flex items-center justify-center shadow-xs"
                        style={{
                          top: `${40 + Math.sin(deg * (Math.PI / 3)) * 36}%`,
                          left: `${42 + Math.cos(deg * (Math.PI / 3)) * 36}%`,
                        }}
                      >
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                      </div>
                    ))}
                  </div>
                )}

                {selectedTheme.name === 'Cute Pip Animal' && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-10 flex flex-col items-center">
                    {/* Teddy Head */}
                    <div className="w-10 h-8 bg-amber-100 rounded-2xl relative shadow-md border border-amber-200">
                      {/* Ears */}
                      <div className="absolute -top-1.5 -left-1 w-3.5 h-3.5 bg-amber-100 border border-amber-200 rounded-full" />
                      <div className="absolute -top-1.5 -right-1 w-3.5 h-3.5 bg-amber-100 border border-amber-200 rounded-full" />
                      {/* Eyes & Nose details */}
                      <div className="absolute top-2 left-2.5 w-1 h-1 bg-gray-800 rounded-full" />
                      <div className="absolute top-2 right-2.5 w-1 h-1 bg-gray-800 rounded-full" />
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2.5 h-1.5 bg-white rounded-full flex items-center justify-center border border-amber-200">
                        <div className="w-1 h-1 bg-gray-800 rounded-full" />
                      </div>
                    </div>
                  </div>
                )}

                {selectedTheme.name === 'Drizzle & Piping Ring' && (
                  <div className="absolute inset-3 rounded-full border-2 border-dashed border-rose-300/40">
                    <div className="absolute -inset-1 rounded-full border-4 border-rose-100/30" />
                  </div>
                )}

                {/* Custom Toppings Render */}
                {selectedToppings.includes('Rainbow Sprinkles') && (
                  <div id="preview-sprinkles" className="absolute inset-4 overflow-hidden rounded-full pointer-events-none opacity-80">
                    <div className="absolute top-4 left-6 w-1.5 h-3 bg-blue-300 rounded-sm rotate-45" />
                    <div className="absolute top-8 right-8 w-1.5 h-3 bg-pink-300 rounded-sm -rotate-12" />
                    <div className="absolute bottom-6 left-12 w-1.5 h-3 bg-yellow-200 rounded-sm rotate-12" />
                    <div className="absolute bottom-10 right-4 w-1.5 h-3 bg-purple-300 rounded-sm rotate-90" />
                    <div className="absolute top-12 left-1/2 w-3 h-1 bg-green-300 rounded-sm -rotate-45" />
                  </div>
                )}

                {selectedToppings.includes('Edible Silver Pearls') && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[1,2,3,4].map(idx => (
                      <div key={idx} className="absolute w-2 h-2 bg-gradient-to-tr from-gray-200 to-white rounded-full shadow-xs"
                           style={{ top: `${15 + idx * 20}%`, left: `${15 + idx * 15}%` }} />
                    ))}
                  </div>
                )}

                {selectedToppings.includes('Fresh Glazed Cherries') && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 flex space-x-1 pointer-events-none">
                    <div className="w-4.5 h-4.5 bg-red-600 rounded-full relative shadow-md animate-bounce">
                      <div className="absolute -top-1.5 left-2 w-0.5 h-2.5 bg-green-800/80 rounded-sm origin-bottom rotate-12" />
                    </div>
                  </div>
                )}

                {selectedToppings.includes('Edible Gold Glitter') && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                    <div className="absolute top-6 left-10 text-yellow-300 text-[10px] animate-spin">★</div>
                    <div className="absolute bottom-12 right-12 text-yellow-300 text-[8px] animate-pulse">★</div>
                    <div className="absolute top-1/2 left-3/4 text-yellow-200 text-xs">✦</div>
                  </div>
                )}

                {/* Custom Text Overlay */}
                <div className="text-center px-4 max-w-[140px] z-10 select-none">
                  <p 
                    className={`leading-tight font-bold break-all transition-all duration-300 drop-shadow-sm ${selectedFont.value}`}
                    style={{ color: textColor }}
                  >
                    {inputText || 'No Messages'}
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Pricing Summary Breakdown Mini Banner */}
          <div className="mt-6 pt-5 border-t border-amber-100/60 flex justify-between items-center bg-rose-50/50 p-4 rounded-2xl">
            <div>
              <span className="text-xs text-amber-800 font-semibold block uppercase tracking-wider">Calculated Total</span>
              <span className="text-2xl font-black font-sans text-rose-600">₹{totalPrice.toFixed(2)}</span>
            </div>
            
            <span className="text-[11px] text-amber-700/80 bg-white border border-amber-100 px-3 py-1 rounded-full font-medium">
              🍰 Base bento included
            </span>
          </div>
        </div>

        {/* Right Side: Options Form Fields */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-rose-50 shadow-sm space-y-6">
          
          {/* Section 1: Sponge & Flavor */}
          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center space-x-1">
              <span>Step 1. Choose Sponge Flavor</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FLAVORS.map(flavor => (
                <button
                  type="button"
                  key={flavor.id}
                  onClick={() => setSelectedFlavor(flavor)}
                  className={`flex flex-col text-left p-3 rounded-2xl border transition-all ${
                    selectedFlavor.id === flavor.id 
                      ? 'border-rose-300 bg-pink-50/40 shadow-xs ring-1 ring-rose-300' 
                      : 'border-gray-100 hover:border-rose-200 bg-gray-50/40'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-semibold text-gray-800 text-sm">{flavor.name}</span>
                    {flavor.price > 0 && (
                      <span className="text-xs font-bold text-rose-600 bg-white px-2 py-0.5 rounded-full border border-pink-100">
                        +₹{flavor.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{flavor.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Choose Cake Size */}
          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center space-x-1">
              <span>Step 2. Select Cake Size</span>
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {CAKE_SIZES.map(sz => (
                <button
                  type="button"
                  key={sz.value}
                  onClick={() => setSelectedSize(sz)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                    selectedSize.value === sz.value 
                      ? 'border-rose-300 bg-pink-50/40 shadow-xs ring-1 ring-rose-300' 
                      : 'border-gray-100 hover:border-rose-200 bg-gray-50/40'
                  }`}
                >
                  <div>
                    <span className="font-bold text-gray-800 text-sm block">{sz.label}</span>
                    <span className="text-xs text-gray-400">{sz.desc}</span>
                  </div>
                  <span className="text-xs font-black text-rose-600 bg-white border border-rose-100 px-3 py-1 rounded-full">
                    {sz.addedPrice === 0 ? 'Included' : `+₹${sz.addedPrice.toFixed(2)}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Frosting Swatch Color */}
          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center space-x-1">
              <span>Step 3. Buttercream Frosting Color</span>
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {FROSTING_COLORS.map(color => (
                <button
                  type="button"
                  key={color.name}
                  onClick={() => setSelectedFrosting(color)}
                  className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-2xl border transition-all ${
                    selectedFrosting.name === color.name 
                      ? 'border-rose-400 ring-2 ring-rose-200 font-semibold' 
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full ${color.bgClass} border border-black/10`} />
                  <span className="text-xs text-gray-700">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Outer Cream/Type Filling */}
          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center space-x-1">
              <span>Step 4. Piped Cream Texture Type</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {CREAM_TYPES.map(cream => (
                <button
                  type="button"
                  key={cream.name}
                  onClick={() => setSelectedCream(cream)}
                  className={`flex flex-col text-left p-3 rounded-2xl border transition-all ${
                    selectedCream.name === cream.name 
                      ? 'border-rose-300 bg-pink-50/40 shadow-xs ring-1 ring-rose-300' 
                      : 'border-gray-100 hover:border-rose-200 bg-gray-50/40'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-semibold text-gray-800 text-xs">{cream.name}</span>
                    {cream.price && (
                      <span className="text-[10px] font-bold text-rose-600 bg-white px-2 py-0.5 rounded-full border border-pink-100">
                        +₹{cream.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">{cream.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: Theme & Piping Border Styles */}
          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center space-x-1">
              <span>Step 5. Select Artistic Piping Theme</span>
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {THEME_DESIGNS.map(theme => (
                <button
                  type="button"
                  key={theme.name}
                  onClick={() => setSelectedTheme(theme)}
                  className={`flex items-center space-x-3 p-2.5 rounded-2xl border transition-all text-left ${
                    selectedTheme.name === theme.name 
                      ? 'border-rose-300 bg-pink-50/40 shadow-xs ring-1 ring-rose-300' 
                      : 'border-gray-100 hover:border-rose-200 bg-gray-50/40'
                  }`}
                >
                  <img src={theme.img} alt={theme.name} className="w-12 h-12 rounded-xl object-cover shadow-xs border border-rose-100/40" />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-gray-800 text-xs block">{theme.name}</span>
                    <span className="text-[11px] text-gray-400 truncate block">{theme.desc}</span>
                  </div>
                  <span className="text-xs font-semibold text-rose-600 bg-white border border-rose-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {theme.price === 0 ? 'Included' : `+₹${theme.price.toFixed(2)}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 6: Custom Piping Text, Font, Color */}
          <div className="bg-[#FFFDF6] p-4.5 rounded-2xl border border-amber-100 space-y-4">
            <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center space-x-1">
              <Sparkle className="w-3.5 h-3.5 text-amber-500" />
              <span>Step 6. Personalize Piped Cake Text</span>
            </h4>

            <div>
              <label className="block text-[11px] font-bold text-amber-800 mb-1">Your Custom Text Message (Max 26 Chars)</label>
              <input
                type="text"
                maxLength={26}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. Happy B-day!"
                className="w-full px-4 py-2.5 bg-white border border-amber-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 font-mono text-sm text-amber-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-amber-800 mb-1">Font Script Vibe</label>
                <div className="grid grid-cols-1 gap-2">
                  {FONTS.map(f => (
                    <button
                      type="button"
                      key={f.name}
                      onClick={() => setSelectedFont(f)}
                      className={`px-3 py-1.5 border rounded-xl text-left text-xs transition-colors ${
                        selectedFont.name === f.name 
                          ? 'border-amber-400 bg-amber-50 text-amber-900 font-bold' 
                          : 'border-white bg-white/60 hover:bg-white text-gray-500'
                      }`}
                    >
                      <span className={f.value}>{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-amber-800 mb-1">Cream Lettering Color</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Pink Ink', hex: '#8C4A60' },
                    { name: 'Espresso Fudge', hex: '#3E2723' },
                    { name: 'Pastel Yellow', hex: '#FBC02D' },
                    { name: 'Deep Indigo', hex: '#1A237E' },
                    { name: 'Snow Cream', hex: '#FFFFFF' },
                    { name: 'Dark Charcoal', hex: '#212121' },
                  ].map(tc => (
                    <button
                      type="button"
                      key={tc.name}
                      onClick={() => setTextColor(tc.hex)}
                      className={`w-7.5 h-7.5 rounded-full border border-black/10 flex items-center justify-center transition-transform ${
                        textColor === tc.hex ? 'scale-115 ring-2 ring-amber-400' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: tc.hex }}
                      title={tc.name}
                    >
                      {textColor === tc.hex && (
                        <span className="text-[10px] drop-shadow-sm" style={{ color: tc.hex === '#FFFFFF' ? '#000000' : '#FFFFFF' }}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 7: Decorative toppings */}
          <div>
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center space-x-1">
              <span>Step 7. Decorative Toppings &amp; Accents</span>
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {TOPPINGS.map(topping => {
                const isSelected = selectedToppings.includes(topping.name);
                return (
                  <button
                    type="button"
                    key={topping.name}
                    onClick={() => handleToppingToggle(topping.name)}
                    className={`flex items-center space-x-2 p-2 rounded-xl border text-left transition-colors ${
                      isSelected 
                        ? 'border-rose-300 bg-pink-50/40 font-semibold ring-1 ring-rose-300' 
                        : 'border-gray-50 bg-gray-50/40 hover:bg-gray-100/50'
                    }`}
                  >
                    <span className="text-lg">{topping.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-gray-800 block truncate">{topping.name}</span>
                      <span className="text-[10px] text-rose-500 font-bold">+₹{topping.price.toFixed(2)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 8: Upload Inspiration Image or Presets */}
          <div className="border border-dashed border-rose-200/60 p-4.5 rounded-2xl bg-pink-50/10 space-y-3.5">
            <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center space-x-1.5">
              <ImageIcon className="w-4 h-4 text-rose-400" />
              <span>Step 8. Upload Icing Inspiration Image</span>
            </h4>
            
            <p className="text-xs text-gray-400 leading-snug">
              Have a specific Korean style grid board or lettering draft in mind? Upload it here! Deepika will inspect it to align her icing process.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* File Input */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-1/2 min-h-[96px] bg-white border-2 border-dashed border-rose-100 hover:border-rose-300 rounded-2xl cursor-pointer flex flex-col items-center justify-center p-3 text-center transition-colors"
              >
                <Upload className="w-5 h-5 text-rose-400 mb-1" />
                <span className="text-xs text-gray-500 font-medium">Click to select photo</span>
                <span className="text-[9px] text-gray-400 block mt-0.5">JPEG, PNG up to 5MB</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {/* Presets Grid */}
              <div className="w-full sm:w-1/2 space-y-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Or select aesthetic preset idea</span>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_INSPIRATIONS.map(preset => (
                    <button
                      type="button"
                      key={preset.name}
                      onClick={() => selectPresetInspiration(preset.url, preset.name)}
                      className={`relative aspect-square rounded-lg overflow-hidden border transition-transform ${
                        selectedPreset === preset.name 
                          ? 'border-rose-400 scale-105 ring-2 ring-rose-200' 
                          : 'border-gray-200 hover:scale-102'
                      }`}
                      title={preset.name}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      {selectedPreset === preset.name && (
                        <div className="absolute inset-0 bg-rose-500/10 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white fill-rose-500" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Uploaded Indicator state bar */}
            {uploadedImage && (
              <div className="p-2.5 bg-green-50 border border-green-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-green-100 shrink-0">
                    <img src={uploadedImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-green-800 font-bold block truncate">Custom Inspiration Attached</span>
                    <span className="text-[9px] text-green-600 block">Deepika will check prior to baking</span>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => { setUploadedImage(null); setSelectedPreset(null); }}
                  className="text-[10px] text-red-500 hover:underline font-semibold"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Add To Cart CTA Button */}
          <button
            type="button"
            onClick={handleAddToCartSubmit}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm sm:text-base rounded-2xl hover:brightness-105 shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Add Custom Bento to Oven Cart — ₹{totalPrice.toFixed(2)}</span>
          </button>

        </div>
      </div>
    </div>
  );
};
