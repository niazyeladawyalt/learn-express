import { Response, Request } from 'express';
import Product from '../models/product';

const ITEMS_PER_PAGE = 1;

export const renderProductsPage = async (
  req: Request,
  res: Response,
  view: string,
  pageTitle: string,
  path: string,
) => {
  try {
    const currentPage = parseInt(req.query.page as string) || 1;

    const productsCount = await Product.find().countDocuments();

    const pagesCount = Math.ceil(productsCount / ITEMS_PER_PAGE);

    const hasNextPage = currentPage < pagesCount;
    const hasPrevPage = currentPage > 1;

    const nextPage = currentPage + 1;
    const prevPage = currentPage - 1;

    // console.log('Asd', pagesCount);

    const products = await Product.find()
      .skip((currentPage - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    // .populate('userId', 'name');
    // const products = await req.session.user.getProducts();
    if (products) {
      res.render(view, {
        prods: products,
        pageTitle,
        path,
        pagesCount,
        activePage: currentPage,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        lastPage: pagesCount,
      });
    }
  } catch (error) {}
};
