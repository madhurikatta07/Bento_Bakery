/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CartItem, Order, AdminQuery, Review, Address } from '../types';
import { ApiService } from '../firebase';
import { STANDARD_BAKERY_CAKES } from '../data';

interface AppContextType {
  currentUser: User | null;
  currentView: 'home' | 'customize' | 'cart' | 'checkout' | 'admin' | 'account' | 'help';
  cart: CartItem[];
  orders: Order[];
  queries: AdminQuery[];
  reviews: Review[];
  activeChatOpen: boolean;
  chatMessages: { sender: 'user' | 'deepika'; text: string; time: string }[];
  wishlist: string[];
  appliedDiscount: { code: string; percent: number } | null;
  
  // Auth actions
  loginUser: (email: string, name?: string) => Promise<void>;
  logoutUser: () => void;
  updateUser_addresses: (addresses: Address[]) => Promise<void>;
  toggleWish: (cakeName: string) => Promise<void>;

  // Cart actions
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };

  // Orders Actions
  placeOrder: (shippingAddress: Address, contactInfo: { name: string; email: string; phone: string }, delivery: { date: string; slot: string; type: 'standard' | 'fast'; instructions: string }, paymentMethod: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;

  // Admin / Query Actions
  sendQuery: (name: string, email: string, phone: string, subject: string, message: string) => Promise<void>;
  respondToQuery: (queryId: string, response: string) => Promise<void>;
  sendChatMessage: (msg: string) => void;
  toggleChatPanel: () => void;
  
  // Reviews
  submitReview: (name: string, rating: number, comment: string, cakeName: string) => Promise<void>;
  moderateReview: (reviewId: string, approved: boolean) => Promise<void>;

  // Toast notification state
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Navigation Helper
  setView: (view: 'home' | 'customize' | 'cart' | 'checkout' | 'admin' | 'account' | 'help') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'customize' | 'cart' | 'checkout' | 'admin' | 'account' | 'help'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [queries, setQueries] = useState<AdminQuery[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  // Live Chat state
  const [activeChatOpen, setActiveChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'deepika'; text: string; time: string }[]>([
    { sender: 'deepika', text: "Hi! I'm Deepika, your Cakes & Creams Administrator 🍰 Welcome to our shop! How can I help you customize your dream Bento Cake today?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const user = await ApiService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setWishlist(user.wishlist || []);
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      }
      
      try {
        const dbOrders = await ApiService.getOrders();
        setOrders(dbOrders);
      } catch (err) {
        console.error("Failed to load orders:", err);
      }

      try {
        const dbQueries = await ApiService.getQueries();
        setQueries(dbQueries);
      } catch (err) {
        console.error("Failed to load queries:", err);
      }

      try {
        const dbReviews = await ApiService.getReviews();
        setReviews(dbReviews);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    }
    loadData();
  }, []);

  // Automatic toast cleanup
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sync state helpers
  const loginUser = async (email: string, name?: string) => {
    const user = await ApiService.login(email, name || 'Cute Baker');
    setCurrentUser(user);
    setWishlist(user.wishlist || []);
  };

  const logoutUser = () => {
    ApiService.logout();
    setCurrentUser(null);
    setWishlist([]);
    setCart([]);
    setAppliedDiscount(null);
    setCurrentView('home');
  };

  const updateUser_addresses = async (addresses: Address[]) => {
    if (!currentUser) return;
    const updated = { ...currentUser, savedAddresses: addresses };
    setCurrentUser(updated);
    await ApiService.syncUserAddresses(currentUser.uid, addresses);
  };

  const toggleWish = async (cakeName: string) => {
    if (!currentUser) {
      // Prompt logon using nice custom toast instead of browser alert blocking iframe
      showToast("Please login first to add cakes to your wishlist!", 'info');
      return;
    }
    let updatedWishlist = [...wishlist];
    if (updatedWishlist.includes(cakeName)) {
      updatedWishlist = updatedWishlist.filter(item => item !== cakeName);
    } else {
      updatedWishlist.push(cakeName);
    }
    setWishlist(updatedWishlist);
    const updatedUser = { ...currentUser, wishlist: updatedWishlist };
    setCurrentUser(updatedUser);
    await ApiService.syncUserWishlist(currentUser.uid, updatedWishlist);
  };

  // Cart Management
  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const newCartItem: CartItem = {
      ...item,
      id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`
    };
    setCart(prev => [...prev, newCartItem]);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, qty: number) => {
    if (qty < 1) return;
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedDiscount(null);
  };

  const applyPromoCode = (code: string) => {
    const cleanCode = code.toUpperCase().trim();
    if (cleanCode === 'BENTO10') {
      const discount = { code: 'BENTO10', percent: 10 };
      setAppliedDiscount(discount);
      return { success: true, message: "10% discount applied successfully!" };
    } else if (cleanCode === 'WELCOME15') {
      const discount = { code: 'WELCOME15', percent: 15 };
      setAppliedDiscount(discount);
      return { success: true, message: "15% welcome discount applied successfully!" };
    } else if (cleanCode === 'DEEPIKA5') {
      const discount = { code: 'DEEPIKA5', percent: 20 }; // Admin special gets 20%!
      setAppliedDiscount(discount);
      return { success: true, message: "Special Admin discount applied: 20% Off!" };
    }
    return { success: false, message: "Invalid promotional code" };
  };

  // Order Operations
  const placeOrder = async (
    shippingAddress: Address,
    contactInfo: { name: string; email: string; phone: string },
    delivery: { date: string; slot: string; type: 'standard' | 'fast'; instructions: string },
    paymentMethod: string
  ): Promise<Order> => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharge = delivery.type === 'fast' ? 8.00 : 4.00;
    const discount = appliedDiscount ? Math.round((subtotal * appliedDiscount.percent / 100) * 100) / 100 : 0;
    const total = subtotal + deliveryCharge - discount;

    const orderPayload: Omit<Order, 'id'> = {
      customerInfo: contactInfo,
      shippingAddress,
      items: cart,
      subtotal,
      deliveryCharge,
      discount,
      total,
      deliveryDate: delivery.date,
      deliveryTimeSlot: delivery.slot,
      deliveryType: delivery.type,
      deliveryInstructions: delivery.instructions,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      paymentMethod
    };

    const placed = await ApiService.createOrder(orderPayload);
    setOrders(prev => [placed, ...prev]);
    clearCart();
    return placed;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    await ApiService.updateOrderStatus(orderId, status);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // Admin Inquiries
  const sendQuery = async (name: string, email: string, phone: string, subject: string, message: string) => {
    const payload = { name, email, phone, subject, message };
    const placed = await ApiService.sendQuery(payload);
    setQueries(prev => [placed, ...prev]);
  };

  const respondToQuery = async (queryId: string, response: string) => {
    await ApiService.respondToQuery(queryId, response);
    setQueries(prev => prev.map(q => q.id === queryId ? { ...q, status: 'Responded', responseText: response, respondedAt: new Date().toISOString() } : q));
  };

  // Submit reviews
  const submitReview = async (name: string, rating: number, comment: string, cakeName: string) => {
    const payload = { name, rating, comment, avatar: ['👩', '👧', '👦', '🧑', '👨'][Math.floor(Math.random() * 5)], cakeName };
    const placed = await ApiService.addReview(payload);
    setReviews(prev => [placed, ...prev]);
  };

  const moderateReview = async (reviewId: string, approved: boolean) => {
    await ApiService.approveReview(reviewId, approved);
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, approved } : r));
  };

  // Deepika Live Chat Assist with Autoresponder
  const sendChatMessage = (msg: string) => {
    if (!msg.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user' as const, text: msg, time };

    setChatMessages(prev => [...prev, userMsg]);

    // Simple automatic admin responder from Deepika inside the applet!
    setTimeout(() => {
      let reply = "That sounds lovely! I would be delighted to design a custom bento cake for you. What colors, sizes, and frostings are you thinking of?";
      const cleaned = msg.toLowerCase();
      if (cleaned.includes('hello') || cleaned.includes('hi ')) {
        reply = "Hello there! Lovely to meet you. I can assist you with bento cake flavors, pipeline customizations, order support, or allergen questions! 🎂";
      } else if (cleaned.includes('price') || cleaned.includes('how much')) {
        reply = "Our mini 4\" Bento Cakes start at just ₹250.00! Customizing with toppings or premium themes adds a small charge. You can see the real-time calculated total on our Customizer Tool!";
      } else if (cleaned.includes('deliver') || cleaned.includes('scheduled')) {
        reply = "Yes! We offer Same-day, Next-day, and Scheduled deliveries with customizable hourly time slots. Standard is ₹40.00 and Fast Priority is ₹80.00.";
      } else if (cleaned.includes('address') || cleaned.includes('where is')) {
        reply = "Cakes & Creams bakery is located at 12 Bakery Road, Koramangala, Bengaluru. We deliver within a 25-km radius of the shop.";
      } else if (cleaned.includes('urgent') || cleaned.includes('fast')) {
        reply = "For urgent orders, please choose the 'Fast Delivery' option at checkout. If it is already past 12 PM, feel free to text me directly here or click our WhatsApp link to confirm instant speed slots!";
      } else if (cleaned.includes('gluten') || cleaned.includes('vegan') || cleaned.includes('allergy')) {
        reply = "Sure! I make customized dairy-free and gluten-free cake sponge compositions. Please let me know in your customization instructions or mail me at deepika@cakesandcreams.com!";
      }

      setChatMessages(prev => [...prev, {
        sender: 'deepika',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1200);
  };

  const toggleChatPanel = () => {
    setActiveChatOpen(prev => !prev);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      currentView,
      cart,
      orders,
      queries,
      reviews,
      activeChatOpen,
      chatMessages,
      wishlist,
      appliedDiscount,
      loginUser,
      logoutUser,
      updateUser_addresses,
      toggleWish,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      applyPromoCode,
      placeOrder,
      updateOrderStatus,
      sendQuery,
      respondToQuery,
      sendChatMessage,
      toggleChatPanel,
      submitReview,
      moderateReview,
      toast,
      showToast,
      setView: setCurrentView,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppState must be used inside AppProvider");
  return context;
};
