// src/types/cart.ts

import { ObjectId } from 'mongodb';

export type CartItem = {
  productId: ObjectId;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
};
