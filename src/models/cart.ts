import path from 'path';
import fs from 'fs';
import { ProductType } from './../interfaces/Product';

const path2 = path.join(path.dirname(require.main?.filename ?? ''), 'data', 'cart.json');

const getCartFromFile = (cb: (cart: CartData) => void) => {
  fs.readFile(path2, (err, fileContent) => {
    if (err) {
      return cb({ products: [], totalPrice: 0 }); // fallback
    }
    return cb(JSON.parse(fileContent.toString()) as CartData);
  });
};

// Define a CartProduct type including qty
type CartProduct = {
  id: string;
  qty: number;
  price: number;
  title: string;
  imageUrl: string;
};

type CartData = {
  products: CartProduct[];
  totalPrice: number;
};

class Cart {
  static addToCart(id: string, productPrice: number, title: string, imageUrl: string) {
    fs.readFile(path2, (err, fileContent) => {
      let cart: CartData = { products: [], totalPrice: 0 };

      if (!err && fileContent.length > 0) {
        try {
          cart = JSON.parse(fileContent.toString());
        } catch (parseErr) {
          console.error('Failed to parse cart JSON:', parseErr);
        }
      }

      const existingProductIndex = cart.products.findIndex((p) => p.id === id);
      const existingProduct = cart.products[existingProductIndex];

      let updatedProduct: CartProduct;

      if (existingProduct) {
        updatedProduct = { ...existingProduct, qty: existingProduct.qty + 1 };
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, qty: 1, price: +productPrice, title, imageUrl };
        cart.products.push(updatedProduct);
      }

      cart.totalPrice = cart.totalPrice + +productPrice;

      fs.writeFile(path2, JSON.stringify(cart), (err) => {
        if (err) {
          console.error('Failed to write cart:', err);
        }
      });
    });
  }
  static deleteProductFromCart(id: string) {
    console.log('Deleting product with id:', id);

    getCartFromFile((cart) => {
      const updatedProducts = cart.products.filter((product) => product.id !== id);
      const updatedTotalPrice = updatedProducts.reduce((sum, product) => {
        return sum + product.price * product.qty;
      }, 0);

      const updatedCart: CartData = {
        products: updatedProducts,
        totalPrice: updatedTotalPrice,
      };

      fs.writeFile(path2, JSON.stringify(updatedCart), (err) => {
        if (err) {
          console.error('Error writing updated cart:', err);
        } else {
          console.log('Cart updated after deletion');
        }
      });
    });
  }

  static getProducts(cb: (cart: CartData) => void) {
    getCartFromFile((cart) => {
      cb(cart); // ✅ pass entire cart
    });
  }
}

export default Cart;
