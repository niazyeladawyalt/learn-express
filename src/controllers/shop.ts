// controllers/products.ts
import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import Cart from '../models/cart';
import { renderProductsPage } from '../helpers/render';

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await renderProductsPage(res, 'shop/product-list', 'All Products', '/products');
  } catch (error) {
    next(error);
  }
};

const getIndex = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await renderProductsPage(res, 'shop/index', 'Shop', '/');
  } catch (error) {
    next(error);
  }
};

const getProductDetails = async (req: Request, res: Response, next: NextFunction) => {
  // console.log("object",req.params);
  const { id } = req.params;
  const [[product]] = await Product.fetchSingle(id);
  // const product = rows[0];
  res.render('shop/product-details', {
    pageTitle: 'Product Details',
    path: '/',
    product: product,
  });
};

const getCart = async (req: Request, res: Response, next: NextFunction) => {
  const [rows] = await Cart.getProducts();
  const cart = {
    id: rows[0]?.cart_id,
    total: rows[0]?.total_price,
    products: rows.map((row) => ({
      id: row.product_id,
      title: row.title,
      imageUrl: row.imageUrl,
      price: row.price,
      quantity: row.quantity,
      total: row.total,
    })),
  };
  res.render('shop/cart', {
    pageTitle: 'Cart',
    path: '/cart',
    cart: cart, // now passed correctly
  });
};

const postCart = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.body;
  try {
    await Cart.addToCart(1, productId);
    res.redirect('/cart');
  } catch (error) {}
};
const postDeleteCart = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.body;
  // console.log("Sd" , req.body);
  await Cart.deleteProductFromCart(1, productId);
  res.redirect('/cart');
};
const getOrders = (req: Request, res: Response, next: NextFunction) => {
  res.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders',
  });
};

const getCheckout = (req: Request, res: Response, next: NextFunction) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};

export default {
  getProducts,
  getProductDetails,
  getCart,
  getIndex,
  getCheckout,
  getOrders,
  postCart,
  postDeleteCart,
};
