import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import { ProductType } from '../interfaces/Product';


const getAddProduct = (req: Request, res: Response, next: NextFunction) => {

    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product'
    });
};

const getAdminProduct = (req: Request, res: Response, next: NextFunction) => {


    Product.fetchAll((products: ProductType[]) => {
        res.render('admin/product-list', {
            prods: products,
            pageTitle: 'Admin Product',
            path: '/admin/products'
        });
    })
};

const postAddProduct = (req: Request, res: Response, next: NextFunction) => {

    const { title, price, description,imageUrl } = req.body
    const product = new Product(title, price, description,imageUrl)
    product.addProduct()
    res.redirect('/');
};
export default { getAddProduct, getAdminProduct, postAddProduct };
