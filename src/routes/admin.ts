import express from 'express';
import adminController from '../controllers/admin';

const Router = express.Router();

Router.get('/add-product', adminController.getAddProduct);
Router.post('/add-product', adminController.postAddProduct);
Router.get('/products', adminController.getAdminProduct);

export default Router;
