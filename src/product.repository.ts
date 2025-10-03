import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../database/schema';
import { eq } from 'drizzle-orm';

const isTest = process.env.NODE_ENV === 'test';
const dbPath = isTest ? ':memory:' : (process.env.DB_PATH || './database/local.db');
const sqlite = new Database(dbPath);


if (isTest) {
    sqlite.exec(`
        CREATE TABLE categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );
        CREATE TABLE products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            category_id INTEGER,
            FOREIGN KEY (category_id) REFERENCES categories(id)
        );
    `);
}

const db = drizzle(sqlite, { schema });

class ProductRepository {
  async findOrCreateCategory(categoryName: string): Promise<schema.Category> {
    const existingCategory = await db.query.categories.findFirst({
      where: eq(schema.categories.name, categoryName),
    });

    if (existingCategory) {
      return existingCategory;
    }

    const newCategory: schema.NewCategory = { name: categoryName };
    const result = db.insert(schema.categories).values(newCategory).run();

    const createdCategory = await db.query.categories.findFirst({
        where: eq(schema.categories.id, Number(result.lastInsertRowid)),
    });

    if (!createdCategory) {
        throw new Error("Failed to create or find category");
    }

    return createdCategory;
  }

  async createProduct(product: { name: string; price: number; categoryId: number }): Promise<schema.Product> {
    const newProduct: schema.NewProduct = {
      name: product.name,
      price: product.price,
      categoryId: product.categoryId,
    };
    const result = db.insert(schema.products).values(newProduct).run();

    const createdProduct = await db.query.products.findFirst({
        where: eq(schema.products.id, Number(result.lastInsertRowid)),
    });

    if (!createdProduct) {
        throw new Error("Failed to create product");
    }
    return createdProduct;
  }
}

export const productRepository = new ProductRepository();
