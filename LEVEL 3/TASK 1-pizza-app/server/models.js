import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const ref = { type: Schema.Types.ObjectId, ref: 'Inventory' };

export const User = model('User', new Schema({
  name: String,
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  verified: { type: Boolean, default: false },
  verifyToken: String, resetToken: String, resetExpires: Date,
}, { timestamps: true }));

export const Inventory = model('Inventory', new Schema({
  category: { type: String, enum: ['base', 'sauce', 'cheese', 'veggie'], required: true },
  name: { type: String, required: true },
  stock: { type: Number, default: 0, min: 0 },
  threshold: { type: Number, default: 10 },
  price: { type: Number, default: 0 },
  alerted: { type: Boolean, default: false },   // low-stock email already sent
}));

export const Pizza = model('Pizza', new Schema({
  name: String, description: String, price: Number,
  base: String, sauce: String, cheese: String, veggies: [String],   // inventory item names
}));

export const STATUSES = ['Order Received', 'In Kitchen', 'Sent to Delivery'];
export const Order = model('Order', new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  items: { base: ref, sauce: ref, cheese: ref, veggies: [ref] },
  details: { base: String, sauce: String, cheese: String, veggies: [String] },
  amount: Number,                       // rupees
  paid: { type: Boolean, default: false },
  status: { type: String, enum: STATUSES, default: STATUSES[0] },
  razorpayOrderId: String, razorpayPaymentId: String,
}, { timestamps: true }));
