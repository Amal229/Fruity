require("dotenv").config();
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");

const db = new Database("./db/database.sqlite");
console.log("✅ Connected to SQLite database");

// --- Create tables
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    discount INTEGER
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    price REAL,
    image TEXT,
    isSpecial INTEGER DEFAULT 0
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    productId INTEGER,
    quantity INTEGER DEFAULT 1
  )
`).run();

// Insert sample data only once
function initializeData() {
  // Check if we already have any users or products in tables
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get().count;
  const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get().count;

  if (userCount === 0) {
    const hash1 = bcrypt.hashSync("Test@123", 10);
    const hash2 = bcrypt.hashSync("Test@123", 10);

    db.prepare(`
      INSERT INTO users (email, password, discount)
      VALUES (?, ?, ?), (?, ?, ?)
    `).run("user1@example.com", hash1, 20, "user2@example.com", hash2, 30);

    console.log("✅ Default users inserted");
  }

  if (productCount === 0) {
    const products = [
      ["Apple", 1.5, "https://thumbs.dreamstime.com/b/red-apple-fruit-half-green-leaf-isolated-white-ripe-background-apples-clipping-path-98166062.jpg", 0],
      ["Banana", 1.0, "https://images.apollo247.in/pd-cms/cms/2025-05/AdobeStock_299290543.webp?tr=q-80,f-webp,w-400,dpr-2.5,c-at_max%201000w", 0],
      ["Orange", 1.2, "https://nippys.com.au/site/wp-content/uploads/2016/11/Orange_Shutterstock_600x600-600x600.jpeg", 0],
      ["Mango", 2.5, "https://thumbs.dreamstime.com/b/mango-leaf-long-slices-isolated-white-background-fresh-cut-as-package-design-element-71454082.jpg", 0],
      ["Grapes", 3.0, "https://img.freepik.com/premium-photo/grapes-white-background_181303-4423.jpg", 0],
      ["Pineapple", 4.0, "https://www.healthxchange.sg/adobe/dynamicmedia/deliver/dm-aid--c06c2aed-90cf-4360-a423-7f053b2a44d9/pineapple-health-benefits-and-ways-to-enjoy.jpg?preferwebp=true", 1],
    ];

    const insert = db.prepare(`INSERT INTO products (name, price, image, isSpecial) VALUES (?, ?, ?, ?)`);
    products.forEach(p => insert.run(...p));

    console.log("✅ Default products inserted");
  }
}

// Run initialization
initializeData();

// Force Pineapple to always be the special product
db.prepare(`
  UPDATE products
  SET isSpecial = 1
  WHERE LOWER(name) = 'pineapple'
`).run();

console.log("Products in database:");
console.table(db.prepare("SELECT id, name, price, isSpecial FROM products").all());

module.exports = db;