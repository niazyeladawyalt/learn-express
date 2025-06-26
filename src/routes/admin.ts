import express from 'express';
import path from 'path';
import { rootDir } from '../util/path';

interface Product {
  title: string;
}
const Router = express.Router();

const products: Product[] = [];

Router.get('/add-product', (req, res, next) => {
  res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });
});

Router.post('/add-product', (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect('/');
});

export default Router;
export { products };
