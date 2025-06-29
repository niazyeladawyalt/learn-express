// controllers/products.ts
import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import Cart from '../models/cart';
import { ProductType } from '../interfaces/Product';






const getProducts = (req: Request, res: Response, next: NextFunction) => {
  Product.fetchAll((products: ProductType[]) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  })

};

const getIndex = (req: Request, res: Response, next: NextFunction) => {
  Product.fetchAll((products: ProductType[]) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })

};

const getProductDetails = (req: Request, res: Response, next: NextFunction) => {
  // console.log("object",req.params);
  const { id } = req.params
  Product.fetchSingle(id, (product: ProductType | undefined) => {
    res.render('shop/product-details', {
      pageTitle: 'Product Details',
      path: '/',
      product: product
    });
  })



};


const getCart = (req: Request, res: Response, next: NextFunction) => {

  res.render('shop/cart', {
    pageTitle: 'Cart',
    path: '/cart'
  });
};
const postCart = (req: Request, res: Response, next: NextFunction) => {

  const { productId } = req.body


  console.log("Sd" , req.body);
  Product.fetchSingle(productId, (product: ProductType | undefined) => {
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    Cart.addToCart(product.id, product.price);
    res.redirect('/cart');
  });

};
const getOrders = (req: Request, res: Response, next: NextFunction) => {

  res.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders'
  });
};

const getCheckout = (req: Request, res: Response, next: NextFunction) => {

  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  });
};

export default { getProducts, getProductDetails, getCart, getIndex, getCheckout, getOrders, postCart };
