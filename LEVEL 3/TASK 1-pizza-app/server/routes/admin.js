import { Router } from 'express';
import { Inventory, Order, STATUSES } from '../models.js';
import { auth, adminOnly } from '../middleware.js';

const r = Router();
r.use(auth, adminOnly);

r.get('/inventory', async (_req, res) => res.json(await Inventory.find().sort({ category: 1, name: 1 })));

r.patch('/inventory/:id', async (req, res) => {
  const item = await Inventory.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found.' });
  const { stock, threshold } = req.body;
  if (stock !== undefined) { if (!(stock >= 0)) return res.status(400).json({ message: 'Invalid stock.' }); item.stock = Number(stock); }
  if (threshold !== undefined) { if (!(threshold >= 0)) return res.status(400).json({ message: 'Invalid threshold.' }); item.threshold = Number(threshold); }
  if (item.stock >= item.threshold) item.alerted = false;   // re-arm the low-stock alert
  await item.save();
  res.json(item);
});

r.get('/orders', async (_req, res) => res.json(await Order.find({ paid: true }).populate('user', 'name email').sort('-createdAt')));

r.patch('/orders/:id', async (req, res) => {
  if (!STATUSES.includes(req.body.status)) return res.status(400).json({ message: 'Invalid status.' });
  const o = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(o);
});
export default r;
