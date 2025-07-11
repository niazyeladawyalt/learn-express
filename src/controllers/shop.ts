// controllers/products.ts
import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import { renderProductsPage } from '../helpers/render';
import Order from '../models/order';

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await renderProductsPage(req, res, 'shop/product-list', 'All Products', '/products');
  } catch (error) {
    next(error);
  }
};

const getIndex = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await renderProductsPage(req, res, 'shop/index', 'Shop', '/');
  } catch (error) {
    next(error);
  }
};

const getProductDetails = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    console.log('Asd', product);
    // console.log('Asd', product);
    if (product) {
      res.render('shop/product-details', {
        pageTitle: 'Product Details',
        path: '/',
        product: product,
      });
    }
  } catch (error) {}
};

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
  // console.log('ddddddddd', req.body);
  const { productId, change, quantity } = req.body;
  await req.user.updateCartQuantity(productId, change);
  res.redirect('/cart');
  // try {
  //   await req.user.deleteFromCart(productId);
  // } catch (error) {}
};
const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate('items.productId');
    console.log('orders', orders);
    res.render('shop/orders', {
      pageTitle: 'Orders',
      path: '/orders',
      orders,
    });
  } catch (error) {
    console.error('Error in getOrders:', error);
    next(error);
  }
};
const postOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderItems = req.user.cart.items;
    const order = new Order({
      items: orderItems,
      userId: req.user._id,
    });
    await order.save();
    await req.user.clearCart();
    res.redirect('/orders');
  } catch (error) {
    console.error('Failed to place order:', error);
    res.status(500).send('Something went wrong while placing your order.');
  }
};

export default {
  getProducts,
  getProductDetails,
  getCart,
  getIndex,
  getOrders,
  postCart,
  postDeleteCart,
  postOrder,
  postUpdateCart,
};
