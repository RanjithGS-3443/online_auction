const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment"); // Fixed capitalization

// 📥 Record a new payment
router.post("/api/payments", async (req, res) => {
    console.log("📥 Received Payment Data:", req.body); // ✅ Debugging log

    try {
        // Extract fields with fallbacks for different field names
        const { 
            productId, 
            productName, 
            userName, 
            bidderName, // Alternative field name
            userEmail, 
            bidderEmail, // Alternative field name
            biddedAmount, 
            address, 
            paymentMethod, 
            cardNumber,
            expiryDate,
            cvv
        } = req.body;

        // Use the correct field names
        const finalUserName = userName || bidderName;
        const finalUserEmail = userEmail || bidderEmail;

        // 🔹 Check for missing required fields
        if (!productId || !productName || !finalUserName || !finalUserEmail || !biddedAmount || !address || !paymentMethod) {
            console.log("⚠️ Missing required fields:", req.body);
            return res.status(400).json({ success: false, message: "⚠️ Missing required fields!" });
        }

        // 🔹 Create payment object with all fields
        const paymentData = {
            productId,
            productName,
            userName: finalUserName,
            userEmail: finalUserEmail,
            biddedAmount,
            address,
            paymentMethod,
            cardNumber: cardNumber || '',
            expiryDate: expiryDate || '',
            cvv: cvv || ''
        };

        // 🔹 Save to the database
        const newPayment = new Payment(paymentData);
        await newPayment.save();
        
        console.log("✅ Payment saved successfully!");
        res.status(201).json({ success: true, message: "✅ Payment recorded!" });

    } catch (error) {
        console.error("❌ Payment Error:", error.message); // ✅ Log backend error details
        res.status(500).json({ success: false, message: "❌ Internal Server Error" });
    }
});

// ✅ GET route: fetch all payments
router.get("/api/payments/all", async (req, res) => {
    try {
        console.log("Fetching all payments...");
        const payments = await Payment.find({}).lean();
        console.log(`Found ${payments.length} payments`);
        res.status(200).json(payments);
    } catch (error) {
        console.error("❌ Error fetching all payments:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ GET route: fetch completed auctions and their highest bids
router.get("/api/payments/completed", async (req, res) => {
    try {
        console.log("Fetching completed payments...");
        
        // First, let's check what payments we have in the database
        const allPayments = await Payment.find({}).lean();
        console.log("All payments in database:", allPayments);
        
        const payments = await Payment.aggregate([
            {
                $group: {
                    _id: "$productId", // 🔹 group by productId
                    highestBid: { $max: "$biddedAmount" },
                },
            },
        ]);
        
        console.log("Aggregated payments:", payments);

        // Convert result to: { productId1: bid1, productId2: bid2, ... }
        const result = {};
        payments.forEach((item) => {
            // Skip null values
            if (item._id) {
                console.log(`Adding product ID ${item._id.toString()} to completed auctions`);
                result[item._id.toString()] = item.highestBid; // ✅ Convert to string for frontend matching
            }
        });
        
        console.log("Final result object:", result);

        res.status(200).json(result);
    } catch (error) {
        console.error("❌ Error fetching completed payments:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
