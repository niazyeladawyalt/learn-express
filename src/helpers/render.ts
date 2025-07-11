import { Response, Request } from 'express';
import Product from '../models/product';

export const renderProductsPage = async (
  req: Request,
  res: Response,
  view: string,
  pageTitle: string,
  path: string,
) => {
  try {
    const products = await Product.find();
    // .populate('userId', 'name');
    console.log('Ddddddddd', products);
    // const products = await req.session.user.getProducts();
    if (products) {
      res.render(view, {
        prods: products,
        pageTitle,
        path,
      });
    }
  } catch (error) {}
};
