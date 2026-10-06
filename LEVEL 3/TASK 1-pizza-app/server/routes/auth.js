import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../models.js';
import { sign } from '../middleware.js';
import { sendMail } from '../mailer.js';

const r = Router();
const emailOk = e => /^\S+@\S+\.\S+$/.test(e || '');
const token = () => crypto.randomBytes(32).toString('hex');

// Registration ALWAYS creates a normal user; admins are only created by seed.js
r.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !emailOk(email) || (password || '').length < 8)
    return res.status(400).json({ message: 'Provide a name, valid email and a password of 8+ characters.' });
  if (await User.findOne({ email })) return res.status(409).json({ message: 'Email already registered.' });
  const verifyToken = token();
  await User.create({ name: name.trim(), email, passwordHash: await bcrypt.hash(password, 10), verifyToken });
  const link = `${process.env.API_URL}/api/auth/verify/${verifyToken}`;
  await sendMail(email, 'Verify your email', `<p>Hi ${name},</p><p><a href="${link}">Click here to verify your email</a>.</p>`);
  res.json({ message: 'Registered! Check your email for the verification link.' });
});

r.get('/verify/:token', async (req, res) => {
  const u = await User.findOneAndUpdate({ verifyToken: req.params.token }, { verified: true, $unset: { verifyToken: 1 } });
  res.redirect(`${process.env.CLIENT_URL}/login?verified=${u ? 1 : 0}`);
});

async function login(req, res, role) {
  const { email, password } = req.body;
  const u = await User.findOne({ email, role });
  if (!u || !(await bcrypt.compare(password || '', u.passwordHash)))
    return res.status(401).json({ message: 'Invalid email or password.' });
  if (!u.verified) return res.status(403).json({ message: 'Please verify your email first.' });
  res.json({ token: sign(u), name: u.name, role: u.role });
}
r.post('/login', (req, res) => login(req, res, 'user'));
r.post('/admin-login', (req, res) => login(req, res, 'admin'));

r.post('/forgot', async (req, res) => {
  const u = await User.findOne({ email: req.body.email, role: 'user' });
  if (u) {
    u.resetToken = token(); u.resetExpires = Date.now() + 3600_000; await u.save();
    const link = `${process.env.CLIENT_URL}/reset/${u.resetToken}`;
    await sendMail(u.email, 'Reset your password', `<p><a href="${link}">Reset your password</a> (valid for 1 hour).</p>`);
  }
  res.json({ message: 'If that email exists, a reset link has been sent.' });   // same reply either way
});

r.post('/reset/:token', async (req, res) => {
  if ((req.body.password || '').length < 8) return res.status(400).json({ message: 'Password must be 8+ characters.' });
  const u = await User.findOne({ resetToken: req.params.token, resetExpires: { $gt: Date.now() } });
  if (!u) return res.status(400).json({ message: 'Reset link is invalid or expired.' });
  u.passwordHash = await bcrypt.hash(req.body.password, 10);
  u.resetToken = undefined; u.resetExpires = undefined; await u.save();
  res.json({ message: 'Password updated. You can log in now.' });
});
export default r;
