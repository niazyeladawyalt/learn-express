import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import { ProductType } from '../interfaces/Product';
import { renderProductsPage } from '../helpers/render';

const getAddProduct = (req: Request, res: Response, next: NextFunction) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

const getEditProduct = async (req: Request, res: Response, next: NextFunction) => {
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

  const [[product]] = await Product.fetchSingle(id);
  res.render('admin/edit-product', {
    pageTitle: 'edit Product',
    path: '/admin/edit-product',
    product: product,
    editing: true,
  });
};

const getAdminProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await renderProductsPage(res, 'admin/product-list', 'Admin Product', '/admin/products');
  } catch (error) {
    next(error);
  }
};

const postAddProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { title, price, description, imageUrl } = req.body;
  const product = new Product(null, title, price, description, imageUrl);
  try {
    await product.addProduct();

    res.redirect('/');
  } catch (error) {
    next(error);
  }
};

const postEditProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { id, title, price, description, imageUrl } = req.body;
  const product = new Product(id, title, price, description, imageUrl);
  try {
    await product.updateProduct();

    res.redirect('/');
  } catch (error) {
    next(error);
  }
  // product.updateProduct();
  // res.redirect('/');
};

const postDeleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body;
  try {
    await Product.deleteProduct(id);

    res.redirect('/');
  } catch (error) {
    next(error);
  }
};

export default {
  getAddProduct,
  getAdminProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};
