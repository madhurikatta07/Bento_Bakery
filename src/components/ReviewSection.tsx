/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { Heart, Star, Sparkles, MessageCircle } from 'lucide-react';

export const ReviewSection: React.FC = () => {
  const { reviews, submitReview } = useAppState();
  
  // New review form
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [custCake, setCustCake] = useState('Bespoke Red Velvet Bento');
  const [isSuccess, setIsSuccess] = useState(false);

  // Filter approved ones for display
  const approvedReviews = reviews.filter(r => r.approved);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    await submitReview(name, rating, comment, custCake);
    setIsSuccess(true);
    setName('');
    setComment('');
    setTimeout(() => {
      setIsSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-10">
      
      {/* Vetted Review Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-[10px] bg-rose-100 text-rose-600 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest text-[9px]">Gourmet Stories</span>
            <h3 className="font-serif text-2xl font-bold text-gray-800 mt-1">Baker Testimonials</h3>
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-rose-600 font-bold bg-pink-50 px-3 py-1.5 rounded-full">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
            <span>Avg: 4.9 / 5.0 Rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedReviews.map((rev) => (
            <div key={rev.id} className="bg-white p-5 rounded-3xl border border-rose-100/40 relative hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-center mb-3.5">
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl bg-pink-50 p-1.5 rounded-full leading-none">{rev.avatar}</span>
                  <div>
                    <h5 className="text-xs font-black text-gray-800 block leading-tight">{rev.name}</h5>
                    <span className="text-[9px] text-gray-400 font-semibold">{rev.cakeName}</span>
                  </div>
                </div>
                
                <div className="flex text-yellow-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 stroke-yellow-500" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed italic">
                "{rev.comment}"
              </p>
              
              <span className="text-[9px] text-gray-400 block mt-3 font-medium">
                Verified Customer &bull; {new Date(rev.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Submission Card */}
      <div className="bg-[#FFFDF6] p-6 rounded-3xl border border-amber-100/60 max-w-lg mx-auto">
        <h4 className="font-serif text-lg font-bold text-amber-900 mb-2 flex items-center space-x-1.5">
          <Sparkles className="w-4.5 h-4.5 text-amber-500 animate-spin" />
          <span>Leave Your Honest Feedback</span>
        </h4>
        <p className="text-[11px] text-amber-800/80 mb-4">
          Did Deepika prepare your custom Korean design perfectly? Share your Cakes &amp; Creams experience below to inspire other bakers!
        </p>

        {isSuccess ? (
          <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl text-xs font-semibold text-center leading-relaxed">
            🌸 Thank you! Your cake review was submitted successfully. Admin Deepika welcomes and moderates feedback prior to database publication!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-amber-800 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Emily W."
                  className="w-full px-3 py-2 bg-white border border-amber-100 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-amber-300"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-amber-800 uppercase mb-1">Bento Design Ordered</label>
                <select
                  className="w-full px-3 py-2 bg-white border border-amber-100 rounded-xl text-xs text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-300"
                  value={custCake}
                  onChange={(e) => setCustCake(e.target.value)}
                >
                  <option value="Strawberry Fields Bento">Strawberry Fields Bento</option>
                  <option value="Midnight Cocoa Teddy">Midnight Cocoa Teddy</option>
                  <option value="Lavish Lavender Bento">Lavish Lavender Bento</option>
                  <option value="Bespoke Custom Bento">Bespoke Custom Design</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-amber-800 uppercase mb-1">Sweet Rating Score</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((stars) => (
                  <button
                    type="button"
                    key={stars}
                    onClick={() => setRating(stars)}
                    className="p-1 text-lg transition-transform focus:outline-none"
                  >
                    <Star 
                      className={`w-6 h-6 ${stars <= rating ? 'fill-yellow-400 stroke-yellow-500' : 'text-gray-200 stroke-gray-300'}`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-amber-800 uppercase mb-1">Short Comment</label>
              <textarea
                required
                rows={3}
                placeholder="How was the cream layer, sponge texture, and delivery experience?..."
                className="w-full px-3 py-2 bg-white border border-amber-100 rounded-xl text-xs text-gray-700 placeholder-amber-900/30 focus:outline-none focus:ring-1 focus:ring-amber-300"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Submit Cake Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
