//products.js
const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db/db");
const router = express.Router();
const SECRET = process.env.SECRET;

router.get("/", (req, res) => {
  console.log("✅ /products route hit");

  const authHeader = req.headers.authorization;
  let user = null;

  // 🔹 Decode token if provided
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      user = jwt.verify(token, SECRET);
      console.log("Decoded user:", user);
    } catch (err) {
      console.log("❌ Invalid token:", err.message);
    }
  }

  // 🔹 Fetch all products
  let products = db.prepare("SELECT * FROM products").all();
  console.log("DB fetched products:", products.map(p => ({ id: p.id, isSpecial: p.isSpecial })));

  // 🔹 Filter depending on user type
  if (!user) {
    console.log("➡️ Guest (no token) — showing only normal products");
    products = products.filter(p => p.isSpecial === 0);
  } else if (user.email === "user1@example.com") {
    console.log("➡️ User1 logged in — showing only normal products");
    products = products.filter(p => p.isSpecial === 0);
  } else if (user.email === "user2@example.com") {
    console.log("➡️ User2 logged in — showing ALL products (no filter)");
    // Do NOT filter
  } else {
    console.log("➡️ Unknown user type — showing only normal products");
    products = products.filter(p => p.isSpecial === 0);
  }

  // 🔹 Apply discounts
  products = products.map(p => {
    const discount = user?.discount || 0;
    return {
      ...p,
      originalPrice: p.price,
      discountedPrice: user
        ? Number((p.price * (1 - discount / 100)).toFixed(2))
        : null
    };
  });

  console.log("✅ Final response products:", products.map(p => p.id));
  res.json(products);
});

module.exports = router;