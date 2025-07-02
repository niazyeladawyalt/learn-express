import path from 'path';
import fs from 'fs';
import { ProductType } from '../interfaces/Product';
import { v4 as uuidv4 } from 'uuid'; // install with `npm install uuid`
import db from './../util/database';
import { RowDataPacket } from 'mysql2';

const path2 = path.join(path.dirname(require.main?.filename ?? ''), 'data', 'products.json');

const getProductsFromFile = (cb: (products: ProductType[]) => void) => {
  fs.readFile(path2, (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    return cb(JSON.parse(fileContent.toString()));
  });
};

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

  addProduct() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(path2, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }
  updateProduct() {
    getProductsFromFile((products) => {
      const foundIndex = products.findIndex((prod) => prod.id === this.id);
      const updatedProducts = [...products];
      updatedProducts[foundIndex] = this;
      //   products.push(this);
      fs.writeFile(path2, JSON.stringify(updatedProducts), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id: string) {
    getProductsFromFile((products) => {
      const updatedProducts = products.filter((product) => product.id !== id);
      fs.writeFile(path2, JSON.stringify(updatedProducts), (err) => {
        console.log(err);
      });
    });
  }
  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static async fetchSingle(id: string): Promise<[RowDataPacket[], any]> {
    // getProductsFromFile((products: ProductType[]) => {
    //   const foundProduct = products.find((product: ProductType) => {
    //     return product.id === id;
    //   });
    //   cb(foundProduct);
    // });
    return db.execute(`SELECT * FROM products WHERE id =${id}`);
  }
}

export default Product;
