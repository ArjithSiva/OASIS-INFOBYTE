import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import { User, Inventory, Pizza } from './models.js';

await connectDB();
await User.findOneAndUpdate({ email: process.env.ADMIN_EMAIL.toLowerCase() },
  { name: 'Admin', role: 'admin', verified: true, passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10) }, { upsert: true });

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
console.log('Seed complete. Admin:', process.env.ADMIN_EMAIL);
await mongoose.disconnect();
