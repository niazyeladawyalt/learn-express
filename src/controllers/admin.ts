import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import { ProductType } from '../interfaces/Product';

const getAddProduct = (req: Request, res: Response, next: NextFunction) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

const getEditProduct = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  // Product.fetchSingle(id, (product: ProductType | undefined) => {
  //   if (!product) {
  //     return res.redirect('/');
  //   }

  //   res.render('admin/edit-product', {
  //     pageTitle: 'edit Product',
  //     path: '/admin/edit-product',
  //     product: product,
  //     editing: true,
  //   });
  // });
};

const getAdminProduct = async (req: Request, res: Response, next: NextFunction) => {
  const products = await Product.fetchAll();
  res.render('shop/product-list', {
    prods: products[0],
    pageTitle: 'Admin Product',
    path: '/admin/products',
  });
};

const postAddProduct = (req: Request, res: Response, next: NextFunction) => {
  const { title, price, description, imageUrl } = req.body;
  const product = new Product(null, title, price, description, imageUrl);
  product.addProduct();
  res.redirect('/');
};

const postEditProduct = (req: Request, res: Response, next: NextFunction) => {
  const { id, title, price, description, imageUrl } = req.body;
  const product = new Product(id, title, price, description, imageUrl);
  product.updateProduct();
  res.redirect('/');
};

const postDeleteProduct = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body;
  // console.log('ASd', id);
  Product.deleteProduct(id);
  res.redirect('/');
  // const product = new Product(id, title, price, description, imageUrl);
  // product.updateProduct();
};

export default {
  getAddProduct,
  getAdminProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};
