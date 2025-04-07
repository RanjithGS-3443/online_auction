require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const Auction = require("./models/Auction");
const User = require("./models/User");
const Product = require("./models/product");
const Payment = require("./models/Payment");
const router = express.Router();

const paymentRoutes = require("./routes/payments"); // Adjust path if needed
const adminRoutes = require("./routes/admin"); // Add admin routes

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || "fallback_secret";

// ✅ Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // Serve uploaded images
app.use(paymentRoutes); // Use payment routes
app.use(adminRoutes); // Use admin routes

// ✅ Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/auction", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// 📁 Configure Multer for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ User Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate input fields
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // ✅ Check if user exists
    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // ✅ Send token securely via HTTP-only cookie
    res.cookie("auth_token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});


// ✅ User Registration
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// 🛡️ Middleware: JWT Authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(403).json({ message: "Access Denied" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Token missing" });

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

// ✅ Add Product (With Image Upload)
app.post("/api/products/add", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    console.log("Form data received:", req.body);
    console.log("File received:", req.file);
    
    const { name, description, startingPrice, sellerName, sellerEmail } = req.body;
    if (!name || !description || !startingPrice || !sellerName || !sellerEmail || !req.file)
      return res.status(400).json({ message: "All fields and image are required" });

    // Ensure numeric value for startingPrice
    const parsedStartingPrice = parseFloat(startingPrice);
    if (isNaN(parsedStartingPrice)) {
      return res.status(400).json({ message: "Starting price must be a valid number" });
    }

    const newProduct = new Product({
      name,
      description,
      startingPrice: parsedStartingPrice,
      sellerName,
      sellerEmail,
      imageUrl: `/uploads/${req.file.filename}`,
    });

    console.log("About to save product:", {
      name: newProduct.name,
      description: newProduct.description,
      startingPrice: newProduct.startingPrice,
      sellerName: newProduct.sellerName,
      sellerEmail: newProduct.sellerEmail,
      imageUrl: newProduct.imageUrl
    });
    
    const savedProduct = await newProduct.save();
    console.log("Product saved successfully:", {
      id: savedProduct._id,
      name: savedProduct.name,
      startingPrice: savedProduct.startingPrice,
      sellerName: savedProduct.sellerName,
      sellerEmail: savedProduct.sellerEmail,
      imageUrl: savedProduct.imageUrl,
      createdAt: savedProduct.createdAt
    });
    
    res.status(201).json({ message: "Product added successfully", product: savedProduct });
  } catch (error) {
    console.error("❌ Product Upload Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get All Products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 📌 Get Single Product by ID (Auction Details)
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
app.get("/api/auctions/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Auction ID" });
    }

    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }
    
    res.json(auction);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/products/:id/bid", async (req, res) => {
  const { id } = req.params;
  const { bidAmount } = req.body;

  try {
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    if (bidAmount <= product.highestBid) {
      return res.status(400).json({ success: false, message: "Bid must be higher than the current highest bid!" });
    }

    // Update highest bid
    product.highestBid = bidAmount;
    await product.save();

    res.json({ success: true, message: "Bid placed successfully!" });
  } catch (error) {
    console.error("Error placing bid:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
router.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  if (!id || id.length !== 24) {
    return res.status(400).json({ error: "Invalid product ID" });
  }
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Payment Processing

// 🔹 Payment Processing Route
app.post('/api/payments', async (req, res) => {
  try {
    console.log("Received payment data:", req.body);  // Log received data

    const {
      productId,
      bidderName,
      bidderEmail,
      address,
      paymentMethod,
      cardNumber,
      expiryDate,
      cvv,
      biddedAmount,
      productName
    } = req.body;

    // Ensure all required fields are provided
    if (!productId || !bidderName || !bidderEmail || !biddedAmount || !productName) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newPayment = new Payment({
      productId,
      userName: bidderName,       // userName
      userEmail: bidderEmail,     // userEmail
      address,
      paymentMethod,
      cardNumber,
      expiryDate,
      cvv,
      biddedAmount,               // biddedAmount
      productName,                // productName
    });

    // Save payment to database
    const savedPayment = await newPayment.save();
    console.log("Payment saved:", savedPayment);  // Log saved payment

    res.status(200).json({ success: true, message: 'Payment successful!', data: savedPayment });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ success: false, message: 'Error processing payment', error: error.message });
  }
});

router.post("/api/payments", async (req, res) => {
  console.log("📥 Received Payment Data:", req.body); // ✅ Debugging Log

  try {
      const { productId, productName, userName, userEmail, biddedAmount, address, paymentMethod, cardDetails } = req.body;

      if (!productId || !productName || !userName || !userEmail || !biddedAmount || !address || !paymentMethod || !cardDetails) {
          console.log("⚠️ Missing required fields:", req.body);
          return res.status(400).json({ success: false, message: "⚠️ Missing required fields!" });
      }

      console.log("📌 Storing Payment Data in Database...");
      const newPayment = new Payment({
          productId,
          productName,
          userName,
          userEmail,
          biddedAmount,
          address,
          paymentMethod,
          cardDetails
      });

      await newPayment.save();
      console.log("✅ Payment saved successfully!");
      res.status(201).json({ success: true, message: "✅ Payment recorded!" });

  } catch (error) {
      console.error("❌ Payment Error:", error.message);
      res.status(500).json({ success: false, message: "❌ Internal Server Error" });
  }
});
// ✅ NEW: Route to fetch completed payments for products
app.get("/api/payments/completed", async (req, res) => {
  try {
    const completedPayments = await Payment.find({});
    res.status(200).json(completedPayments);
  } catch (error) {
    console.error("❌ Error fetching completed payments:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
