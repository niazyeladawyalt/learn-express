// controllers/products.ts
import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import { renderProductsPage } from '../helpers/render';

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

export default {
  getProducts,
  getProductDetails,
  getIndex,
};
