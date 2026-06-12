/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'customer';
  savedAddresses: Address[];
  wishlist: string[]; // cake ids or custom names
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface CustomCake {
  flavor: string;
  size: string;
  frostingColor: string;
  creamType: string;
  themeDesign: string;
  customText: string;
  fontStyle: string;
  textColor: string;
  toppings: string[];
  inspirationImage: string | null;
  price: number;
}

export interface StandardCake {
  id: string;
  name: string;
  description: string;
  flavor: string;
  theme: string;
  price: number;
  imageUrl: string;
  rating: number;
  isBestSeller?: boolean;
}

export interface CartItem {
  id: string; // unique cart item id
  isCustom: boolean;
  standardCake?: StandardCake;
  customDetails?: CustomCake;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: Address;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  deliveryDate: string;
  deliveryTimeSlot: string;
  deliveryType: 'standard' | 'fast';
  deliveryInstructions: string;
  status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  createdAt: string;
  paymentMethod: string;
}

export interface AdminQuery {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'Pending' | 'Responded';
  createdAt: string;
  responseText?: string;
  respondedAt?: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatar: string;
  cakeName: string;
  approved: boolean; // Deepika can moderate reviews
  createdAt: string;
}

export interface DiscountCode {
  code: string;
  discountPercent: number;
  description: string;
}
