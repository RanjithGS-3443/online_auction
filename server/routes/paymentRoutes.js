const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment'); // Assuming you have a Payment model
const Product = require('../models/Product'); // Assuming you have a Product model

// Route to handle payment processing
router.post('/api/payments', async (req, res) => {
  try {
    const {
      productId,
      bidderName,
      bidderEmail,
      address,
      paymentMethod,
      cardNumber,
      expiryDate,
      cvv,
    } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ success: false, message: 'Product not found' });
    }

    // Payment processing logic
    const payment = new Payment({
      productId,
      bidderName,
      bidderEmail,
      address,
      paymentMethod,
      cardNumber,
      expiryDate,
      cvv,
      amount: product.highestBid || product.startingPrice,
      status: 'Pending',
    });

    // Save payment to the database
    await payment.save();

    // Optionally, update the product's status (e.g., mark as sold)
    product.status = 'Sold';
    await product.save();

    res.status(200).json({ success: true, message: 'Payment processed successfully' });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ success: false, message: 'Error processing payment' });
  }
});
router.get("/api/payments/completed", async (req, res) => {
    try {
      const payments = await Payment.aggregate([
        {
          $group: {
            _id: "$productId", // 🔹 group by productId
            highestBid: { $max: "$biddedAmount" },
          },
        },
      ]);
  
      // Convert result to: { productId1: bid1, productId2: bid2, ... }
      const result = {};
      payments.forEach((item) => {
        result[item._id.toString()] = item.highestBid; // ✅ Convert to string for frontend matching
      });
  
      res.status(200).json(result);
    } catch (error) {
      console.error("❌ Error fetching completed payments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });  
  

module.exports = router;
