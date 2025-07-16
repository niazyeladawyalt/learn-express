import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { Cart } from './cart';

export interface UserCartItem {
  productId: Types.ObjectId;
  quantity: number;
}

export interface UserCart {
  items: UserCartItem[];
  totalPrice: number;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'manager';
  resetToken?: string;
  resetTokenExp?: Date;
  cart: UserCart;

  addToCart: (product: any) => Promise<any>;
  deleteFromCart: (productId: string) => Promise<any>;
  clearCart: () => Promise<any>;
  updateCartTotal: () => Promise<void>;
  updateCartQuantity: (productId: string, change: number) => Promise<any>;
}
