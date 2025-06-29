import path from 'path';
import fs from 'fs';
import { ProductType } from './../interfaces/Product';

const path2 = path.join(path.dirname(require.main?.filename ?? ""), 'data', 'cart.json');

// Define a CartProduct type including qty
type CartProduct = {
  id: string;
  qty: number;
};

type CartData = {
  products: CartProduct[];
  totalPrice: number;
};

class Cart {
  static addToCart(id: string, productPrice: number) {
    fs.readFile(path2, (err, fileContent) => {
      let cart: CartData = { products: [], totalPrice: 0 };

      if (!err && fileContent.length > 0) {
        try {
          cart = JSON.parse(fileContent.toString());
        } catch (parseErr) {
          console.error('Failed to parse cart JSON:', parseErr);
        }
      }

      const existingProductIndex = cart.products.findIndex(p => p.id === id);
      const existingProduct = cart.products[existingProductIndex];

      let updatedProduct: CartProduct;

      if (existingProduct) {
        updatedProduct = { ...existingProduct, qty: existingProduct.qty + 1 };
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, qty: 1 };
        cart.products.push(updatedProduct);
      }

      cart.totalPrice =  cart.totalPrice + +productPrice;

      fs.writeFile(path2, JSON.stringify(cart), err => {
        if (err) {
          console.error('Failed to write cart:', err);
        }
      });
    });
  }
}

export default Cart;
