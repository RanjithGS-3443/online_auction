const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  userName: { type: String, required: true },  // Required field
  userEmail: { type: String, required: true },  // Required field
  address: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  cardNumber: { type: String },
  expiryDate: { type: String },
  cvv: { type: String },
  biddedAmount: { type: Number, required: true },  // Required field
  productName: { type: String, required: true },  // Required field
  status: { type: String, default: 'Pending' },
  dateCreated: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
