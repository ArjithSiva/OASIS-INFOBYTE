import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import { User, Inventory, Pizza } from './models.js';

await connectDB();
await User.findOneAndUpdate({ email: process.env.ADMIN_EMAIL.toLowerCase() },
  { name: 'Admin', role: 'admin', verified: true, passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10) }, { upsert: true });

// Sample customers for local testing: already verified, so no email is needed.
// Re-running the seed resets these passwords to the values below.
const SAMPLE_USERS = [
  { name: 'Priya Sharma', email: 'priya@forno.test', password: 'Pizza@123' },
  { name: 'Karthik Raja', email: 'karthik@forno.test', password: 'Pizza@123' },
  { name: 'Meena Lakshmi', email: 'meena@forno.test', password: 'Pizza@123' },
];
for (const u of SAMPLE_USERS) {
  await User.findOneAndUpdate({ email: u.email },
    { name: u.name, role: 'user', verified: true, passwordHash: await bcrypt.hash(u.password, 10) }, { upsert: true });
}

if (!(await Inventory.countDocuments())) {
  const mk = (category, names, price, stock, threshold) => names.map(name => ({ category, name, price, stock, threshold }));
  await Inventory.insertMany([
    ...mk('base', ['Classic Hand-Tossed', 'Thin Crust', 'Cheese Burst', 'Whole Wheat', 'Multigrain'], 100, 50, 20),
    ...mk('sauce', ['Tomato Marinara', 'Pesto', 'Barbecue', 'White Garlic', 'Spicy Arrabbiata'], 25, 40, 10),
    ...mk('cheese', ['Mozzarella', 'Cheddar', 'Parmesan', 'Vegan Cheese'], 40, 40, 10),
    ...mk('veggie', ['Onion', 'Capsicum', 'Mushroom', 'Tomato', 'Olives', 'Sweet Corn', 'Jalapeno', 'Paneer'], 20, 40, 10),
  ]);
  await Pizza.insertMany([
    { name: 'Margherita', description: 'Classic tomato, mozzarella and fresh tomato.', price: 185, base: 'Classic Hand-Tossed', sauce: 'Tomato Marinara', cheese: 'Mozzarella', veggies: ['Tomato'] },
    { name: 'Farmhouse', description: 'Loaded with onion, capsicum and mushroom.', price: 245, base: 'Thin Crust', sauce: 'Tomato Marinara', cheese: 'Mozzarella', veggies: ['Onion', 'Capsicum', 'Mushroom'] },
    { name: 'Paneer Tikka', description: 'Spicy arrabbiata with paneer and onion.', price: 245, base: 'Cheese Burst', sauce: 'Spicy Arrabbiata', cheese: 'Cheddar', veggies: ['Paneer', 'Onion'] },
    { name: 'Garden Pesto', description: 'Pesto base with olives, corn and parmesan.', price: 250, base: 'Whole Wheat', sauce: 'Pesto', cheese: 'Parmesan', veggies: ['Olives', 'Sweet Corn'] },
  ]);
}
console.log('\nSeed complete. Accounts you can log in with:');
console.log(`  Admin  (http://localhost:5173/admin/login)  ${process.env.ADMIN_EMAIL}  /  ${process.env.ADMIN_PASSWORD}`);
for (const u of SAMPLE_USERS) console.log(`  User   (http://localhost:5173/login)        ${u.email}  /  ${u.password}`);
console.log('');
await mongoose.disconnect();
