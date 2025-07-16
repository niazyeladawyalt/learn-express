import { NextFunction, Request, Response } from 'express';
import Product from '../models/product';

const getCart = async (req: Request, res: Response, next: NextFunction) => {
  await req.user.updateCartTotal();
  const cart = await req.user.populate('cart.items.productId');
  const cart2 = cart.cart;
  const products = res.render('shop/cart', {
    pageTitle: 'Cart',
    path: '/cart',
    cart: cart2,
  });
};

const postCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    const result = await req.user.addToCart(product);
    res.redirect('/cart');
  } catch (error) {
    console.error('Error in postCart:', error);
    next(error);
  }
};

const postDeleteCart = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.body;
  try {
    await req.user.deleteFromCart(productId);
    res.redirect('/cart');
  } catch (error) {}
};

const postUpdateCart = async (req: Request, res: Response, next: NextFunction) => {
  const { productId, change, quantity } = req.body;
  await req.user.updateCartQuantity(productId, change);
  res.redirect('/cart');
};

export { getCart, postCart, postDeleteCart, postUpdateCart };
