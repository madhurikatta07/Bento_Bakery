/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FAQS } from '../data';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(prev => prev === idx ? null : idx);
  };

  return (
    <div className="bg-[#FFFDF9] border border-amber-100 p-6 rounded-3xl space-y-4">
      <div className="flex items-center space-x-2 border-b border-amber-50 pb-3">
        <HelpCircle className="w-5 h-5 text-amber-600" />
        <h3 className="font-serif text-lg font-bold text-amber-900">Frequently Asked Questions</h3>
      </div>

      <div className="divide-y divide-amber-100/50">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-3">
              <button
                type="button"
                onClick={() => toggleAccordion(idx)}
                className="w-full flex justify-between items-center text-left py-1 text-xs sm:text-sm font-semibold text-amber-950 focus:outline-none"
              >
                <span>{faq.question}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-amber-600" /> : <ChevronDown className="w-4 h-4 text-amber-400" />}
              </button>

              {isOpen && (
                <div className="mt-2 text-xs text-amber-800 leading-snug bg-amber-500/5 p-3 rounded-xl border border-amber-500/5">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
