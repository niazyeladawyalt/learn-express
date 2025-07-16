import express from 'express';
import {
  getAddProduct,
  getAdminProduct,
  getEditProduct,
  postAddProduct,
  postDeleteProduct,
  postEditProduct,
} from '../controllers/admin';
import { isAdmin, isAuth } from '../middleware/is-auth';
import { productValidationRules } from '../validators/adminValidators';

const Router = express.Router();

Router.use(isAuth);

Router.get('/add-product', isAdmin, getAddProduct);
Router.post('/add-product', isAdmin, productValidationRules, postAddProduct);

Router.get('/edit-product/:id', isAdmin, getEditProduct);
Router.post('/edit-product', productValidationRules, postEditProduct);

Router.post('/delete-product', isAdmin, postDeleteProduct);

Router.get('/products', isAdmin, getAdminProduct);

export default Router;
