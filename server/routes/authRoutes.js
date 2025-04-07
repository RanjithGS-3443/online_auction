const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const Auction = require("../models/Auction");

const router = express.Router();
const JWT_SECRET = "your_jwt_secret"; // Replace with your own secret key

// =============================
// ✅ AUTHENTICATION ROUTES
// =============================

// 📌 REGISTER Route
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save User
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 LOGIN Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// =============================
// ✅ AUCTION ROUTES
// =============================

// 📌 Fetch auction by ID
router.get("/auctions/:id", async (req, res) => {
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
        console.error("❌ Error fetching auction:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// 📌 Place a bid
router.post("/auctions/:id/bid", async (req, res) => {
    try {
        const { bidderName, amount } = req.body;
        if (!bidderName || !amount) {
            return res.status(400).json({ message: "Bidder name and amount are required!" });
        }

        const auction = await Auction.findById(req.params.id);
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }

        if (amount <= auction.startingPrice) {
            return res.status(400).json({ message: "Bid must be higher than the starting price!" });
        }

        // ✅ Update auction with highest bid
        auction.startingPrice = amount;
        auction.highestBidder = bidderName;
        await auction.save();

        res.json({
            highestBid: auction.startingPrice,
            highestBidder: auction.highestBidder,
        });
    } catch (error) {
        console.error("❌ Error placing bid:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
