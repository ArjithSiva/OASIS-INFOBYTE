import { Router } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { Inventory, Pizza, Order } from '../models.js';
import { auth } from '../middleware.js';

const r = Router();
r.use(auth);
const rzp = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) throw new Error('Razorpay keys are not configured.');
  return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
};

r.get('/menu', async (_req, res) => {
  const [pizzas, inv] = await Promise.all([Pizza.find(), Inventory.find().sort('name')]);
  const options = { base: [], sauce: [], cheese: [], veggie: [] };
  inv.forEach(i => options[i.category].push({ _id: i.id, name: i.name, price: i.price, inStock: i.stock > 0 }));
  res.json({ pizzas, options });
});

// Validates a selection and prices it on the server (never trust client prices)
async function resolve({ base, sauce, cheese, veggies }) {
  if (!base || !sauce || !cheese || !Array.isArray(veggies)) throw new Error('Incomplete pizza selection.');
  const ids = [base, sauce, cheese, ...veggies];
  if (new Set(ids).size !== ids.length) throw new Error('Duplicate items in selection.');
  const docs = await Inventory.find({ _id: { $in: ids } });
  if (docs.length !== ids.length) throw new Error('Unknown item selected.');
  const by = Object.fromEntries(docs.map(d => [d.id, d]));
  if (by[base].category !== 'base' || by[sauce].category !== 'sauce' || by[cheese].category !== 'cheese' ||
      veggies.some(v => by[v].category !== 'veggie')) throw new Error('Invalid item category.');
  const out = docs.find(d => d.stock < 1);
  if (out) throw new Error(`Sorry, ${out.name} is out of stock.`);
  return { ids, by, amount: docs.reduce((s, d) => s + d.price, 0) };
}

r.post('/orders/checkout', async (req, res) => {
  try {
    const { ids, by, amount } = await resolve(req.body);
    const rp = await rzp().orders.create({ amount: amount * 100, currency: 'INR', receipt: `rcpt_${Date.now()}` });
    const { base, sauce, cheese, veggies } = req.body;
    const order = await Order.create({
      user: req.user.id, items: { base, sauce, cheese, veggies }, amount, razorpayOrderId: rp.id,
      details: { base: by[base].name, sauce: by[sauce].name, cheese: by[cheese].name, veggies: veggies.map(v => by[v].name) },
    });
    res.json({ orderId: order.id, razorpayOrderId: rp.id, amount: amount * 100, key: process.env.RAZORPAY_KEY_ID });
  } catch (e) { res.status(400).json({ message: e.message }); }
});

r.post('/orders/verify', async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const order = await Order.findOne({ _id: orderId, user: req.user.id, razorpayOrderId: razorpay_order_id });
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
  if (expected !== razorpay_signature) return res.status(400).json({ message: 'Payment verification failed.' });
  if (!order.paid) {
    order.paid = true; order.razorpayPaymentId = razorpay_payment_id; await order.save();
    const { base, sauce, cheese, veggies } = order.items;
    // automatic stock decrement: 1 unit of each selected item
    await Inventory.updateMany({ _id: { $in: [base, sauce, cheese, ...veggies] }, stock: { $gte: 1 } }, { $inc: { stock: -1 } });
  }
  res.json({ message: 'Order confirmed!', order });
});

r.get('/orders/mine', async (req, res) => {
  res.json(await Order.find({ user: req.user.id, paid: true }).sort('-createdAt'));
});
export default r;
