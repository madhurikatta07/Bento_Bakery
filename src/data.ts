/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StandardCake, Review, DiscountCode, AdminQuery } from './types';

export const CAKE_SIZES = [
  { label: 'Mini 4" (Bento Cake)', value: '4inch', addedPrice: 0, desc: 'Perfect mini size, serves 1-2 people' },
  { label: 'Small 6" (Cake)', value: '6inch', addedPrice: 150, desc: 'Lovely moderate size, serves 4-6 people' },
  { label: 'Medium 8" (Cake)', value: '8inch', addedPrice: 250, desc: 'Great for small parties, serves 8-12 people' },
];

export const FLAVORS = [
  { id: 'vanilla', name: 'Classic Vanilla Bean', price: 0, desc: 'Sweet, buttery vanilla sponge cake' },
  { id: 'chocolate', name: 'Rich Dark Chocolate', price: 0, desc: 'Decadent chocolate cake with high-quality cocoa' },
  { id: 'red-velvet', name: 'Red Velvet Royale', price: 40, desc: 'Velvety crimson layers with a hint of cocoa' },
  { id: 'strawberry', name: 'Fresh Strawberry Blush', price: 50, desc: 'Infused with real summer strawberries' },
  { id: 'matcha', name: 'Uji Matcha Infusion', price: 60, desc: 'Authentic Japanese matcha, earthy and rich' },
];

export const FROSTING_COLORS = [
  { name: 'Soft Cream', hex: '#FFFDD0', bgClass: 'bg-[#FFFDD0]', textClass: 'text-[#5C5535]' },
  { name: 'Pastel Pink', hex: '#F8C8DC', bgClass: 'bg-[#F8C8DC]', textClass: 'text-[#8C4A60]' },
  { name: 'Soft Lavender', hex: '#E6E6FA', bgClass: 'bg-[#E6E6FA]', textClass: 'text-[#504A75]' },
  { name: 'Baby Blue', hex: '#BFEFFF', bgClass: 'bg-[#BFEFFF]', textClass: 'text-[#2D5A75]' },
  { name: 'Peach Cream', hex: '#FFDAB9', bgClass: 'bg-[#FFDAB9]', textClass: 'text-[#8A512E]' },
  { name: 'Mint Green', hex: '#D2F8E3', bgClass: 'bg-[#D2F8E3]', textClass: 'text-[#2b6142]' },
];

export const CREAM_TYPES = [
  { name: 'Signature Buttercream', desc: 'Silky, piped to perfection, holding shapes elegantly' },
  { name: 'Whipped Meringue', desc: 'Light, airy, and delicately sweet' },
  { name: 'Velvet Cream Cheese', desc: 'Rich, smooth, with a subtle tangy finish' },
  { name: 'Dark Chocolate Ganache', desc: 'Rich and luxurious dark glaze cream (+ ₹30.00)', price: 30.0 },
];

export const THEME_DESIGNS = [
  { name: 'Minimalist Aesthetic', price: 0, desc: 'Korean style with neat borders and clean spacing', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop&q=80' },
  { name: 'Sweet Daisy Floral', price: 40, desc: 'Dotted with charming buttercream daisy piping', img: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=400&auto=format&fit=crop&q=80' },
  { name: 'Cute Pip Animal', price: 60, desc: 'Adorable piped kitten or bear character on top', img: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=400&auto=format&fit=crop&q=80' },
  { name: 'Retro Vintage Border', price: 50, desc: 'Classic ruffled shells, reminiscent of royal icing designs', img: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&auto=format&fit=crop&q=80' },
  { name: 'Drizzle & Piping Ring', price: 30, desc: 'Elegant pastel chocolate drizzles with cute dollops', img: 'https://images.unsplash.com/photo-1557925923-cd4648e21187?w=400&auto=format&fit=crop&q=80' },
];

export const FONTS = [
  { name: 'Cursive Elegance', value: 'font-serif italic' },
  { name: 'Clean Modern', value: 'font-sans font-medium' },
  { name: 'Cute Handwriting', value: 'font-sans uppercase tracking-widest font-semibold' },
  { name: 'Retro Tech', value: 'font-mono' },
];

export const TOPPINGS = [
  { name: 'Rainbow Sprinkles', price: 15.0, icon: '✨' },
  { name: 'Edible Silver Pearls', price: 20.0, icon: '⚪' },
  { name: 'Fresh Glazed Cherries', price: 30.0, icon: '🍒' },
  { name: 'Edible Gold Glitter', price: 25.0, icon: '✨' },
  { name: 'Mini Chocolate Chips', price: 20.0, icon: '🍫' },
  { name: 'Cute Tiny Sugar Hearts', price: 25.0, icon: '💖' },
];

// Aesthetic preset option images for inspiration
export const PRESET_INSPIRATIONS = [
  { name: 'Duo Love Hearts', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format&fit=crop&q=80' },
  { name: 'Korean Teddy Bento', url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&auto=format&fit=crop&q=80' },
  { name: 'Dreamy Stars and Moon', url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&auto=format&fit=crop&q=80' },
  { name: 'Frosted Meadow', url: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&auto=format&fit=crop&q=80' },
];

export const STANDARD_BAKERY_CAKES: StandardCake[] = [
  {
    id: 'cake-1',
    name: 'Strawberry Fields Bento',
    description: 'A charming Korean-style mini cream cake filled with homemade strawberry jam, surrounded by soft pink cream and neat little pipe rosettes.',
    flavor: 'Classic Vanilla Bean',
    theme: 'Sweet Daisy Floral',
    price: 299.00,
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    isBestSeller: true
  },
  {
    id: 'cake-2',
    name: 'Midnight Cocoa Teddy',
    description: 'Rich chocolate sponge cake with fudge whipped chocolate cream, featuring a Hand-piped teddy bear sleeping on top of lavender buttercream clouds.',
    flavor: 'Rich Dark Chocolate',
    theme: 'Cute Pip Animal',
    price: 349.00,
    imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    isBestSeller: true
  },
  {
    id: 'cake-3',
    name: 'Lavish Lavender & Pearl',
    description: 'An elegant lavender cream cake bordered with retro pip ruffles and adorned with gourmet edible pearl beads.',
    flavor: 'Red Velvet Royale',
    theme: 'Retro Vintage Border',
    price: 399.00,
    imageUrl: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=500&auto=format&fit=crop&q=80',
    rating: 4.7
  },
  {
    id: 'cake-4',
    name: 'Creamy Matcha Minimalist',
    description: 'Zen-inspired clean green-tea bento cake featuring smooth organic matcha buttercream, a rustic top smudge, and minimalist black-painted cursive lettering.',
    flavor: 'Uji Matcha Infusion',
    theme: 'Minimalist Aesthetic',
    price: 349.00,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    isBestSeller: false
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Emily Watson',
    rating: 5,
    comment: 'The Bento Cake was absolutely magical! I custom ordered a Vanilla Peach bento with "Happy Birthday Mom" in cursive, and it was the highlight of the evening. Not too sweet, soft crumbs, and completely cute!',
    avatar: '👩',
    cakeName: 'Vanilla Peach Bento',
    approved: true,
    createdAt: '2026-06-08T10:30:00Z'
  },
  {
    id: 'rev-2',
    name: 'Liam Chen',
    rating: 5,
    comment: 'Deepika was so helpful! I requested a custom drawing on the cake. She responded instantly, helped adjust my design, and managed to deliver standard delivery right on time. Outstanding chocolate cake.',
    avatar: '👦',
    cakeName: 'Midnight Cocoa Teddy',
    approved: true,
    createdAt: '2026-06-10T14:45:00Z'
  },
  {
    id: 'rev-3',
    name: 'Sophia Martinez',
    rating: 5,
    comment: 'I can\'t recommend Cakes & Creams enough! Having a scheduled delivery slot down to 1 hour made planning my party totally stress-free. The packaging is absolutely adorable as well—comes in a cute little clamshell bento box!',
    avatar: '👩',
    cakeName: 'Strawberry Fields Bento',
    approved: true,
    createdAt: '2026-06-11T09:15:00Z'
  }
];

export const FAQS = [
  {
    question: 'What is a Bento Cake?',
    answer: 'A Bento Cake (or lunchbox cake) is a cute mini cake that measures about 4 inches in diameter and is served in an eco-friendly takeout box. It originated in South Korea and is perfect for sharing between 1-2 people or gifting!'
  },
  {
    question: 'How far in advance should I place an order?',
    answer: 'While we support "Fast Same-Day Delivery" for slot orders before 12:00 PM, we highly recommend scheduling your delivery at least 1–2 days in advance so Administrator Deepika can prepare your hand-piped icing custom designs perfectly.'
  },
  {
    question: 'Can I upload my own custom design?',
    answer: 'Absolutely! Our Customizer page allows you to select details and upload/drag-and-drop an inspiration image. If Deepika needs to verify details, she will reach out directly.'
  },
  {
    question: 'What are the delivery ranges?',
    answer: 'We deliver city-wide! Standard delivery charges are ₹40.00, and Fast Priority Delivery is ₹80.00 (delivered within a strict 1-hour time band).'
  },
  {
    question: 'Are there any custom gluten-free or vegan options?',
    answer: 'Yes! Please contact Administrator Deepika using our "Contact Admin" section, and she will assist you in putting together a special dairy-free or gluten-sensible custom cake design.'
  }
];

export const DISCOUNT_CODES: DiscountCode[] = [
  { code: 'BENTO10', discountPercent: 10, description: '10% Off your bespoke custom bento cake' },
  { code: 'WELCOME15', discountPercent: 15, description: '15% Off for brand new bakery customers' },
  { code: 'DEEPIKA5', discountPercent: 5, description: 'Special Admin choice discount - 20% additional value' }
];

export const INITIAL_QUERIES: AdminQuery[] = [
  {
    id: 'q-1',
    name: 'Sarah Andrews',
    email: 'sarah.a@gmail.com',
    phone: '555-0199',
    subject: 'Gold Glitter Customization Info',
    message: 'Hello Deepika! I want to order a custom baby shower cake but want to know if the gold glitter you use is completely edible and organic. Thank you!',
    status: 'Pending',
    createdAt: '2026-06-11T12:00:00Z'
  },
  {
    id: 'q-2',
    name: 'Bobby Keller',
    email: 'bobby.k@outlook.com',
    subject: 'Delayed Delivery inquiry',
    message: 'Hello, my order is scheduled for tomorrow at 2 PM. Can we push it to 4 PM instead since my guests are coming later? Thank you!',
    status: 'Responded',
    createdAt: '2026-06-11T16:30:00Z',
    responseText: 'Hi Bobby! I have successfully updated your delivery slot to the 4:00 PM - 5:00 PM slot. See you tomorrow!',
    respondedAt: '2026-06-11T17:15:00Z'
  }
];
