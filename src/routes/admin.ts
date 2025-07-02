import express from 'express';
import adminController from '../controllers/admin';

const Router = express.Router();

Router.get('/add-product', adminController.getAddProduct);
Router.post('/add-product', adminController.postAddProduct);

Router.get('/edit-product/:id', adminController.getEditProduct);
Router.post('/edit-product', adminController.postEditProduct);

Router.post('/delete-product', adminController.postDeleteProduct);

Router.get('/products', adminController.getAdminProduct);

export default Router;
