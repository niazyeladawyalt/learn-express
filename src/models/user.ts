import mongoose from 'mongoose';
import { Cart, CartItem } from '../types/cart';
import Product from './product';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'manager'], // extend as needed
    default: 'user',
  },
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
});

userSchema.methods.addToCart = async function (product: any) {
  if (!this.cart) {
    this.cart = { items: [] };
  }

  const cartItems = this.cart.items || [];
  const cartProductIndex = cartItems.findIndex(
    (p: any) => p.productId.toString() === product._id.toString(),
  );

  let newQuantity = 1;
  const updatedCartItems = [...cartItems];

  if (cartProductIndex >= 0) {
    newQuantity = updatedCartItems[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: 1,
    });
  }

  const updatedCart: Cart = { items: updatedCartItems };

  this.cart = updatedCart;
  await this.updateCartTotal();
  return this.save();
};

userSchema.methods.deleteFromCart = async function (productId: string) {
  const updatedCartItems = this.cart?.items.filter((item: any) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  await this.updateCartTotal();
  return this.save();
};

userSchema.methods.clearCart = async function () {
  this.cart.items = [];
  await this.updateCartTotal();
  return this.save();
};

userSchema.methods.updateCartTotal = async function () {
  let total = 0;

  for (const item of this.cart.items) {
    const product = await Product.findById(item.productId).lean();
    if (product) {
      total += item.quantity * product.price;
    }
  }
  this.cart.totalPrice = total;
};

userSchema.methods.updateCartQuantity = async function (productId: string, change: number) {
  if (!this.cart || !this.cart.items) return;

  const cartItem = this.cart.items.find((item: any) => {
    return item.productId && item.productId.toString() === productId.toString();
  });

  if (cartItem && typeof cartItem.quantity === 'number') {
    cartItem.quantity += Number(change);

    // Remove item if quantity goes to 0 or below
    if (cartItem.quantity <= 0) {
      this.cart.items = this.cart.items.filter(
        (item: any) => item.productId.toString() !== productId.toString(),
      );
    }

    await this.updateCartTotal();
    return this.save();
  }
};

export default mongoose.model('User', userSchema);
