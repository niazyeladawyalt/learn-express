import path from 'path';
import fs from 'fs';
import { ProductType } from './../interfaces/Product';
import db from './../util/database';
import { RowDataPacket } from 'mysql2';

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
  static async addToCart(userId: number = 1, productId: number) {
    try {
      // 1. Get product details (price, title, imageUrl)
      const [[product]] = await db.execute<RowDataPacket[]>(
        'SELECT price, title, imageUrl FROM products WHERE id = ?',
        [productId],
      );

      if (!product) {
        throw new Error('Product not found');
      }

      const { price, title, imageUrl } = product;

      // 2. Get or create cart
      const [cartRows] = await db.execute<RowDataPacket[]>(
        'SELECT id FROM carts WHERE user_id = ? ORDER BY id DESC LIMIT 1',
        [userId],
      );

      let cartId: number;
      if (cartRows.length === 0) {
        const [result]: any = await db.execute(
          'INSERT INTO carts (user_id, total_price) VALUES (?, ?)',
          [userId, 0.0],
        );
        cartId = result.insertId;
      } else {
        cartId = cartRows[0].id;
      }

      // 3. Insert or update cart item
      const [itemRows] = await db.execute<RowDataPacket[]>(
        'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
        [cartId, productId],
      );

      if (itemRows.length > 0) {
        const existing = itemRows[0];
        const newQty = existing.quantity + 1;

        await db.execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing.id]);
      } else {
        await db.execute(
          'INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [cartId, productId, 1, price],
        );
      }

      // 4. Recalculate cart total
      await db.execute(
        `UPDATE carts SET total_price = (
         SELECT SUM(quantity * price) FROM cart_items WHERE cart_id = ?
       ) WHERE id = ?`,
        [cartId, cartId],
      );

      console.log(`Product ${productId} added to cart ${cartId}`);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  }

  static async deleteProductFromCart(userId: number, productId: number) {
    try {
      const [cartRows] = await db.execute<RowDataPacket[]>(
        'SELECT id FROM carts WHERE user_id = ? ORDER BY id DESC LIMIT 1',
        [userId],
      );

      if (!cartRows.length) {
        throw new Error('Cart Not Found');
      }
      const cartId = cartRows[0]?.id;

      await db.execute('DELETE FROM cart_items WHERE cart_id = ? AND product_id =?', [
        cartId,
        productId,
      ]);

      await db.execute(
        `UPDATE carts SET total_price = (
          SELECT IFNULL (SUM(quantity * price),0) FROM cart_items WHERE cart_id=?
        ) WHERE id=?
        `,
        [cartId, cartId],
      );
    } catch (error) {}
  }

  static async getProducts() {
    const sql = `
    SELECT
      c.id AS cart_id,
      c.total_price,
      ci.product_id,
      ci.quantity,
      ci.price,
      ci.total,
      p.title,
      p.imageUrl
    FROM carts c
    JOIN cart_items ci ON c.id = ci.cart_id
    JOIN products p ON ci.product_id = p.id
    WHERE c.id = ?
  `;
    const res = await db.execute<RowDataPacket[]>(sql, [1]);
    return res;
  }
}

export default Cart;
