const mongoose = require("mongoose");

const AuctionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  startingPrice: { type: Number, required: true },
  sellerName: { type: String, required: true },
  sellerEmail: { type: String, required: true },
  imageUrl: { type: String, required: true },
  highestBidder: { type: String, default: "No bids yet" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Auction", AuctionSchema);
