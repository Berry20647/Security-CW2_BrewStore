const mongoose = require("mongoose");
const mongooseFieldEncryption = require('mongoose-field-encryption').fieldEncryption;

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coffee: { type: mongoose.Schema.Types.ObjectId, ref: 'coffee' },
  quantity: Number,
  totalPrice: Number,
  weight: Number,
  pricePerGram: Number,
  address: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, default: "pending" },
  paymentMethod: { type: String, enum: ['cod', 'khalti'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  khaltiTransactionId: { type: String }
}, { timestamps: true });

bookingSchema.plugin(mongooseFieldEncryption, {
  fields: ["address", "phone", "khaltiTransactionId"],
  secret: process.env.BOOKING_ENCRYPTION_KEY || "default_secret_change_me",
  saltGenerator: function (secret) { return secret.slice(0, 16); }
});

module.exports = mongoose.model("Booking", bookingSchema);
