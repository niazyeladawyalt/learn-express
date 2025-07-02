// controllers/products.ts
import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import Cart from '../models/cart';
import { ProductType } from '../interfaces/Product';

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  const products = await Product.fetchAll();
  res.render('shop/product-list', {
    prods: products[0],
    pageTitle: 'All Products',
    path: '/products',
  });
};

const getIndex = async (req: Request, res: Response, next: NextFunction) => {
  const products = await Product.fetchAll();
  res.render('shop/index', {
    prods: products[0],
    pageTitle: 'Shop',
    path: '/',
  });
};

const getProductDetails = async (req: Request, res: Response, next: NextFunction) => {
  // console.log("object",req.params);
  const { id } = req.params;
  const [rows] = await Product.fetchSingle(id);
  const product = rows[0];
  console.log('asd', product);
  res.render('shop/product-details', {
    pageTitle: 'Product Details',
    path: '/',
    product: product,
  });
};

const getCart = (req: Request, res: Response, next: NextFunction) => {
  Cart.getProducts((cartProducts) => {
    res.render('shop/cart', {
      pageTitle: 'Cart',
      path: '/cart',
      cart: cartProducts, // now passed correctly
    });
  });
};

const postCart = (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.body;

  // console.log("Sd" , req.body);
  // Product.fetchSingle(productId, (product: ProductType | undefined) => {
  //   if (!product) {
  //     return res.status(404).json({ error: 'Product not found' });
  //   }

  //   Cart.addToCart(product.id, product.price, product.title, product.imageUrl);
  //   res.redirect('/cart');
  // });
};
const postDeleteCart = (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.body;
  // console.log("Sd" , req.body);
  Cart.deleteProductFromCart(productId);
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
