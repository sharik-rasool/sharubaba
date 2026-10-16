import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// Inline schema definition for standalone execution
const ToolAccessKeySchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    status: { type: String, enum: ['active', 'expired', 'revoked'], default: 'active' },
    activatedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    dailyLimit: { type: Number, default: 20 },
    dailyUsage: [{ date: { type: String }, count: { type: Number, default: 0 } }],
    totalUsage: { type: Number, default: 0 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

const ToolAccessKey =
  mongoose.models.ToolAccessKey || mongoose.model('ToolAccessKey', ToolAccessKeySchema);

function generateKeyString(name: string): string {
  const cleanName = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 10);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 random digits
  return `GAP-${cleanName}-${randomSuffix}`;
}

async function createKey(name: string, email: string, notes: string = '') {
  const key = generateKeyString(name);
  const doc = await ToolAccessKey.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    {
      $setOnInsert: {
        key,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        status: 'active',
        dailyLimit: 20,
        notes,
      },
    },
    { upsert: true, new: true }
  );

  return doc;
}

async function main() {
  const args = process.argv.slice(2);

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected successfully.\n');

    // Case 1: Custom single key via CLI args
    if (args.length >= 2) {
      const name = args[0];
      const email = args[1];
      const doc = await createKey(name, email, 'Generated via CLI');
      console.log('====================================================');
      console.log(`✅ ACCESS KEY GENERATED:`);
      console.log(`   Key:         ${doc.key}`);
      console.log(`   Assigned To: ${doc.name} (${doc.email})`);
      console.log(`   Daily Limit: ${doc.dailyLimit} scans / day`);
      console.log(`   Status:      ${doc.status}`);
      console.log(`   Validity:    90 days (starts automatically on first search)`);
      console.log('====================================================\n');
      process.exit(0);
    }

    // Case 2: Seed the 3 requested team keys
    console.log('Generating initial keys for Safora, Sharik, and Mushahid...\n');

    const initialUsers = [
      { name: 'Safora', email: 'saforabeigh@gmail.com' },
      { name: 'Sharik', email: 'shariksr7@gmail.com' },
      { name: 'Mushahid', email: 'mushahid.marketinglad@gmail.com' },
    ];

    console.log('====================================================');
    for (const u of initialUsers) {
      const existing = await ToolAccessKey.findOne({ email: u.email.toLowerCase() });
      if (existing) {
        console.log(`🔑 Existing Key Found for ${u.name}:`);
        console.log(`   Key:   ${existing.key}`);
        console.log(`   Email: ${existing.email}`);
        console.log(`   Limit: ${existing.dailyLimit} scans/day`);
      } else {
        const doc = await createKey(u.name, u.email, 'Founding Member');
        console.log(`✨ Created New Key for ${u.name}:`);
        console.log(`   Key:   ${doc.key}`);
        console.log(`   Email: ${doc.email}`);
        console.log(`   Limit: ${doc.dailyLimit} scans/day`);
      }
      console.log('----------------------------------------------------');
    }
    console.log('====================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Error generating key:', err);
    process.exit(1);
  }
}

main();
