import { Response } from 'express';
import Product from '../models/product';

export const renderProductsPage = async (
  res: Response,
  view: string,
  pageTitle: string,
  path: string,
) => {
  const [products] = await Product.fetchAll();
  res.render(view, {
    prods: products,
    pageTitle,
    path,
  });
};
