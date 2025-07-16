import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import { renderProductsPage } from '../helpers/render';
import { validationResult } from 'express-validator';
import { toHttpError } from '../util/errors';
import { deleteFile } from '../util/filte';

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
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        product: product,
        editing: true,
      });
    }
  } catch (err) {
    return next(toHttpError(err));
  }
};

const getAdminProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await renderProductsPage(req, res, 'admin/product-list', 'Admin Product', '/admin/products');
  } catch (err) {
    return next(toHttpError(err));
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
  const { title, price, description } = req.body;
  const imageFile = req.file;

  if (!imageFile) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: false,
      errorMessages: [],
      product: { title, price, description },
    });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: false,
      errorMessages: errors.array(),
      product: { title, price, description },
    });
  }

  try {
    const imgUrl = imageFile.path;
    const product = new Product({
      title,
      price,
      description,
      imgUrl,
      userId: req.user,
    });
    await product.save();
    res.redirect('/admin/products');
  } catch (err) {
    return next(toHttpError(err));
  }
};

const postEditProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { id, title, price, description } = req.body;
  const imageFile = req.file;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: `/admin/edit-product/${id}`,
      editing: true,
      errorMessages: errors.array(),
      product: { _id: id, title, price, description }, // include ID
    });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect('/admin/products');
    }
    product.title = title;
    product.price = price;
    product.description = description;
    if (imageFile) {
      await deleteFile(product.imgUrl);
      product.imgUrl = imageFile.path;
    }

    await product.save(); // Persist changes

    res.redirect('/admin/products');
  } catch (err) {
    return next(toHttpError(err));
  }
};

const postDeleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body;

  try {
    const fetched = await Product.findById(id);

    if (fetched) {
      await deleteFile(fetched.imgUrl);
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect('/');
    }

    req.flash('success', 'Product deleted successfully');
    res.redirect('/');
  } catch (err) {
    return next(toHttpError(err));
  }
};

export {
  getAddProduct,
  getAdminProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
  getUserPage,
};
