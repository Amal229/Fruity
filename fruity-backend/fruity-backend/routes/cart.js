const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db/db");
const router = express.Router();
const SECRET = process.env.SECRET;

// ✅ Middleware: Verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const user = jwt.verify(token, SECRET);
    req.user = user; // store user data (id, email, discount) in the request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

// 🛒 GET /cart - View user's cart with per-item total + cart total
router.get("/", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const discount = req.user.discount || 0;

  const items = db.prepare(
    `SELECT c.id, p.name, p.price, p.image, p.isSpecial, c.productId, c.quantity
     FROM cart c
     JOIN products p ON c.productId = p.id
     WHERE c.userId = ?`
  ).all(userId);

  if (!items.length) return res.json({ items: [], totalCartPrice: 0 });
//Calculate per-item and total prices
  const updatedItems = items.map(item => {
    const discountedPrice = Number((item.price * (1 - discount / 100)).toFixed(2));
    const totalPriceForItem = Number((discountedPrice * item.quantity).toFixed(2));

    return {
      ...item,
      originalPrice: item.price,
      discountedPrice,
      totalPriceForItem
    };
  });

  const totalCartPrice = updatedItems.reduce((sum, item) => sum + item.totalPriceForItem, 0);

  res.json({
    items: updatedItems,
    totalCartPrice: Number(totalCartPrice.toFixed(2))
  });
});

// ➕ POST /cart - Add an item (or increase quantity if exists)
router.post("/", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { productId, quantity = 1 } = req.body;

  if (!productId) return res.status(400).json({ message: "Product ID required" });

  const existing = db.prepare(
    "SELECT id, quantity FROM cart WHERE userId = ? AND productId = ?"
  ).get(userId, productId);

  if (existing) {
    // Increase quantity
    const newQty = existing.quantity + quantity;
    db.prepare("UPDATE cart SET quantity = ? WHERE id = ?").run(newQty, existing.id);
    return res.json({ message: "Item quantity updated", quantity: newQty });
  }

  // Insert new cart item
  db.prepare("INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)").run(userId, productId, quantity);
  res.json({ message: "Item added to cart", quantity });
});

// 🔄 PATCH /cart/:id - Update quantity
router.patch("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  if (quantity < 1) return res.status(400).json({ message: "Quantity must be at least 1" });

  db.prepare("UPDATE cart SET quantity = ? WHERE id = ? AND userId = ?").run(quantity, id, req.user.id);
  res.json({ message: "Item quantity updated", quantity });
});

// ❌ DELETE /cart/:id - Remove item
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  db.prepare("DELETE FROM cart WHERE id = ? AND userId = ?").run(id, req.user.id);
  res.json({ message: "Item removed" });
});

// 🧹 DELETE /cart - Clear all items
router.delete("/", authenticateToken, (req, res) => {
  db.prepare("DELETE FROM cart WHERE userId = ?").run(req.user.id);
  res.json({ message: "All cart items removed" });
});

module.exports = router;