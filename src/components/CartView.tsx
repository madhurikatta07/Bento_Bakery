/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { ShoppingBag, Trash2, Tag, Gift, Percent, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';

export const CartView: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, applyPromoCode, appliedDiscount, setView } = useAppState();
  const [promoInput, setPromoInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!promoInput.trim()) return;

    const result = applyPromoCode(promoInput);
    if (result.success) {
      setCouponSuccess(result.message);
      setPromoInput('');
    } else {
      setCouponError(result.message);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = appliedDiscount ? Math.round((subtotal * appliedDiscount.percent / 100) * 100) / 100 : 0;
  const deliveryEstimated = 40.00; // default estimated
  const estimatedTotal = subtotal + deliveryEstimated - discountAmount;

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 px-4 space-y-4">
        <div className="w-20 h-20 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-gray-800">Your Oven Cart is Empty</h2>
        <p className="text-gray-400 text-xs sm:text-sm">
          You haven\'t added any sweet bento treats or custom designed cakes to your oven basket yet. Let\'s bake something beautiful together!
        </p>
        <button
          onClick={() => setView('customize')}
          className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-sm cursor-pointer inline-flex items-center space-x-1"
        >
          <span>Start Designing Bento</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Checkout Progress Stepper */}
      <div className="flex items-center justify-center space-x-3 mb-10 text-xs font-bold text-gray-400 select-none">
        <span className="text-rose-600 border-b-2 border-rose-500 pb-1">1. Review Cart</span>
        <span className="text-gray-300">&bull;&bull;&bull;</span>
        <span>2. Place Order &amp; Schedule</span>
        <span className="text-gray-300">&bull;&bull;&bull;</span>
        <span>3. Success Receipt</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Cart Items List */}
        <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-rose-50/40 shadow-xs space-y-6">
          <h3 className="font-serif text-xl font-bold text-gray-800 border-b border-rose-50 pb-3 flex items-center space-x-1.5">
            <span>🍰 Oven Tray Items</span>
          </h3>

          <div className="divide-y divide-rose-50/60">
            {cart.map((item) => (
              <div key={item.id} className="py-4.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                
                {/* Image and specs */}
                <div className="flex items-center space-x-4 min-w-0">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-rose-50 border border-rose-100 shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base leading-tight block truncate">{item.name}</h4>
                    
                    {item.isCustom && item.customDetails ? (
                      <div className="text-[10px] text-amber-700/85 mt-1 space-y-0.5 font-medium leading-none">
                        <p>{item.customDetails.size} &bull; {item.customDetails.flavor} Sponge</p>
                        <p>Frosting: {item.customDetails.frostingColor} &bull; Cream: {item.customDetails.creamType}</p>
                        <p className="bg-amber-100 text-amber-900 px-1 rounded block w-fit mt-1">Text: "{item.customDetails.customText}"</p>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-400 block mt-1">Pre-made Baker Special</span>
                    )}
                  </div>
                </div>

                {/* Pricing, Qty, Actions */}
                <div className="flex items-center justify-between sm:justify-start gap-5 w-full sm:w-auto shrink-0 select-none">
                  {/* Quantity adjustment buttons */}
                  <div className="flex items-center space-x-1 border border-pink-100 rounded-xl bg-gray-50/50 p-1">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-gray-400 hover:text-rose-500 focus:outline-none"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-7 text-center text-xs font-bold text-gray-700">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-gray-400 hover:text-rose-500 focus:outline-none"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Individual subtotal */}
                  <span className="font-bold text-rose-600 font-sans text-sm sm:text-base whitespace-nowrap min-w-[70px] text-right">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>

                  {/* Detach action */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Go Back Trigger */}
          <button
            onClick={() => setView('customize')}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customize More Cakes</span>
          </button>
        </div>

        {/* Right Side: Totals and Promo box */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Promo code submission block */}
          <div className="bg-[#FFFDF9] border border-amber-100 p-4.5 rounded-3xl space-y-3.5">
            <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center space-x-1">
              <Percent className="w-3.5 h-3.5 text-amber-500" />
              <span>Apply Discount Voucher</span>
            </h4>

            <form onSubmit={handleApplyPromo} className="flex space-x-2">
              <input
                type="text"
                placeholder="e.g. BENTO10"
                className="flex-1 px-3 py-2 bg-white border border-amber-100 rounded-xl text-xs uppercase focus:outline-none focus:ring-1 focus:ring-amber-300 font-mono text-amber-900"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {/* Success Coupon badge */}
            {couponSuccess && (
              <p className="text-[10px] text-green-700 font-bold bg-green-50 p-2 rounded-lg border border-green-100">
                ✓ {couponSuccess}
              </p>
            )}

            {/* Error badge */}
            {couponError && (
              <p className="text-[10px] text-red-650 font-bold bg-red-100/5 p-2 rounded-lg border border-red-200">
                ❌ {couponError}
              </p>
            )}

            <div className="text-[10px] text-amber-800/80 leading-snug">
              💡 Use: <strong className="font-bold">BENTO10</strong> (10% off custom), or <strong className="font-bold">WELCOME15</strong> (15% off first bento)!
            </div>
          </div>

          {/* Subtotal Checkout Price Receipt box */}
          <div className="bg-white p-5 rounded-3xl border border-rose-50 shadow-xs space-y-4">
            <h4 className="font-serif text-base font-bold text-gray-800 border-b border-rose-50 pb-2.5">Oven Bill Details</h4>
            
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Tray Subtotal</span>
                <span className="font-bold text-gray-800 font-sans">₹{subtotal.toFixed(2)}</span>
              </div>

              {appliedDiscount && (
                <div className="flex justify-between text-rose-550 bg-pink-50/50 p-2 rounded-lg border border-pink-100/50">
                  <span className="flex items-center font-bold">
                    <Gift className="w-3.5 h-3.5 mr-1" />
                    Code "{appliedDiscount.code}" Applied
                  </span>
                  <span className="font-black font-sans">-₹{discountAmount.toFixed(2)} (-{appliedDiscount.percent}%)</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Est. Delivery Courier</span>
                <span className="font-bold text-gray-800 font-sans">₹{deliveryEstimated.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-3.5 border-t border-rose-50 flex justify-between items-center bg-rose-505 bg-pink-50/30 p-2 rounded-xl">
              <span className="text-xs font-bold text-rose-950 block uppercase tracking-wider">Estimated Total</span>
              <span className="text-xl font-black font-sans text-rose-600">₹{estimatedTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={() => setView('checkout')}
              className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center space-x-1 w-full cursor-pointer"
            >
              <span>Proceed to Delivery Info</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
