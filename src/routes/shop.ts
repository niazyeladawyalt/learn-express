import express from 'express';
import shopController from '../controllers/shop';

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:id', shopController.getProductDetails);

export default router;
