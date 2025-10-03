"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.products = exports.categories = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
exports.categories = (0, sqlite_core_1.sqliteTable)('categories', {
    id: (0, sqlite_core_1.integer)('id').primaryKey(),
    name: (0, sqlite_core_1.text)('name').notNull().unique(),
});
exports.products = (0, sqlite_core_1.sqliteTable)('products', {
    id: (0, sqlite_core_1.integer)('id').primaryKey(),
    name: (0, sqlite_core_1.text)('name').notNull(),
    price: (0, sqlite_core_1.real)('price').notNull(),
    categoryId: (0, sqlite_core_1.integer)('category_id').references(() => exports.categories.id),
});
