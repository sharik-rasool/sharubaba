import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import connectDB from '../src/lib/db';
import ToolAccessKey from '../src/models/ToolAccessKey';

async function main() {
  await connectDB();
  const keys = await ToolAccessKey.find({}).sort({ createdAt: -1 }).lean();

  const todayStr = new Date().toISOString().split('T')[0];

  console.log('\n========================================================================================');
  console.log('                   COMPETITOR BACKLINK GAP CHECKER — LICENSE USAGE                      ');
  console.log('========================================================================================\n');

  if (keys.length === 0) {
    console.log('No keys found in database.');
    process.exit(0);
  }

  const tableData = keys.map((k) => {
    const todayUsage = k.dailyUsage?.find((u) => u.date === todayStr)?.count || 0;
    
    let daysRemaining = 'Lifetime';
    if (k.expiresAt) {
      const msLeft = new Date(k.expiresAt).getTime() - Date.now();
      const days = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
      daysRemaining = days > 0 ? `${days} days` : 'EXPIRED';
    }

    return {
      Name: k.name,
      Email: k.email,
      Key: k.key,
      Status: k.status.toUpperCase(),
      "Today's Scans": `${todayUsage} / ${k.dailyLimit || 20}`,
      'Total Scans': k.totalUsage || 0,
      'Expires In': daysRemaining,
    };
  });

  console.table(tableData);
  console.log(`\nTotal Registered Keys: ${keys.length}\n`);
  process.exit(0);
}

main();
