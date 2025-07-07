import { v4 as uuidv4 } from 'uuid'; // install with `npm install uuid`
import db from './../util/database';
import { RowDataPacket } from 'mysql2';

class Product {
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  id: string;

  constructor(
    id: string | null,
    title: string,
    price: number,
    description: string,
    imageUrl: string,
  ) {
    this.id = id ?? uuidv4();
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  async addProduct() {
    const sql = `
      INSERT INTO products (title, price, description, imageUrl)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      this.title,
      this.price,
      this.description,
      this.imageUrl,
    ]);
    return result;
  }
  async updateProduct() {
    const sql = `
                UPDATE products
                SET title=?, price=?, description=?, imageUrl=?
                WHERE id= ?
                `;
    const [result] = await db.execute(sql, [
      this.title,
      this.price,
      this.description,
      this.imageUrl,
      this.id,
    ]);

    return result;
  }

  static async deleteProduct(id: string) {
    return db.execute(`DELETE  FROM products WHERE id =${id}`);
  }
  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static async fetchSingle(id: string): Promise<[RowDataPacket[], any]> {
    return db.execute(`SELECT * FROM products WHERE id =${id}`);
  }
}

export default Product;
