const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");

const router = express.Router();

// ✅ Fetch a single product by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add a new product
router.post("/", async (req, res) => {
  try {
    const { name, description, price, category, imageUrl } = req.body;

    if (!name || !description || !price || !category || !imageUrl) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const newProduct = new Product({ name, description, price, category, imageUrl });
    await newProduct.save();

    res.status(201).json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
