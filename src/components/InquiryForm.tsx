/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { Mail, Phone, MessageCircle, Send, Check, Heart, Shield, HelpCircle, MessageSquare, Coffee, X } from 'lucide-react';

export const InquiryForm: React.FC = () => {
  const { sendQuery, activeChatOpen, toggleChatPanel, sendChatMessage, chatMessages } = useAppState();

  // Contact form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Bespoke custom bento design query');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Chat message input
  const [chatInput, setChatInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    await sendQuery(name, email, phone, subject, message);
    setIsSuccess(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setTimeout(() => setIsSuccess(false), 5050);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput);
    setChatInput('');
  };

  return (
    <div className="relative">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        
        {/* Intro Admin Team Card */}
        <div className="bg-gradient-to-r from-pink-50 via-[#FFFDF9] to-amber-50 rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
          <div className="relative">
            {/* Deepika avatar ring */}
            <div className="w-24 h-24 rounded-full border-4 border-rose-100/80 shadow-md flex items-center justify-center text-4xl bg-white select-none animate-bounce">
              👩‍🍳
            </div>
            <span className="absolute bottom-1 right-1 bg-green-500 border-2 border-white text-[10px] text-white px-1.5 py-0.2 rounded-full font-bold uppercase tracking-widest leading-none">
              Online
            </span>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-1">
              <div>
                <h3 className="font-serif text-2xl font-black text-gray-800">Deepika</h3>
                <span className="text-xs text-rose-500 uppercase tracking-widest font-bold">Cakes &amp; Creams head baker &amp; administrator</span>
              </div>
              <span className="px-3 py-1 bg-white border border-rose-100 text-[10px] text-rose-600 font-bold rounded-lg uppercase tracking-wider">
                Support: 15m reply
              </span>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed max-w-xl">
              "Hi, I'm Deepika! I oversee and bake each bento, cupcake, and custom order specifically to capture your aesthetic goals. Feel free to shoot me questions about custom frosting layouts, delivery slots, or dairy-free replacements below!"
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1 justify-center sm:justify-start select-none">
              <a 
                href="mailto:deepika@cakesandcreams.com"
                className="px-3 py-1.5 bg-white border border-gray-100 hover:border-pink-300 text-[11px] font-semibold text-gray-600 rounded-lg inline-flex items-center space-x-1 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-pink-400" />
                <span>deepika@cakesandcreams.com</span>
              </a>
              <button 
                type="button"
                onClick={() => alert("Connecting to Deepika's WhatsApp dispatch channel at real 555-CAKE-SWEET. (Demo channel open next door!)")}
                className="px-3 py-1.5 bg-[#25D366] text-white hover:brightness-105 text-[11px] font-bold rounded-lg inline-flex items-center space-x-1 shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Text Deepika (WhatsApp)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contact Form & Design Request Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Main Form Fields */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-rose-50 shadow-xs">
            <h4 className="font-serif text-lg font-black text-gray-800 mb-2">Request Custom Assistent &amp; Delivery Help</h4>
            <p className="text-xs text-gray-400 mb-6">Need a double-tier customized shape or gluten-free sponge replacement? Send Deepika progress instructions!</p>

            {isSuccess ? (
              <div className="p-5 bg-green-50 border border-green-150 rounded-2xl text-center space-y-2">
                <Check className="w-8 h-8 text-green-500 mx-auto bg-white rounded-full p-1.5 shadow-xs" />
                <h5 className="text-xs sm:text-sm font-bold text-green-800">Query Transmitted Successfully</h5>
                <p className="text-xs text-green-600 leading-snug">
                  Admin Deepika has received your customization request. She will respond via mail or phone inside of our standard 2-hour baking queue! Keep an eye on your email inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Deepika"
                      className="w-full px-4 py-2.5 border border-pink-100 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 text-gray-750"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. deepika@mail.com"
                      className="w-full px-4 py-2.5 border border-pink-100 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 text-gray-750"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="e.g. 555-0199"
                    className="w-full px-4 py-2.5 border border-pink-100 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 text-gray-750"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Inquiry Topic</label>
                  <select
                    className="w-full px-4 py-2.5 border border-pink-100 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 text-gray-800"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option value="Bespoke custom bento design query">Bespoke Custom Cake Design</option>
                    <option value="Allergy and ingredient sensible inquiry">Allergy / Vegan Substitutions</option>
                    <option value="Scheduled delivery slot delay instructions">Delivery / Slot Adjustments</option>
                    <option value="Order refund or status support">Order Pipeline Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Request message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Details about your target frosting layout, timing constraints, or visual goals..."
                    className="w-full px-4 py-2.5 border border-pink-100 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 text-gray-750 placeholder:text-pink-900/30"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Deepika Support Query</span>
                </button>
              </form>
            )}
          </div>

          {/* Quick Info Rail / Floating CTA triggers */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-[#FFFDF9] border border-amber-100 p-5 rounded-3xl space-y-4">
              <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase tracking-wider block w-fit">Direct Support Info</span>
              <h5 className="font-serif text-base font-bold text-amber-900">Let\'s Arrange Your Delivery!</h5>
              
              <div className="space-y-3.5 text-xs text-amber-950">
                <div className="p-3 bg-white rounded-xl border border-amber-50 shadow-xs flex items-center space-x-3">
                  <div className="p-1.5 bg-rose-50 text-rose-500 rounded-lg">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block">Live Chat Agent Helper</span>
                    <span className="text-[10px] text-gray-400">Click to discuss custom details instantly</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-amber-50 shadow-xs flex items-center space-x-3">
                  <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block">Open Daily: 8 AM - 8 PM</span>
                    <span className="text-[10px] text-gray-400">Same-Day ovens lock daily on 12:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Chat panel Trigger shortcut */}
              <button
                type="button"
                onClick={toggleChatPanel}
                className="w-full py-3 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center justify-center space-x-1.5"
              >
                <MessageCircle className="w-4 h-4 text-rose-400 fill-rose-150 animate-pulse" />
                <span>Open Deepika Live Sandbox Chat</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* FLOATING CORNER CONTACT UTILITIES & LIVE CHAT DISPLAY OVERLAY */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3 pointer-events-none select-none">
        
        {/* Expanded Live Chat Dialog (Only renders when chat is opened) */}
        {activeChatOpen && (
          <div className="pointer-events-auto bg-white border border-rose-100 rounded-3xl w-[320px] sm:w-[350px] shadow-2xl overflow-hidden flex flex-col h-[420px] animate-scaleUp">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-100 p-4 border-b border-rose-200/40 flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-white border border-rose-100 flex items-center justify-center text-xl shadow-xs">
                  👩‍🍳
                </div>
                <div>
                  <h5 className="text-xs font-bold text-gray-800 leading-none">Deepika Chat Help</h5>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Online Support</span>
                </div>
              </div>
              
              <button 
                onClick={toggleChatPanel}
                className="p-1 text-gray-400 hover:text-rose-500 rounded-full hover:bg-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat messages viewport */}
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

            {/* Chat Send Form */}
            <form onSubmit={handleChatSubmit} className="p-3 border-t border-rose-50 bg-white flex space-x-2">
              <input
                type="text"
                placeholder="Ask Deepika about buttercream..."
                className="flex-1 px-3 py-2 border border-rose-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-200 focus:border-rose-300"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
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

        {/* Floating Bubble Actions */}
        <div className="flex items-center space-x-2.5 pointer-events-auto select-none">
          {/* Email Support Tooltip Bubble */}
          <a 
            href="mailto:deepika@cakesandcreams.com"
            className="p-3.5 bg-white border border-rose-100 hover:border-rose-455 text-rose-500 hover:text-rose-600 rounded-full shadow-lg transition-transform hover:scale-105"
            title="Email support"
          >
            <Mail className="w-5.5 h-5.5" />
          </a>

          {/* WhatsApp Support Tooltip Bubble */}
          <button
            onClick={() => alert("Connecting to Deepika's WhatsApp Support Line on 555-CAKE-SWEET!")}
            className="p-3.5 bg-[#25D366] text-white rounded-full shadow-lg transition-transform hover:scale-105"
            title="WhatsApp Deepika"
          >
            <MessageSquare className="w-5.5 h-5.5" />
          </button>

          {/* Primary Live Chat Trigger Bullet */}
          <button
            onClick={toggleChatPanel}
            className={`p-4 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 cursor-pointer ${
              activeChatOpen 
                ? 'bg-rose-600 text-white rotate-90' 
                : 'bg-rose-550 bg-pink-500 text-white animate-bounce'
            }`}
          >
            <MessageCircle className="w-6 h-6 fill-white/10" />
          </button>
        </div>

      </div>
    </div>
  );
};
