// controllers/products.ts
import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
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
  Product.fetchSingle(() => {
    res.render('shop/product-details', {
      pageTitle: 'Product Details',
      path: '/'
    });
  }, id)



};


const getCart = (req: Request, res: Response, next: NextFunction) => {

  res.render('shop/cart', {
    pageTitle: 'Cart',
    path: '/cart'
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

export default { getProducts, getProductDetails, getCart, getIndex, getCheckout, getOrders };
