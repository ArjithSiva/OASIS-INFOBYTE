import cron from 'node-cron';
import { Inventory } from './models.js';
import { sendMail } from './mailer.js';

export async function checkLowStock() {
  const low = await Inventory.find({ $expr: { $lt: ['$stock', '$threshold'] }, alerted: false });
  if (!low.length) return;
  const rows = low.map(i => `<li>${i.name} (${i.category}): ${i.stock} left, threshold ${i.threshold}</li>`).join('');
  await sendMail(process.env.ADMIN_EMAIL, `Low stock alert: ${low.length} item(s)`, `<p>These items are below threshold:</p><ul>${rows}</ul>`);
  await Inventory.updateMany({ _id: { $in: low.map(i => i._id) } }, { alerted: true });   // avoid repeat emails
  console.log(`[cron] low-stock alert sent for ${low.length} item(s)`);
}
export function startCron() {
  cron.schedule(process.env.CRON_SCHEDULE || '*/15 * * * *', () => checkLowStock().catch(console.error));
}
