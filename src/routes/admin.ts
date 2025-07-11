import express from 'express';
import {
  getAddProduct,
  getAdminProduct,
  getEditProduct,
  postAddProduct,
  postDeleteProduct,
  postEditProduct,
} from '../controllers/admin';
import { isAuth } from '../middleware/is-auth';

const Router = express.Router();

Router.use(isAuth);

Router.get('/add-product', getAddProduct);
Router.post('/add-product', postAddProduct);

Router.get('/edit-product/:id', getEditProduct);
Router.post('/edit-product', postEditProduct);

Router.post('/delete-product', postDeleteProduct);

Router.get('/products', getAdminProduct);

// Router.get('/users', getUserPage);
// Router.post('/add-user', postAddUser);

export default Router;
