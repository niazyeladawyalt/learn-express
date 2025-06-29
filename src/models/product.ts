import path from 'path';
import fs from 'fs'
import { ProductType } from '../interfaces/Product';
import { v4 as uuidv4 } from 'uuid'; // install with `npm install uuid`


const path2 = path.join(path.dirname(require.main?.filename ?? ""), 'data', 'products.json')

const getProductsFromFile = (cb: (products: ProductType[]) => void) => {
    fs.readFile(path2, (err, fileContent) => {
        if (err) {
            return cb([])
        }
        return cb(JSON.parse(fileContent.toString()))
    })
}

class Product {
    title: string;
    price: number;
    description: string;
    imageUrl: string;
    id: string;


    constructor(title: string, price: number, description: string,imageUrl:string) {
        this.id = uuidv4();
        this.title = title
        this.price = price
        this.description = description
        this.imageUrl = imageUrl
    }

    addProduct() {
        getProductsFromFile((products) => {
            products.push(this)
            fs.writeFile(path2, JSON.stringify(products), (err) => {
                console.log(err);

            })
        })
    }

    static fetchAll(cb: (products: any[]) => void) {
        getProductsFromFile(cb)
    }

   static fetchSingle(id: string, cb: (product: ProductType | undefined) => void): void {
    getProductsFromFile((products: ProductType[]) => {
        const foundProduct = products.find((product: ProductType) => {
            return product.id === id;
        });
        cb(foundProduct);
    });
}


}

export default Product