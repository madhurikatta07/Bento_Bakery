/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/AppContext';
import { DeliveryScheduler } from './DeliveryScheduler';
import { CreditCard, Truck, Check, Sparkles, ArrowLeft, ShieldCheck, ClipboardCheck } from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const { cart, appliedDiscount, placeOrder, setView, currentUser } = useAppState();

  // Customer state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Address State
  const [street, setStreet] = useState('12 Bakery Road, Koramangala');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [zip, setZip] = useState('560034');

  // Delivery Scheduler State
  const [deliveryDate, setDeliveryDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [deliverySlot, setDeliverySlot] = useState('11:00 AM - 01:00 PM (Lunch Special)');
  const [deliveryType, setDeliveryType] = useState<'standard' | 'fast'>('standard');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');

  // Success flow state
  const [placedReceipt, setPlacedReceipt] = useState<any | null>(null);

  // Pre-fill if user logged in
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.displayName);
      setEmail(currentUser.email);
      if (currentUser.savedAddresses && currentUser.savedAddresses.length > 0) {
        const defAddr = currentUser.savedAddresses[0];
        setStreet(defAddr.street);
        setCity(defAddr.city);
        setState(defAddr.state);
        setZip(defAddr.zip);
      }
    }
  }, [currentUser]);

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCost = deliveryType === 'fast' ? 80.00 : 40.00;
  const discountAmount = appliedDiscount ? Math.round((subtotal * appliedDiscount.percent / 100) * 100) / 100 : 0;
  const finalTotal = subtotal + deliveryCost - discountAmount;

  const handlePlaceOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !street.trim()) return;

    const shippingAddress = {
      id: `addr_${Date.now()}`,
      street,
      city,
      state,
      zip
    };

    const contactInfo = { name, email, phone };
    const deliverySpec = {
      date: deliveryDate,
      slot: deliverySlot,
      type: deliveryType,
      instructions: deliveryInstructions
    };

    const placedOrder = await placeOrder(shippingAddress, contactInfo, deliverySpec, paymentMethod);
    setPlacedReceipt(placedOrder);
  };

  // SUCCESS OUTCOME SCREEN
  if (placedReceipt) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 selection:bg-rose-100">
        <div className="bg-white border border-rose-100 rounded-3xl overflow-hidden shadow-2xl">
          {/* Confetti Ribbon */}
          <div className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 p-8 text-center text-white relative">
            <div className="absolute top-4 left-4 text-xs animate-bounce select-none">🎂 ✨</div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Check className="w-8 h-8 text-white stroke-[3.5]" />
            </div>
            <h2 className="font-serif text-3xl font-bold">Oven Reserved!</h2>
            <p className="text-xs text-rose-100 mt-1 uppercase tracking-widest font-semibold">Your cake order was placed successfully</p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Receipt Summary Box */}
            <div className="bg-rose-50/30 p-4.5 rounded-2xl border border-rose-100/40 space-y-3.5">
              <div className="flex justify-between text-xs text-gray-400 font-bold border-b border-rose-50 pb-2">
                <span>INVOICE COORDINATES:</span>
                <span className="font-mono text-gray-600">{placedReceipt.id}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block font-semibold uppercase tracking-wider">DELIVERY TARGET:</span>
                  <p className="font-bold text-gray-800 mt-1">{placedReceipt.customerInfo.name}</p>
                  <p className="text-gray-500 mt-0.5">{placedReceipt.shippingAddress.street}</p>
                  <p className="text-gray-500">{placedReceipt.shippingAddress.city}, {placedReceipt.shippingAddress.state} {placedReceipt.shippingAddress.zip}</p>
                </div>

                <div>
                  <span className="text-gray-400 block font-semibold uppercase tracking-wider">SCHEDULED SLOT:</span>
                  <p className="font-bold text-amber-800 mt-1">{placedReceipt.deliveryDate}</p>
                  <p className="text-gray-500 mt-0.5">{placedReceipt.deliveryTimeSlot.split('(')[0]}</p>
                  <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 mt-1 rounded block w-fit font-bold uppercase select-none leading-none">
                    {placedReceipt.deliveryType} Delivery
                  </span>
                </div>
              </div>

              {placedReceipt.deliveryInstructions && (
                <div className="pt-2 border-t border-rose-50 text-xs text-gray-500">
                  <strong className="text-gray-700">Instructions:</strong> "{placedReceipt.deliveryInstructions}"
                </div>
              )}
            </div>

            {/* Cake details breakdown */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">Dessert Tray Breakdown</span>
              <div className="space-y-1.5 divide-y divide-gray-50 max-h-48 overflow-y-auto no-scrollbar pr-1">
                {placedReceipt.items.map((cartItem: any, index: number) => (
                  <div key={index} className="flex justify-between text-xs py-2 first:pt-0">
                    <div>
                      <span className="font-bold text-gray-800">x{cartItem.quantity}</span> {cartItem.name}
                    </div>
                    <span className="font-bold font-sans text-rose-500">₹{(cartItem.price * cartItem.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill pricing receipt stack */}
            <div className="border-t border-rose-50 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Cake Items subtotal</span>
                <span>₹{placedReceipt.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                <span>₹{placedReceipt.deliveryCharge.toFixed(2)}</span>
              </div>
              {placedReceipt.discount > 0 && (
                <div className="flex justify-between text-rose-600 font-bold bg-pink-50 p-1 rounded">
                  <span>Promotional Savings</span>
                  <span>-₹{placedReceipt.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black border-t border-rose-50 pt-3 text-rose-600 font-sans">
                <span>Grand Total Paid</span>
                <span>₹{placedReceipt.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex space-x-3 select-none pt-2">
              <button
                onClick={() => setView('account')}
                className="flex-1 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs sm:text-sm rounded-xl transition-colors text-center inline-flex items-center justify-center space-x-1"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>Order History Portal</span>
              </button>
              
              <button
                onClick={() => setView('home')}
                className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors text-center cursor-pointer"
              >
                Back to Bakery Story
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // STANDARD CHECKOUT SUBMISSION VIEWS
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Checkout Progress Stepper */}
      <div className="flex items-center justify-center space-x-3 mb-10 text-xs font-bold text-gray-400 select-none">
        <span className="text-gray-400 hover:text-rose-500 cursor-pointer" onClick={() => setView('cart')}>1. Review Cart</span>
        <span>&bull;&bull;&bull;</span>
        <span className="text-rose-600 border-b-2 border-rose-500 pb-1">2. Place Order &amp; Schedule</span>
        <span>&bull;&bull;&bull;</span>
        <span className="text-gray-300">3. Success Receipt</span>
      </div>

      <form onSubmit={handlePlaceOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand: Fields form */}
        <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-rose-50/40 shadow-xs space-y-6">
          <h3 className="font-serif text-xl font-bold text-gray-800 border-b border-rose-50/60 pb-3 flex items-center space-x-1.5">
            <span>👤 Recipient Demographics</span>
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Receipt Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deepika"
                  className="w-full px-4 text-xs sm:text-sm py-2.5 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 text-gray-800"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Receipt Email <span className="text-red-400">*</span></label>
                <input
                  type="email"
                  required
                  placeholder="e.g. deepika@mail.com"
                  className="w-full px-4 text-xs sm:text-sm py-2.5 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 text-gray-800"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">Mobile Contact Phone Number <span className="text-red-400">*</span></label>
              <input
                type="tel"
                required
                placeholder="e.g. 555-0199 (For delivery driver arrival coordination)"
                className="w-full px-4 text-xs sm:text-sm py-2.5 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 text-gray-800"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <h3 className="font-serif text-xl font-bold text-gray-800 border-b border-rose-50/60 pt-6 pb-3 flex items-center space-x-1.5">
            <span>📍 Dispatch Location Address</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">Street Address <span className="text-red-400">*</span></label>
              <input
                type="text"
                required
                placeholder="e.g. 123 Bakery Lane"
                className="w-full px-4 text-xs sm:text-sm py-2.5 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 text-gray-800"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-gray-500 mb-1">City <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sweetwater"
                  className="w-full px-4 text-xs sm:text-sm py-2.5 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 text-gray-800"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">State <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="CA"
                  className="w-full px-4 text-xs sm:text-sm py-2.5 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 text-gray-800"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">ZIP Code <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="90210"
                  className="w-full px-4 text-xs sm:text-sm py-2.5 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 text-gray-800"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Dedicated Scheduled Delivery integrated */}
          <DeliveryScheduler
            selectedDate={deliveryDate}
            setSelectedDate={setDeliveryDate}
            selectedSlot={deliverySlot}
            setSelectedSlot={setDeliverySlot}
            deliveryType={deliveryType}
            setDeliveryType={setDeliveryType}
            instructions={deliveryInstructions}
            setInstructions={setDeliveryInstructions}
          />

          <h3 className="font-serif text-xl font-bold text-gray-800 border-b border-rose-50/60 pt-6 pb-3 flex items-center space-x-1.5">
            <span>💳 Payment Information</span>
          </h3>

          <div className="space-y-4">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 p-3.5 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'card' 
                    ? 'border-rose-300 bg-pink-100/10 font-bold text-rose-650 ring-1 ring-rose-300' 
                    : 'border-gray-55/60 text-gray-500 hover:border-rose-200'
                }`}
              >
                Credit Card
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`flex-1 p-3.5 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'cod' 
                    ? 'border-rose-300 bg-pink-100/10 font-bold text-rose-650 ring-1 ring-rose-300' 
                    : 'border-gray-55/60 text-gray-500 hover:border-rose-250'
                }`}
              >
                Cash on Delivery
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-2xl space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-550 mb-1">Card Number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-200 font-mono text-sm text-gray-800"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-555 mb-1">Expiration</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-white border border-gray-200/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-200 font-mono text-xs text-gray-800"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-555 mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={3}
                      className="w-full px-4 py-2 bg-white border border-gray-200/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-200 font-mono text-xs text-gray-800"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right hand: Summary checkout order bill */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-rose-50 shadow-xs space-y-4 select-none">
            <h4 className="font-serif text-base font-bold text-gray-800 border-b border-rose-50 pb-2 flex items-center space-x-1">
              <span>Tray Checkout Bill</span>
            </h4>

            <div className="space-y-2.5 text-xs text-gray-600 max-h-48 overflow-y-auto no-scrollbar pr-1">
              {cart.map((cartItem) => (
                <div key={cartItem.id} className="flex justify-between leading-tight py-1 border-b border-dashed border-rose-50/50">
                  <span className="truncate pr-2">
                    <strong className="text-gray-900 font-bold">x{cartItem.quantity}</strong> {cartItem.name}
                  </span>
                  <span className="font-bold text-rose-550 font-sans whitespace-nowrap">₹{(cartItem.price * cartItem.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-gray-600 pt-2">
              <div className="flex justify-between">
                <span>Items total</span>
                <span className="font-bold text-gray-800 font-sans">₹{subtotal.toFixed(2)}</span>
              </div>
              
              {appliedDiscount && (
                <div className="flex justify-between text-rose-600 font-bold bg-pink-50 p-1.5 rounded">
                  <span>Savings ({appliedDiscount.code})</span>
                  <span className="font-sans">-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Selected Delivery Fee</span>
                <span className="font-bold text-gray-800 font-sans">₹{deliveryCost.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-3.5 border-t border-rose-50 flex justify-between items-center bg-pink-50/30 p-2.5 rounded-xl">
              <span className="text-xs font-bold text-rose-950 block uppercase tracking-wider">Grand Total</span>
              <span className="text-xl font-black font-sans text-rose-600">₹{finalTotal.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md hover:brightness-105 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <ClipboardCheck className="w-5 h-5 text-white" />
              <span>Confirm &amp; Place Cake Order</span>
            </button>
            
            <p className="text-[10px] text-gray-400 text-center leading-snug">
              🔒 Safeguarded baking process. Deepika oversees fulfillment on Cake dispatch.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setView('cart')}
            className="w-full py-3 bg-white border border-rose-100 hover:bg-rose-50 text-rose-600 font-bold text-xs rounded-2xl text-center flex items-center justify-center space-x-1 select-none"
          >
            <ArrowLeft className="w-4 h-4 text-rose-400" />
            <span>Go Back to Oven Tray</span>
          </button>
        </div>

      </form>
    </div>
  );
};
