/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, Clock, Truck, Flame, Clipboard } from 'lucide-react';

interface DeliverySchedulerProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedSlot: string;
  setSelectedSlot: (slot: string) => void;
  deliveryType: 'standard' | 'fast';
  setDeliveryType: (type: 'standard' | 'fast') => void;
  instructions: string;
  setInstructions: (text: string) => void;
}

export const DeliveryScheduler: React.FC<DeliverySchedulerProps> = ({
  selectedDate,
  setSelectedDate,
  selectedSlot,
  setSelectedSlot,
  deliveryType,
  setDeliveryType,
  instructions,
  setInstructions,
}) => {
  
  const TIME_SLOTS = [
    '09:00 AM - 11:00 AM (Morning Bake)',
    '11:00 AM - 01:00 PM (Lunch Special)',
    '01:00 PM - 03:00 PM (Early Afternoon)',
    '03:00 PM - 05:00 PM (Tea Time Deliver)',
    '05:00 PM - 07:00 PM (Dinner Celebrations)',
  ];

  // Helper dates for visual tags (Today, Tomorrow, Scheduled)
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const getDeliveryText = () => {
    if (deliveryType === 'fast' && selectedDate === todayStr) {
      return "Same Day Express Delivery ⚡ - Cakes are prioritised in Deepika's oven schedule and dispatched in custom cooled thermo bags within 2-3 hours!";
    }
    if (selectedDate === todayStr) {
      return "Same Day Delivery 🌸 - Placed into today's baking rotation. Delivered directly to your door.";
    }
    if (selectedDate === tomorrowStr) {
      return "Next Day Delivery 🍰 - Prepared fresh tomorrow morning and dispatched on your selected time block.";
    }
    return `Scheduled Delivery 📅 - Reserved for your special celebration on ${selectedDate} during the slot ${selectedSlot ? selectedSlot.split('(')[0] : 'selected hour'}.`;
  };

  return (
    <div className="bg-[#FFFDF9] border border-amber-100 p-5 rounded-3xl space-y-5">
      <div className="flex items-center space-x-2 border-b border-amber-100/60 pb-3">
        <Truck className="w-5 h-5 text-amber-600" />
        <h4 className="font-serif text-lg font-bold text-amber-900">Scheduled Cake Delivery</h4>
      </div>

      {/* Speed Selector (Fast vs Standard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setDeliveryType('standard')}
          className={`flex items-start p-3.5 rounded-2xl border text-left transition-all ${
            deliveryType === 'standard' 
              ? 'border-amber-300 bg-amber-50/40 ring-1 ring-amber-300' 
              : 'border-gray-100 bg-white hover:border-amber-200'
          }`}
        >
          <div className="mr-3 p-1.5 bg-gray-50 rounded-lg text-gray-400">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-800 block">Standard Courier</span>
            <span className="text-[10px] text-gray-400 block mt-0.5">Delivered fresh in box</span>
            <span className="text-xs font-semibold text-amber-800 mt-1 block">₹40.00 delivery</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setDeliveryType('fast')}
          className={`flex items-start p-3.5 rounded-2xl border text-left transition-all ${
            deliveryType === 'fast' 
              ? 'border-rose-300 bg-pink-50/20 ring-1 ring-rose-300' 
              : 'border-gray-100 bg-white hover:border-pink-200'
          }`}
        >
          <div className="mr-3 p-1.5 bg-rose-50 rounded-lg text-rose-500 animate-pulse">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-800 block flex items-center space-x-1">
              <span>Express Delivery</span>
              <span className="px-1.5 py-0.2 bg-pink-500 text-white text-[8px] uppercase tracking-widest rounded">Hot</span>
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">Dispatched within 2 hours of baking</span>
            <span className="text-xs font-semibold text-rose-600 mt-1 block">₹80.00 priority</span>
          </div>
        </button>
      </div>

      {/* Date and Time slots picker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-amber-800 mb-1 flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Delivery Date</span>
          </label>
          <input
            type="date"
            required
            min={todayStr}
            className="w-full px-4 py-3 bg-white border border-amber-100 rounded-xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-200"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <div className="flex space-x-1.5 mt-1.5">
            <button
              type="button"
              onClick={() => setSelectedDate(todayStr)}
              className={`px-2 py-0.5 rounded text-[9px] font-bold ${selectedDate === todayStr ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate(tomorrowStr)}
              className={`px-2 py-0.5 rounded text-[9px] font-bold ${selectedDate === tomorrowStr ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}
            >
              Tomorrow
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-amber-800 mb-1 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Delivery Hour Block</span>
          </label>
          <select
            required
            className="w-full px-4 py-3 bg-white border border-amber-100 rounded-xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-200"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
          >
            {TIME_SLOTS.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Est. Arrival Readout panel */}
      <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block mb-0.5">estimated timeline</span>
        <p className="text-xs text-amber-800 leading-snug">{getDeliveryText()}</p>
      </div>

      {/* Special Instructions */}
      <div>
        <label className="block text-xs font-bold text-amber-700 mb-1">Special Delivery Instructions (Optional)</label>
        <textarea
          rows={2}
          placeholder="e.g. Please leave on the porch / Surprise, do not call prior to knock / Call on arrive ..."
          className="w-full px-4 py-2.5 bg-white border border-amber-100 rounded-xl text-xs text-gray-700 placeholder-amber-900/30 focus:outline-none focus:ring-2 focus:ring-amber-200"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>
    </div>
  );
};
