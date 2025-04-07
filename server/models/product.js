const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  startingPrice: Number,
  imageUrl: String,
  sellerName: String,
  sellerEmail: String,
  description: String,
  highestBid: { type: Number, default: 0 },
  bids: [
    {
      bidderName: String,
      bidAmount: Number,
      time: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

// Add a pre-save hook to log what's being saved
ProductSchema.pre('save', function(next) {
  console.log('PRE-SAVE HOOK: Product data being saved:');
  console.log('Name:', this.name);
  console.log('Description:', this.description);
  console.log('Starting Price:', this.startingPrice);
  console.log('Seller Name:', this.sellerName);
  console.log('Seller Email:', this.sellerEmail);
  console.log('Image URL:', this.imageUrl);
  
  // Ensure startingPrice is a number
  if (this.startingPrice && typeof this.startingPrice === 'string') {
    this.startingPrice = parseFloat(this.startingPrice);
  }
  
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
