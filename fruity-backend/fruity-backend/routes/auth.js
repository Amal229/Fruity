//auth.js
require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/db");

const router = express.Router();
const SECRET = process.env.SECRET; // use same secret in products/cart

// POST /auth/login
router.post("/login", (req, res) => {
  console.log("Login route hit");
  const { email, password } = req.body;
  console.log("Received email:", email);

  try {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    console.log("Fetched user:", user);

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const valid = bcrypt.compareSync(password, user.password);
    console.log("Password valid?", valid);

    if (!valid) {
      console.log("Invalid password");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, discount: user.discount },
      SECRET,
      { expiresIn: "1d" }
    );
    console.log("Token created");

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        discount: user.discount
      }
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



module.exports = router;