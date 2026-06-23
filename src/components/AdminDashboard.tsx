/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { STANDARD_BAKERY_CAKES } from '../data';
import { 
  TrendingUp, ShoppingBag, MessageSquare, Heart, 
  CheckCircle, Clock, Truck, ShieldCheck, Mail, Phone,
  FileSpreadsheet, ArrowUpRight, BarChart3, CheckSquare, Edit3, X, Eye, Plus, Clipboard
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { orders, queries, reviews, updateOrderStatus, respondToQuery, moderateReview, showToast } = useAppState();
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'queries' | 'reviews' | 'cakes'>('analytics');
  
  // Query Reply modal
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');

  // Status transitions
  const ORDER_STATUS_HIERARCHY: ('Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled')[] = [
    'Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'
  ];

  // Helper metrics
  const totalSales = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.total : sum, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const pendingQueriesCount = queries.filter(q => q.status === 'Pending').length;
  const avgOrderValue = orders.length > 0 ? totalSales / orders.filter(o => o.status !== 'Cancelled').length || 0 : 0;

  // Recharts Sales Chart Data
  const salesChartData = [
    { date: 'Jun 05', sales: 120 },
    { date: 'Jun 06', sales: 180 },
    { date: 'Jun 07', sales: 145 },
    { date: 'Jun 08', sales: 260 },
    { date: 'Jun 09', sales: 310 },
    { date: 'Jun 10', sales: 290 },
    { date: 'Jun 11', sales: activeOrdersCount > 0 ? 300 + totalSales * 0.1 : 330 },
  ];

  // Top Products breakdown
  const flavorChartData = [
    { name: 'Vanilla', value: 35, color: '#FFFDD0' },
    { name: 'Chocolate', value: 45, color: '#D4B483' },
    { name: 'Red Velvet', value: 25, color: '#F8C8DC' },
    { name: 'Strawberry', value: 30, color: '#FFDAB9' },
    { name: 'Matcha', value: 15, color: '#D2F8E3' },
  ];

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingTo || !replyInput.trim()) return;
    await respondToQuery(replyingTo, replyInput);
    setReplyingTo(null);
    setReplyInput('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-50 text-yellow-600 ring-1 ring-yellow-200';
      case 'Preparing': return 'bg-pink-50 text-pink-600 ring-1 ring-pink-200';
      case 'Out for Delivery': return 'bg-blue-50 text-blue-600 ring-1 ring-blue-200';
      case 'Delivered': return 'bg-green-50 text-green-600 ring-1 ring-green-200';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Intro header panel */}
      <div className="bg-gradient-to-r from-pink-100 via-rose-100 to-indigo-100 p-6 rounded-3xl border border-pink-200/50 flex flex-col md:flex-row items-start md:items-center justify-between mb-8 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-3.5 bg-white rounded-2xl shadow-xs text-rose-500">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-gray-800">Cakes &amp; Creams Management Portal</h2>
            <p className="text-xs text-rose-700 font-medium">Greetings, Administrator Deepika! You have {activeOrdersCount} pending orders to bake today.</p>
          </div>
        </div>

        <div className="mt-4 md:mt-0 px-4 py-2 bg-white/70 backdrop-blur-md rounded-2xl border border-white flex items-center space-x-2">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-bold text-gray-700">Baker Engine: Active</span>
        </div>
      </div>

      {/* Grid of basic Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Total Revenue</span>
            <span className="text-2xl font-black font-sans text-gray-800 mt-1 block">₹{totalSales.toFixed(2)}</span>
          </div>
          <div className="p-3 bg-green-50 rounded-xl text-green-500">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Active Ovens</span>
            <span className="text-2xl font-black font-sans text-gray-800 mt-1 block">{activeOrdersCount} orders</span>
          </div>
          <div className="p-3 bg-pink-50 rounded-xl text-pink-500">
            <ShoppingBag className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Deepika Support</span>
            <span className="text-2xl font-black font-sans text-gray-800 mt-1 block">{pendingQueriesCount} urgent</span>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl text-purple-500">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Avg. Basket Size</span>
            <span className="text-2xl font-black font-sans text-gray-800 mt-1 block">₹{avgOrderValue.toFixed(2)}</span>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs Control Row */}
      <div className="flex space-x-2 border-b border-gray-100 pb-3 mb-6 overflow-x-auto select-none no-scrollbar">
        {[
          { id: 'analytics' as const, label: 'Analytics Insights', icon: BarChart3 },
          { id: 'orders' as const, label: `Order Queue (${orders.length})`, icon: Clipboard },
          { id: 'queries' as const, label: `User Messages (${queries.length})`, icon: Mail },
          { id: 'reviews' as const, label: 'Vetting Review Cards', icon: Heart },
          { id: 'cakes' as const, label: 'Menu Catalog', icon: CheckSquare },
        ].map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4.5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-rose-500 text-white shadow-sm' 
                  : 'text-gray-500 hover:bg-rose-55 hover:text-rose-500'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT GRID */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Area Sales Trend Chart */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-100/80 shadow-xs">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="font-serif text-lg font-bold text-gray-800 text-xs sm:text-base">Custom Bento Selling Rate</h4>
                <p className="text-xs text-gray-400">Total daily custom revenue and pre-orders dispatched</p>
              </div>
              <span className="text-xs font-bold text-rose-500 bg-pink-50 px-2.5 py-1 rounded-full">+12.4% this week</span>
            </div>
            
            <div className="h-68">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F8C8DC" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F8C8DC" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                  <Area type="monotone" dataKey="sales" stroke="#e11d48" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Flavor Popularity Breakout Pie/Bar */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100/80 shadow-xs">
            <h4 className="font-serif text-lg font-bold text-gray-800 mb-2 text-xs sm:text-base">Sponge Distribution</h4>
            <p className="text-xs text-gray-400 mb-6">Customer favorite crumb selection breakdown</p>

            <div className="space-y-4">
              {flavorChartData.map((flavor, index) => {
                const percent = Math.round((flavor.value / 150) * 100);
                return (
                  <div key={flavor.name} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-gray-700 flex items-center">
                        <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: flavor.color }} />
                        {flavor.name}
                      </span>
                      <span className="text-gray-400 font-bold">{percent}% ({flavor.value})</span>
                    </div>
                    <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-rose-400" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-gray-100/80 overflow-hidden shadow-xs">
          {orders.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <ShoppingBag className="w-12 h-12 text-gray-255 mx-auto mb-2" />
              <p className="font-serif text-lg font-bold text-gray-700">No Orders in Oven Yet</p>
              <p className="text-xs text-gray-400 mt-1">Orders placed by customers will stream directly into Deepika\'s queue!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-55/70 border-b border-gray-100 text-xs text-gray-500 uppercase font-black">
                    <th className="px-6 py-4">Bake Order-ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Cake Description</th>
                    <th className="px-6 py-4">Scheduled Slot</th>
                    <th className="px-6 py-4">Status Portal</th>
                    <th className="px-6 py-4 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-750">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-rose-50/20">
                      <td className="px-6 py-4 font-mono font-bold text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-800">{order.customerInfo.name}</p>
                        <p className="text-[10px] text-gray-400">{order.customerInfo.email}</p>
                        <p className="text-[10px] text-rose-500 font-bold">{order.customerInfo.phone}</p>
                      </td>
                      <td className="px-6 py-4 max-w-[220px]">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="mb-1 text-[11px] leading-tight">
                            <strong className="text-gray-800">x{item.quantity}</strong> {item.name}{' '}
                            {item.isCustom && item.customDetails && (
                              <span className="text-[10px] text-amber-700 block italic leading-none">
                                ({item.customDetails.size}, {item.customDetails.frostingColor} frosting, text: "{item.customDetails.customText}")
                              </span>
                            )}
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-800 flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                          <span>{order.deliveryDate}</span>
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{order.deliveryTimeSlot}</p>
                        <span className={`inline-block px-2 py-0.5 mt-1 text-[9px] uppercase tracking-widest font-black rounded ${order.deliveryType === 'fast' ? 'bg-pink-155 text-rose-600' : 'bg-gray-100 text-gray-600'}`}>
                          {order.deliveryType} Delivery
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1.5">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full w-fit ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          
                          {/* Status Transition buttons */}
                          {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                              className="px-2 py-1 bg-white border border-rose-100 rounded-lg text-[10px] mt-1 text-gray-600 focus:outline-none focus:ring-1 focus:ring-rose-300"
                            >
                              <option value="Pending">Queue: Pending</option>
                              <option value="Preparing">Oven: Preparing</option>
                              <option value="Out for Delivery">Courier: Delivery</option>
                              <option value="Delivered">Completed: Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-rose-600 font-sans text-sm">
                        ₹{order.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'queries' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {queries.map(q => (
            <div key={q.id} className="bg-white p-5 rounded-3xl border border-gray-100/80 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest block">Customer message card</span>
                    <h5 className="font-serif text-base font-bold text-gray-800 mt-0.5 truncate">{q.subject}</h5>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap ${q.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                    {q.status}
                  </span>
                </div>

                <p className="text-xs text-gray-600 leading-snug bg-rose-55/20 p-3.5 rounded-2xl italic">
                  "{q.message}"
                </p>

                <div className="mt-4 flex flex-col space-y-1.5 text-[10px] text-gray-450">
                  <div className="flex items-center space-x-1.5 text-gray-600">
                    <span className="font-bold text-gray-800">{q.name}</span>
                    <span className="text-gray-400">&bull;</span>
                    <span>{q.email}</span>
                  </div>
                  {q.phone && (
                    <p className="text-rose-500 font-semibold">{q.phone}</p>
                  )}
                  <p>Inquired on: {new Date(q.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>

              {/* Deepika's response feedback */}
              <div className="mt-5 pt-4 border-t border-gray-50">
                {q.status === 'Pending' ? (
                  <button
                    onClick={() => { setReplyingTo(q.id); setReplyInput(''); }}
                    className="w-full py-2 bg-rose-500 text-white hover:bg-rose-600 text-xs font-bold rounded-xl transition-colors inline-flex justify-center items-center space-x-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Send Deepika's Response</span>
                  </button>
                ) : (
                  <div className="p-3 bg-green-55/20 rounded-xl border border-green-100">
                    <span className="text-[9px] font-bold text-green-700 uppercase tracking-widest block">Replied by Deepika</span>
                    <p className="text-xs text-green-800 mt-1 italic font-medium">"{q.responseText}"</p>
                    <span className="text-[8px] text-green-600 block mt-1">Dispatched at {q.respondedAt ? new Date(q.respondedAt).toLocaleDateString() : 'now'}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map(rev => (
            <div key={rev.id} className="bg-white p-4 rounded-3xl border border-gray-155/60 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{rev.avatar}</span>
                    <div>
                      <span className="text-xs font-bold text-gray-800 block leading-tight">{rev.name}</span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">{rev.cakeName}</span>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i} className="text-xs">★</span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-500 italic mt-3 leading-snug">
                  "{rev.comment}"
                </p>
                <span className="text-[9px] text-gray-400 block mt-2">{new Date(rev.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Approve/Reject reviews veto toggles */}
              <div className="mt-4 pt-3 border-t border-gray-50 flex space-x-2 justify-end">
                {rev.approved ? (
                  <button
                    onClick={() => moderateReview(rev.id, false)}
                    className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Hide Review
                  </button>
                ) : (
                  <button
                    onClick={() => moderateReview(rev.id, true)}
                    className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-lg hover:bg-green-100 transition-colors"
                  >
                    Approve Card
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'cakes' && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100/80 shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-serif text-lg font-bold text-gray-800">Baking Cabinet Catalog</h4>
              <p className="text-xs text-gray-400">Pre-set Bento menus configured in Cakes &amp; Creams</p>
            </div>
            
            <button 
              onClick={() => showToast("Added to Deepika's custom inventory backlog! Catalog integration active.", 'success')}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Preset Cake</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STANDARD_BAKERY_CAKES.map(cake => (
              <div key={cake.id} className="border border-rose-100/40 rounded-2xl overflow-hidden bg-[#FFFDF9] hover:shadow-md transition-shadow">
                <img src={cake.imageUrl} alt={cake.name} className="w-full h-32 object-cover" />
                <div className="p-3.5 space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-gray-800 text-xs block leading-tight">{cake.name}</span>
                    <span className="text-xs font-black text-rose-500 font-sans">₹{cake.price.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium leading-tight line-clamp-2">{cake.description}</p>
                  
                  <div className="pt-2 border-t border-gray-50 flex justify-between text-[10px] text-amber-800 font-bold">
                    <span>Sponge: {cake.flavor.split(' ')[1] || 'Vanilla'}</span>
                    <span className="text-emerald-600">★ {cake.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full rounded-3xl overflow-hidden shadow-2xl border border-pink-100 p-6 animate-scaleUp">
            <div className="flex justify-between items-center border-b border-pink-100 pb-3 mb-4">
              <h3 className="font-serif text-lg font-bold text-gray-800">Reply to Inquiry</h3>
              <button onClick={() => setReplyingTo(null)} className="p-1 text-gray-400 hover:text-rose-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 bg-rose-50/30 p-3 rounded-xl italic mb-4">
              "{queries.find(q => q.id === replyingTo)?.message}"
            </p>

            <form onSubmit={handleReplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-650 mb-1">Deepika's Official Response Text</label>
                <textarea
                  required
                  rows={4}
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  placeholder="Insert helpful bento assistance advice..."
                  className="w-full p-3 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 rounded-xl text-xs sm:text-sm text-gray-750 placeholder-pink-900/30 font-sans"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  Send Response Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
