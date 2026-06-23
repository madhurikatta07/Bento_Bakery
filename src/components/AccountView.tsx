/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { STANDARD_BAKERY_CAKES } from '../data';
import { User, Heart, MapPin, ListOrdered, Calendar, Archive, Trash2, Key, ShoppingCart, Info, LogIn, LogOut } from 'lucide-react';

export const AccountView: React.FC = () => {
  const { currentUser, orders, wishlist, toggleWish, addToCart, setView, loginUser, logoutUser } = useAppState();
  const [toggleLoginInput, setToggleLoginInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  
  // New address state helper
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newZip, setNewZip] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toggleLoginInput.trim()) return;
    await loginUser(toggleLoginInput, nameInput.trim() || 'Cute Baker');
    setToggleLoginInput('');
    setNameInput('');
  };

  const handleQuickFill = async (email: string, name: string) => {
    await loginUser(email, name);
  };

  const handleAddWishToCart = (cakeName: string) => {
    // Find matching premade or default custom
    const match = STANDARD_BAKERY_CAKES.find(c => c.name === cakeName);
    if (match) {
      addToCart({
        isCustom: false,
        standardCake: match,
        name: match.name,
        price: match.price,
        quantity: 1,
        imageUrl: match.imageUrl
      });
    } else {
      // Add custom with default setup
      addToCart({
        isCustom: true,
        customDetails: {
          flavor: 'Classic Vanilla Bean',
          size: 'Mini 4" (Bento Cake)',
          frostingColor: 'Pastel Pink',
          creamType: 'Signature Buttercream',
          themeDesign: 'Minimalist Aesthetic',
          customText: 'Sweet Day',
          fontStyle: 'Cursive Elegance',
          textColor: '#8C4A60',
          toppings: [],
          inspirationImage: null,
          price: 250.00
        },
        name: `B bespoke Bento - ${cakeName}`,
        price: 250.00,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop&q=80'
      });
    }
    setView('cart');
  };

  const getOrderStatusText = (status: string) => {
    switch(status) {
      case 'Pending': return '⏳ Queued';
      case 'Preparing': return '🎂 Baking in Oven';
      case 'Out for Delivery': return '🛵 Courier Delivery';
      case 'Delivered': return '🌸 Delivered';
      default: return 'Cancelled';
    }
  };

  // If user not signed in, show a cute login gateway
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-12 px-6 sm:px-8 bg-white rounded-3xl border border-rose-100/40 shadow-md text-center space-y-6">
        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto text-pink-500 animate-bounce">
          <User className="w-8 h-8" />
        </div>
        
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-800">Your Baking Account</h2>
          <p className="text-gray-400 text-xs mt-1 leading-snug">
            Please log in or register to log orders, build address binders, and view your cake wishlist history!
          </p>
        </div>

        <form onSubmit={handleLocalLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Your Lovely Name</label>
            <input
              type="text"
              placeholder="e.g. Deepika"
              className="w-full px-4 py-2.5 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 text-xs sm:text-sm text-gray-800 focus:border-rose-400"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Your Email Address <span className="text-pink-500">*</span></label>
            <input
              type="email"
              required
              placeholder="e.g. deepika@cakesandcreams.com"
              className="w-full px-4 py-2.5 border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 text-xs sm:text-sm text-gray-800 focus:border-rose-400"
              value={toggleLoginInput}
              onChange={(e) => setToggleLoginInput(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-2 cursor-pointer transition-all shadow-sm active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            <span>Enter Studio Portal</span>
          </button>
        </form>

        <div className="pt-2 border-t border-gray-100 space-y-2">
          <p className="text-[10px] text-gray-400 font-bold block text-left uppercase tracking-wider text-center">Quick Connect Options</p>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleQuickFill('customer@cakesandcreams.com', 'Sweet Customizer')}
              className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl text-left flex items-center justify-between border border-rose-100"
            >
              <span>Connect Customer Sandbox</span>
              <span className="text-[9px] bg-white px-2 py-0.5 rounded border border-rose-100 font-bold">Quick Fill</span>
            </button>
            <button
              onClick={() => handleQuickFill('madhukatta0731@gmail.com', 'Deepika Admin')}
              className="px-3.5 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100/80 rounded-xl text-left flex items-center justify-between border border-amber-100"
            >
              <span>Connect Admin Portal (Madhukatta)</span>
              <span className="text-[9px] bg-white px-2 py-0.5 rounded border border-amber-100 font-bold">Admin Live</span>
            </button>
          </div>
        </div>

        <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-[10px] text-rose-700 leading-snug text-left select-none">
          💡 Want to see दीपिका's (Deepika) management terminal? Back and sign in as <strong className="font-black text-rose-600">madhukatta0731@gmail.com</strong> of Cakes &amp; Creams!
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 select-none">
      
      {/* Upper Account Detail card */}
      <div className="bg-gradient-to-r from-pink-50 to-amber-50 rounded-3xl p-6 sm:p-8 border border-pink-100/50 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-xs border border-pink-100 animate-pulse">
            🧁
          </div>
          <div>
            <h2 className="font-serif text-2xl font-black text-gray-800">{currentUser.displayName}</h2>
            <p className="text-xs text-rose-600 font-bold">{currentUser.email}</p>
            <span className="inline-block px-2.5 py-0.5 mt-2 bg-rose-100 text-rose-700 text-[9px] font-black rounded uppercase tracking-widest leading-none">
              Role: {currentUser.role} Account
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setView('admin')}
              className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
            >
              Enter Deepika Admin Dashboard
            </button>
          )}

          <button
            onClick={logoutUser}
            className="px-5 py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center space-x-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out / Log Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Orders and Wishlist */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Orders History */}
          <div className="bg-white p-5 rounded-3xl border border-rose-50/40 shadow-xs space-y-5">
            <h3 className="font-serif text-lg font-bold text-gray-800 border-b border-rose-50 pb-3 flex items-center space-x-1.5">
              <ListOrdered className="w-5 h-5 text-gray-500" />
              <span>Celebration Order History ({orders.filter(o => o.customerInfo.email === currentUser.email).length})</span>
            </h3>

            {orders.filter(o => o.customerInfo.email === currentUser.email).length === 0 ? (
              <div className="p-8 text-center text-gray-400 bg-gray-50/40 rounded-2xl">
                <Archive className="w-12 h-12 text-gray-350 mx-auto mb-2" />
                <p className="font-semibold text-gray-700 text-sm">No Cakes Baked Yet!</p>
                <p className="text-[10px] text-gray-400 mt-1">Make a Custom Bento Design or select standard recipes!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.filter(o => o.customerInfo.email === currentUser.email).map((order) => (
                  <div key={order.id} className="p-4 border border-rose-100/40 rounded-2xl space-y-3 hover:border-rose-200 transition-colors bg-white shadow-xs">
                    
                    <div className="flex justify-between items-start border-b border-gray-50 pb-2 flex-wrap gap-2 text-xs">
                      <div>
                        <span className="text-gray-400 block font-semibold block uppercase">Oven Serial-ID</span>
                        <span className="font-mono font-bold text-gray-800">{order.id}</span>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-gray-400 block font-semibold uppercase">Timeline Target</span>
                        <span className="font-bold text-amber-800 flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{order.deliveryDate}</span>
                        </span>
                      </div>
                    </div>

                    {/* Cake specs list */}
                    <div className="space-y-1.5 text-xs">
                      {order.items.map((item, id) => (
                        <div key={id} className="flex justify-between font-medium">
                          <span>
                            <strong className="text-gray-900 font-bold">x{item.quantity}</strong> {item.name}{' '}
                            {item.isCustom && item.customDetails && (
                              <span className="text-[10px] text-amber-700 block italic leading-none mt-1">
                                ({item.customDetails.size} &bull; Frosting: {item.customDetails.frostingColor} &bull; Lettering: "{item.customDetails.customText}")
                              </span>
                            )}
                          </span>
                          <span className="font-semibold text-gray-700 font-sans">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-gray-55/60 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold leading-none">Baking Status</span>
                        <strong className="text-rose-600 block mt-1 font-bold">{getOrderStatusText(order.status)}</strong>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold leading-none">Total Value</span>
                        <span className="font-black text-rose-500 font-sans text-sm">₹{order.total.toFixed(2)}</span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist Board */}
          <div className="bg-white p-5 rounded-3xl border border-rose-50/40 shadow-xs space-y-5">
            <h3 className="font-serif text-lg font-bold text-gray-800 border-b border-rose-50 pb-3 flex items-center space-x-1.5">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-50" />
              <span>My Cake Wishlist ({wishlist.length})</span>
            </h3>

            {wishlist.length === 0 ? (
              <p className="p-6 text-center text-gray-400 bg-gray-50/40 rounded-2xl text-xs sm:text-sm">
                No bento recipes added! Go and click ❤ on cakes to pin draft lists here.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishlist.map((cakeName) => {
                  const premade = STANDARD_BAKERY_CAKES.find(c => c.name === cakeName);
                  return (
                    <div key={cakeName} className="p-3 border border-rose-100 rounded-2xl flex items-center justify-between gap-3 bg-[#FFFDF9]">
                      <div className="flex items-center space-x-3 truncate">
                        <div className="w-12 h-12 rounded-lg bg-pink-50 border border-pink-100 overflow-hidden shrink-0">
                          <img src={premade ? premade.imageUrl : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop&q=80'} alt={cakeName} className="w-full h-full object-cover" />
                        </div>
                        <div className="truncate">
                          <span className="font-semibold text-gray-800 text-xs block leading-tight truncate">{cakeName}</span>
                          <span className="text-[10px] text-rose-500 block leading-tight pt-1 font-semibold">₹{premade ? premade.price.toFixed(2) : '250.00 Base'}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2 shrink-0">
                        <button
                          onClick={() => handleAddWishToCart(cakeName)}
                          className="p-1 px-1.5 bg-rose-500 text-white rounded hover:bg-rose-600"
                          title="Add to Oven Cart"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleWish(cakeName)}
                          className="p-1 text-gray-300 hover:text-red-500 rounded hover:bg-red-50"
                          title="Remove Wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Side Address Book */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-rose-50/40 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-gray-800 border-b border-rose-50 pb-2.5 flex items-center space-x-1.5">
            <MapPin className="w-5 h-5 text-rose-400" />
            <span>Saved Deliver Book</span>
          </h3>

          <div className="space-y-3.5">
            {currentUser.savedAddresses && currentUser.savedAddresses.map((addr) => (
              <div key={addr.id} className="p-3 bg-rose-50/20 border border-rose-100 rounded-xl relative text-xs">
                <p className="font-bold text-gray-800">{addr.street}</p>
                <p className="text-gray-500 mt-0.5">{addr.city}, {addr.state} {addr.zip}</p>
                
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-white text-[8px] uppercase tracking-widest border border-rose-100 leading-none text-rose-600 font-bold rounded">
                  Default Ship
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 select-none">
            <p className="text-[9px] text-gray-400 leading-snug flex items-start">
              <Info className="w-3.5 h-3.5 text-rose-400 mr-1 shrink-0" />
              <span>Addresses are updated at checkout and stored securely in Firebase Firestore.</span>
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
