import express from 'express';
import { products } from './admin';

const router = express.Router();

router.get('/', (req, res, next) => {
  // res.sendFile(path.join(rootDir, "views", "shop.pug"));
  res.render('shop', { prods: products, docTitle: 'Shop', path: '/', pageTitle: 'Shop' });
});

export default router;
