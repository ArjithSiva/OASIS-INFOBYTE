import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import shopRoutes from './routes/shop.js';
import adminRoutes from './routes/admin.js';
import { startCron } from './cron.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', shopRoutes);
app.use('/api/admin', adminRoutes);
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ message: 'Server error.' }); });

await mongoose.connect(process.env.MONGO_URI);
console.log('MongoDB connected');
startCron();
app.listen(process.env.PORT || 5000, () => console.log(`API on :${process.env.PORT || 5000}`));
