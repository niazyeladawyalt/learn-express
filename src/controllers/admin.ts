import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import { ProductType } from '../interfaces/Product';
import { renderProductsPage } from '../helpers/render';
// import User from '../models/user';

const getAddProduct = (req: Request, res: Response, next: NextFunction) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

const getEditProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (product) {
      res.render('admin/edit-product', {
        pageTitle: 'edit Product',
        path: '/admin/edit-product',
        product: product,
        editing: true,
      });
    }
  } catch (error) {}
};

const getAdminProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //console.lo('Dddd');
    await renderProductsPage(req, res, 'admin/product-list', 'Admin Product', '/admin/products');
  } catch (error) {
    next(error);
  }
};

const getUserPage = async (req: Request, res: Response, next: NextFunction) => {
  res.render('admin/edit-user', {
    pageTitle: 'Add User',
    path: '/admin/add-user',
    editing: false,
  });
};

const postAddProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { title, price, description, imgUrl } = req.body;
  // console.log('Asd', req.session.user);
  const product = new Product({ title, price, description, imgUrl, userId: req.user });
  try {
    await product.save();
    res.redirect('/');
  } catch (error) {}
};

const postEditProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { id, title, price, description, imgUrl } = req.body;

  try {
    const product = await Product.findById(id);
    if (product) {
      product.title = title;
      product.price = price;
      product.description = description;
      product.imgUrl = imgUrl;

      await product.save(); // Persist changes

      res.redirect('/');
    }
  } catch (error) {}
};

const postDeleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body;
  // console.log('Dddddd', id);
  try {
    const product = await Product.findByIdAndDelete(id);
    // await Product.deleteOne(id);
    res.redirect('/');
  } catch (error) {}
};

const postAddUser = async (req: Request, res: Response, next: NextFunction) => {
  // const { name, email } = req.body;
  // const user = new User(name, email);
  // try {
  //   await user.save();
  //   res.redirect('/');
  // } catch (error) {}
};

export {
  getAddProduct,
  getAdminProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
  getUserPage,
  postAddUser,
};
