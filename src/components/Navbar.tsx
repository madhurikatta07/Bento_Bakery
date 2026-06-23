/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { ShoppingCart, User, HelpCircle, Heart, Key, LogOut, Menu, X, Cake, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentView, setView, cart, currentUser, logoutUser, loginUser } = useAppState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    await loginUser(emailInput, nameInput);
    setShowLoginModal(false);
    setEmailInput('');
    setNameInput('');
  };

  const navItems = [
    { view: 'home' as const, label: 'Menu & Story' },
    { view: 'customize' as const, label: 'Design Bento' },
    { view: 'help' as const, label: 'Bakery FAQs & Help' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Branding Logo */}
            <div 
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => { setView('home'); setMobileMenuOpen(false); }}
            >
              <div className="p-2.5 bg-rose-100 rounded-full text-rose-500 group-hover:bg-rose-200 transition-colors">
                <Cake className="w-6 h-6 animate-pulse" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-rose-600">
                Cakes <span className="text-pink-400 font-sans font-light">&amp;</span> Creams
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => setView(item.view)}
                  className={`text-sm font-medium transition-colors relative py-2 ${
                    currentView === item.view 
                      ? 'text-rose-600 font-semibold' 
                      : 'text-gray-500 hover:text-rose-500'
                  }`}
                >
                  {item.label}
                  {currentView === item.view && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-400 rounded-full" />
                  )}
                </button>
              ))}
            </nav>

            {/* Right Buttons: Auth, Wish, Cart */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Admin Badge shortcut */}
              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => setView('admin')}
                  className={`flex items-center space-x-1 px-3.5 py-1.5 rounded-full ring-1 ring-rose-200 text-xs font-semibold ${
                    currentView === 'admin' 
                      ? 'bg-rose-500 text-white' 
                      : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                  } transition-all`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Deepika Portal</span>
                </button>
              )}

              {/* Wishlist item */}
              <button 
                onClick={() => {
                  if (!currentUser) setShowLoginModal(true);
                  else setView('account');
                }}
                className="relative p-2 text-gray-500 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                title="Wishlist"
              >
                <Heart className="w-5.5 h-5.5" />
                {currentUser && currentUser.wishlist && currentUser.wishlist.length > 0 && (
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </button>

              {/* Cart trigger */}
              <button
                onClick={() => setView('cart')}
                className={`relative p-2 rounded-full transition-colors ${
                  currentView === 'cart' 
                    ? 'bg-rose-100 text-rose-600' 
                    : 'text-gray-500 hover:text-rose-500 hover:bg-rose-50'
                }`}
                title="Your Bakery Cart"
              >
                <ShoppingCart className="w-5.5 h-5.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Auth user action */}
              {currentUser ? (
                <div className="flex items-center space-x-3.5 pl-3 border-l border-rose-100">
                  <button
                    onClick={() => setView('account')}
                    className="flex items-center space-x-1.5 text-sm font-semibold text-gray-750 hover:text-rose-600 transition-colors"
                  >
                    <User className="w-4 h-4 text-rose-500" />
                    <span className="max-w-[100px] truncate">{currentUser.displayName}</span>
                  </button>
                  <button
                    onClick={logoutUser}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full font-bold text-xs transition-colors border border-rose-100/50"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center space-x-1.5 px-4.5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-sm font-semibold transition-colors shadow-sm"
                >
                  <User className="w-4 h-4" />
                  <span>Join / Login</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="flex items-center md:hidden space-x-3">
              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => setView('admin')}
                  className="p-1.5 bg-rose-50 text-rose-600 rounded-full"
                >
                  <ShieldCheck className="w-5 h-5" />
                </button>
              )}
              
              <button
                onClick={() => setView('cart')}
                className="relative p-2 text-gray-500 hover:text-rose-500"
              >
                <ShoppingCart className="w-5.5 h-5.5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-gray-500 hover:text-rose-500 hover:bg-rose-50 rounded-md"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu container */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-rose-50 bg-rose-50/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-2.5 shadow-lg animate-fadeIn">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => { setView(item.view); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-4 py-3 rounded-xl text-base font-semibold ${
                  currentView === item.view 
                    ? 'bg-rose-500 text-white shadow-sm' 
                    : 'text-gray-700 hover:bg-rose-100'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="border-t border-rose-100 pt-3 flex flex-col space-y-2">
              {currentUser ? (
                <>
                  <button
                    onClick={() => { setView('account'); setMobileMenuOpen(false); }}
                    className="flex items-center space-x-2 px-4 py-3 rounded-xl text-gray-700 font-semibold"
                  >
                    <User className="w-5 h-5 text-rose-500" />
                    <span>Greetings, {currentUser.displayName}!</span>
                  </button>
                  <button
                    onClick={() => { logoutUser(); setMobileMenuOpen(false); }}
                    className="flex items-center space-x-2 px-4 py-3 rounded-xl text-red-600 font-semibold"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }}
                  className="flex items-center justify-center space-x-2 w-full py-3 bg-rose-500 text-white rounded-xl font-semibold"
                >
                  <User className="w-5 h-5" />
                  <span>Login to Order</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Sweet Bakers Login Modal */}
      {showLoginModal && (
        <div id="login-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white max-w-sm w-full rounded-3xl overflow-hidden shadow-2xl border border-rose-100 transform transition-all animate-scaleUp">
            <div className="bg-gradient-to-r from-pink-100 to-rose-100 p-6 text-center">
              <Cake className="w-10 h-10 text-rose-500 mx-auto mb-2 animate-bounce" />
              <h3 id="login-title" className="font-serif text-2xl font-bold text-gray-800">Cakes &amp; Creams</h3>
              <p className="text-xs text-rose-600 mt-1">Sign in to design your custom Bento Cakes!</p>
            </div>
            
            <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Your Lovely Name</label>
                <input
                  type="text"
                  placeholder="e.g. Deepika"
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Email Address <span className="text-red-400">*</span></label>
                <input
                  type="email"
                  required
                  placeholder="e.g. deepika@cakesandcreams.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  💡 TIP: Log in as <strong className="text-rose-500 font-medium">madhukatta0731@gmail.com</strong> to unlock the Admin Deepika interface!
                </p>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium rounded-xl text-sm border border-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-xl text-sm transition-colors shadow-md"
                >
                  Enter Shop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
