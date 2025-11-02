// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db=require("./db/db");

const app = express();
const AuthRoutes=require("./routes/auth");
const ProductsRoutes=require("./routes/products");
const CartRoutes=require("./routes/cart");
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

app.use("/auth",AuthRoutes);
app.use("/products",ProductsRoutes);
app.use("/cart",CartRoutes);
// Test route
app.get("/", (req, res) => {
  console.log("GET /hit");
  res.send("Backend is running successfully!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
    console.log(`Server running on http://localhost:${PORT}`));