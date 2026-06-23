/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useAppState } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Catalog } from './components/Catalog';
import { Customizer } from './components/Customizer';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { AdminDashboard } from './components/AdminDashboard';
import { AccountView } from './components/AccountView';
import { InquiryForm } from './components/InquiryForm';
import { Mail, MessageSquare, MessageCircle, X, Send } from 'lucide-react';

function BaseLayout() {
  const { currentView, activeChatOpen, toggleChatPanel, sendChatMessage, chatMessages, toast, showToast } = useAppState();
  const [chatInputValue, setChatInputValue] = useState('');

  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <Catalog />;
      case 'customize':
        return <Customizer />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'admin':
        return <AdminDashboard />;
      case 'account':
        return <AccountView />;
      case 'help':
        return <InquiryForm />;
      default:
        return <Catalog />;
    }
  };

  const handleGlobalChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputValue.trim()) return;
    sendChatMessage(chatInputValue);
    setChatInputValue('');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col font-sans selection:bg-rose-100 selection:text-rose-800">
      
      {/* Dynamic Custom Premium Toast Notification */}
      {toast && (
        <div id="custom-app-toast" className="fixed top-24 right-4 sm:right-6 z-50 animate-slide-in max-w-sm w-[90%] sm:w-auto">
          <div className={`p-4 rounded-2xl shadow-xl border flex items-center space-x-3.5 backdrop-blur-md ${
            toast.type === 'success' 
              ? 'bg-emerald-50/95 border-emerald-100 text-emerald-800' 
              : toast.type === 'error'
              ? 'bg-rose-50/95 border-rose-100 text-rose-800'
              : 'bg-amber-50/95 border-amber-100 text-amber-800'
          }`}>
            <span className="text-xl">
              {toast.type === 'success' ? '✨' : toast.type === 'error' ? '🚫' : '💡'}
            </span>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Notification</p>
              <p className="text-xs sm:text-sm font-semibold mt-0.5">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Visual background textures */}
      <div className="fixed top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#FFF0E6]/30 to-transparent pointer-events-none z-0" />
      
      {/* Brand Navigation */}
      <Navbar />

      {/* Main content wrapper */}
      <main className="flex-grow z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {renderActiveView()}
        </div>
      </main>

      {/* Footer Branding Area */}
      <footer className="bg-white border-t border-rose-100/55 py-8 md:py-12 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="font-serif text-xl font-bold tracking-tight text-rose-600">
            Cakes &amp; Creams Bento Studio
          </p>
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
            All mini cakes are baked upon reservation on 123 Bakery Lane, Sweetwater, CA. Under state food handler certifications managed by Deepika.
          </p>
          <div className="flex justify-center space-x-4 text-xs font-semibold text-gray-500">
            <span>&copy; 2026 Cakes &amp; Creams</span>
            <span>&bull;</span>
            <span>Allergen Warning: Gluten &amp; Dairy</span>
            <span>&bull;</span>
            <span className="text-rose-500 font-bold hover:underline cursor-pointer" onClick={() => showToast("Deepika's bakery is 100% certified with fully temperature-controlled local dispatch networks!", 'success')}>Safety Shield Verified</span>
          </div>
        </div>
      </footer>

      {/* GLOBAL FLOATING CORNER ASSISTANCE WITH INTEGRATED LIVE CHAT Autoresponder */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3 pointer-events-none select-none">
        
        {/* Site-wide Floating Chat Dialogue popup */}
        {activeChatOpen && (
          <div className="pointer-events-auto bg-white border border-rose-100 rounded-3xl w-[320px] sm:w-[350px] shadow-2xl overflow-hidden flex flex-col h-[420px] animate-scaleUp">
            
            {/* Header branding */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-100 p-4 border-b border-rose-200/40 flex justify-between items-center text-xs">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-white border border-rose-100 flex items-center justify-center text-xl shadow-xs">
                  👩‍🍳
                </div>
                <div>
                  <h5 className="font-bold text-gray-800 leading-none">Deepika Chat Assist</h5>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Online Support</span>
                </div>
              </div>
              
              <button 
                onClick={toggleChatPanel}
                className="p-1.5 text-gray-400 hover:text-rose-500 rounded-full hover:bg-white transition-colors"
                title="Minimize chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Live Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FFFDFB]">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-rose-500 text-white rounded-br-none' : 'bg-rose-50 text-gray-800 rounded-bl-none border border-pink-100/50'}`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 block px-1">{msg.time} &bull; {msg.sender === 'deepika' ? 'Deepika' : 'You'}</span>
                </div>
              ))}
            </div>

            {/* Quick entry submission form */}
            <form onSubmit={handleGlobalChatSubmit} className="p-3 border-t border-rose-50 bg-white flex space-x-2">
              <input
                type="text"
                placeholder="Ask Deepika about your bespoke design..."
                className="flex-1 px-3 py-2 border border-rose-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-200 focus:border-rose-300"
                value={chatInputValue}
                onChange={(e) => setChatInputValue(e.target.value)}
              />
              <button
                type="submit"
                className="p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Action Widgets */}
        <div className="flex items-center space-x-2.5 pointer-events-auto">
          {/* Email dispatch */}
          <a 
            href="mailto:deepika@cakesandcreams.com"
            className="p-3.5 bg-white border border-rose-100 hover:border-rose-300 text-rose-500 hover:text-rose-600 rounded-full shadow-lg transition-transform hover:scale-105"
            title="Mail Deepika support"
          >
            <Mail className="w-5.5 h-5.5" />
          </a>

          {/* WhatsApp redirect */}
          <button
            onClick={() => showToast("Connecting to Deepika's WhatsApp channel on 555-CAKE-SWEET!", 'info')}
            className="p-3.5 bg-[#25D366] text-white rounded-full shadow-lg transition-transform hover:scale-105"
            title="Text on WhatsApp"
          >
            <MessageSquare className="w-5.5 h-5.5 hover:scale-105" />
          </button>

          {/* Primary selector balloon */}
          <button
            onClick={toggleChatPanel}
            className={`p-4 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 cursor-pointer ${
              activeChatOpen 
                ? 'bg-rose-600 text-white rotate-90' 
                : 'bg-rose-500 text-white shadow-xl animate-bounce'
            }`}
          >
            <MessageCircle className="w-6 h-6 fill-white/10" />
          </button>
        </div>

      </div>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BaseLayout />
    </AppProvider>
  );
}
