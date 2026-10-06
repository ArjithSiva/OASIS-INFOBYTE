import dns from 'node:dns';
import mongoose from 'mongoose';

// "querySrv ECONNREFUSED" means this machine's DNS server refused the SRV lookup that
// mongodb+srv:// connection strings need (common with some routers, ISPs and VPNs).
// Resolving through public DNS for this Node process fixes it. Override with DNS_SERVERS in .env.
function usePublicDns() {
  const servers = (process.env.DNS_SERVERS ?? '8.8.8.8,1.1.1.1')
    .split(',').map(s => s.trim()).filter(Boolean);
  if (servers.length) dns.setServers(servers);
}

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri || uri.includes('<user>')) {
    console.error('\nMONGO_URI is not set. Copy .env.example to .env and paste your Atlas connection string.\n');
    process.exit(1);
  }
  usePublicDns();
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
    console.log('MongoDB connected');
  } catch (e) {
    console.error(`\nCould not connect to MongoDB: ${e.message}\n`);
    console.error('Things to check:');
    console.error('  1. Atlas > Network Access: add your current IP address (or 0.0.0.0/0 while testing).');
    console.error('  2. The username and password in MONGO_URI are correct. Special characters in the password must be URL-encoded.');
    console.error('  3. If the DNS error persists, use the standard connection string that starts with mongodb:// instead of mongodb+srv://.');
    console.error('     In Atlas: Connect > Drivers, then choose an older Node.js driver version (2.2.12 or later).\n');
    process.exit(1);
  }
}
