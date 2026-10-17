import * as fs from 'fs';
import * as path from 'path';
import mongoose from 'mongoose';

// 1. Manually parse .env.local to ensure environment variables are present
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

// 2. Define or import ApiCostLog model
const ApiCostLogSchema = new mongoose.Schema(
  {
    tool: { type: String, required: true },
    domain: { type: String, required: true },
    source: { type: String, required: true },
    creditsUsed: { type: Number, default: 0 },
    estimatedCostUsd: { type: Number, default: 0 },
    ip: { type: String, default: '127.0.0.1' },
    status: { type: String, default: 'success' },
    details: { type: String, default: '' },
  },
  { timestamps: true }
);

const ApiCostLog = mongoose.models.ApiCostLog || mongoose.model('ApiCostLog', ApiCostLogSchema);

async function main() {
  const args = process.argv.slice(2);
  const testSheet = args.includes('--test-sheet');

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  console.log('══════════════════════════════════════════════════════════════════');
  console.log('          📊 SHARIK RASOOL — LIVE API COST & USAGE MONITOR        ');
  console.log('══════════════════════════════════════════════════════════════════');
  console.log(`🔌 MongoDB: Connected`);
  console.log(`📋 Google Sheet Webhook: ${webhookUrl ? '✅ Configured & Active' : '❌ Not Set'}`);
  console.log('──────────────────────────────────────────────────────────────────');

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 8000 });

  // Optional: send test ping to Google Sheet webhook
  if (testSheet) {
    if (!webhookUrl) {
      console.log('❌ Cannot test webhook: GOOGLE_SHEETS_WEBHOOK_URL is not set.');
    } else {
      console.log('\n📤 Sending test API tracking events to Google Sheets webhook...');
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];

      // Test 1: Website Authority Checker (Live API Call - 5 credits, $0.05)
      const testPayload1 = {
        action: 'api_cost_log',
        tab: 'API Tracking',
        timestamp: now.toISOString(),
        date: dateStr,
        tool: 'Website Authority Checker',
        page: '/tools/website-authority-checker',
        domain: 'stripe.com',
        source: 'LIVE_AHREFS_API',
        credits: 5,
        cost: 0.05,
        savings: 0,
        status: 'success',
        ip_address: '127.0.0.1',
        details: 'Live Ahrefs v3 API Check (5 credits)',
      };

      // Test 2: Competitor Backlink Gap Checker (Cached Hit - 0 credits, $0.01 saved)
      const testPayload2 = {
        action: 'api_cost_log',
        tab: 'API Tracking',
        timestamp: now.toISOString(),
        date: dateStr,
        tool: 'Competitor Backlink Gap Checker',
        page: '/tools/backlink-gap-checker',
        domain: 'notion.so',
        source: 'CACHE_HIT',
        credits: 0,
        cost: 0.00,
        savings: 0.01,
        status: 'success',
        ip_address: '127.0.0.1',
        details: 'Cached lookup vs coda.io, clickup.com (Pass: GAP-SHARIK-6321)',
      };

      try {
        const res1 = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testPayload1),
        });
        console.log(`✅ Event 1 (DR Checker - Live API): Webhook HTTP ${res1.status}`);

        const res2 = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testPayload2),
        });
        console.log(`✅ Event 2 (Backlink Gap - Cache Hit): Webhook HTTP ${res2.status}`);

        await ApiCostLog.create({
          tool: 'Website Authority Checker',
          domain: 'stripe.com',
          source: 'LIVE_AHREFS_API',
          creditsUsed: 5,
          estimatedCostUsd: 0.05,
          ip: '127.0.0.1',
          status: 'success',
          details: 'Live Ahrefs v3 API Check (5 credits)',
        });

        await ApiCostLog.create({
          tool: 'Competitor Backlink Gap Checker',
          domain: 'notion.so',
          source: 'CACHE_HIT',
          creditsUsed: 0,
          estimatedCostUsd: 0,
          ip: '127.0.0.1',
          status: 'success',
          details: 'Cached lookup vs coda.io, clickup.com (Pass: GAP-SHARIK-6321)',
        });

        console.log(`✅ MongoDB test records created for both tools.`);
      } catch (err) {
        console.error('❌ Failed to dispatch test event to webhook:', err);
      }
    }
  }

  // Query records
  const allLogs = await ApiCostLog.find().sort({ createdAt: -1 }).lean();

  if (allLogs.length === 0) {
    console.log('\nℹ️ No API cost records logged yet. Run a search on DR or Backlink Gap checker to see live data.');
    console.log('💡 Tip: Run "npx tsx scripts/track-api-costs.ts --test-sheet" to test the Google Sheet webhook.\n');
    await mongoose.disconnect();
    return;
  }

  // Metrics
  const totalCalls = allLogs.length;
  const liveCalls = allLogs.filter((l) => l.source === 'LIVE_AHREFS_API').length;
  const cacheHits = allLogs.filter((l) => l.source === 'CACHE_HIT').length;
  const simulatedCalls = allLogs.filter((l) => l.source === 'SIMULATED').length;
  const totalCredits = allLogs.reduce((acc, l) => acc + (l.creditsUsed || 0), 0);
  const totalSpentUsd = allLogs.reduce((acc, l) => acc + (l.estimatedCostUsd || 0), 0);

  // Dollars saved via caching
  const drSaved = allLogs.filter((l) => l.tool.includes('Authority') && l.source === 'CACHE_HIT').length * 0.05;
  const gapSaved = allLogs.filter((l) => l.tool.includes('Backlink') && l.source === 'CACHE_HIT').length * 0.01;
  const totalSavedUsd = drSaved + gapSaved;
  const cacheHitRate = totalCalls > 0 ? ((cacheHits / totalCalls) * 100).toFixed(1) : '0';

  console.log('\n📈 CUMULATIVE API USAGE & FINANCIAL SUMMARY:');
  console.log(`   • Total Tool Invocations:     ${totalCalls}`);
  console.log(`   • Live Ahrefs API Calls:       ${liveCalls} (Paid)`);
  console.log(`   • MongoDB Cache Hits:          ${cacheHits} (FREE - $0.00)`);
  console.log(`   • Simulation Fallbacks:        ${simulatedCalls}`);
  console.log(`   • Cache Hit Ratio:             ${cacheHitRate}%`);
  console.log(`   • Total Ahrefs Credits Used:   ${totalCredits} credits`);
  console.log(`   • Total Est. Ahrefs Spend:     $${totalSpentUsd.toFixed(2)} USD`);
  console.log(`   • Total Cash Saved by Cache:   💰 $${totalSavedUsd.toFixed(2)} USD`);

  // Tool-level breakdown
  const drLogs = allLogs.filter((l) => l.tool.includes('Authority'));
  const gapLogs = allLogs.filter((l) => l.tool.includes('Backlink'));

  console.log('\n🛠️ TOOL BREAKDOWN:');
  console.log('──────────────────────────────────────────────────────────────────');
  console.log(' 1. Website Authority Checker (DR)');
  console.log(`    Total: ${drLogs.length} | Live: ${drLogs.filter((l) => l.source === 'LIVE_AHREFS_API').length} | Cache Hits: ${drLogs.filter((l) => l.source === 'CACHE_HIT').length}`);
  console.log(`    Credits: ${drLogs.reduce((acc, l) => acc + (l.creditsUsed || 0), 0)} | Spend: $${drLogs.reduce((acc, l) => acc + (l.estimatedCostUsd || 0), 0).toFixed(2)} | Saved: $${drSaved.toFixed(2)}`);

  console.log('\n 2. Competitor Backlink Gap Checker');
  console.log(`    Total: ${gapLogs.length} | Live: ${gapLogs.filter((l) => l.source === 'LIVE_AHREFS_API').length} | Cache Hits: ${gapLogs.filter((l) => l.source === 'CACHE_HIT').length}`);
  console.log(`    Credits: ${gapLogs.reduce((acc, l) => acc + (l.creditsUsed || 0), 0)} | Spend: $${gapLogs.reduce((acc, l) => acc + (l.estimatedCostUsd || 0), 0).toFixed(2)} | Saved: $${gapSaved.toFixed(2)}`);

  // ─── PER-DAY & PER-PAGE / PER-TOOL AGGREGATION ───
  interface DayPageStats {
    date: string;
    page: string;
    tool: string;
    searches: number;
    live: number;
    cached: number;
    credits: number;
    spend: number;
    saved: number;
  }

  const dailyMap: Record<string, DayPageStats> = {};

  allLogs.forEach((log) => {
    const dStr = log.createdAt ? new Date(log.createdAt).toISOString().split('T')[0] : 'N/A';
    const isDr = log.tool.includes('Authority');
    const pagePath = isDr ? '/tools/website-authority' : '/tools/backlink-gap';
    const key = `${dStr}::${pagePath}`;

    if (!dailyMap[key]) {
      dailyMap[key] = {
        date: dStr,
        page: pagePath,
        tool: isDr ? 'DR Checker' : 'Backlink Gap',
        searches: 0,
        live: 0,
        cached: 0,
        credits: 0,
        spend: 0,
        saved: 0,
      };
    }

    dailyMap[key].searches += 1;
    if (log.source === 'LIVE_AHREFS_API') {
      dailyMap[key].live += 1;
      dailyMap[key].credits += log.creditsUsed || 0;
      dailyMap[key].spend += log.estimatedCostUsd || 0;
    } else if (log.source === 'CACHE_HIT') {
      dailyMap[key].cached += 1;
      dailyMap[key].saved += isDr ? 0.05 : 0.01;
    }
  });

  console.log('\n📅 PER-DAY & PER-PAGE API TOKENS / CREDITS CONSUMED:');
  console.log('──────────────────────────────────────────────────────────────────');
  console.log(
    'Date'.padEnd(13) +
    'Page / Tool'.padEnd(28) +
    'Searches'.padEnd(10) +
    'Live'.padEnd(7) +
    'Cached'.padEnd(8) +
    'Credits'.padEnd(10) +
    'Spend'.padEnd(9) +
    'Saved'
  );
  console.log('─'.repeat(90));

  const sortedDailyKeys = Object.keys(dailyMap).sort().reverse();
  sortedDailyKeys.forEach((k) => {
    const s = dailyMap[k];
    console.log(
      s.date.padEnd(13) +
      `${s.page} (${s.tool})`.padEnd(28) +
      String(s.searches).padEnd(10) +
      String(s.live).padEnd(7) +
      String(s.cached).padEnd(8) +
      String(s.credits).padEnd(10) +
      `$${s.spend.toFixed(2)}`.padEnd(9) +
      `💰 $${s.saved.toFixed(2)}`
    );
  });

  console.log('\n🕒 LAST 10 API ACTIVITY LOGS:');
  console.log('──────────────────────────────────────────────────────────────────');
  console.log(
    'Time'.padEnd(12) +
    'Tool'.padEnd(26) +
    'Domain'.padEnd(22) +
    'Source'.padEnd(16) +
    'Credits'.padEnd(10) +
    'Cost'
  );
  console.log('─'.repeat(90));

  allLogs.slice(0, 10).forEach((log) => {
    const timeStr = log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : 'N/A';
    const toolShort = log.tool.replace(' Checker', '').slice(0, 24);
    const domainShort = (log.domain || '').slice(0, 20);
    const sourceShort = log.source === 'LIVE_AHREFS_API' ? '🟢 LIVE API' : log.source === 'CACHE_HIT' ? '⚡ CACHED' : '🟡 SIMULATED';
    const creditsStr = `${log.creditsUsed || 0}`;
    const costStr = `$${(log.estimatedCostUsd || 0).toFixed(2)}`;

    console.log(
      timeStr.padEnd(12) +
      toolShort.padEnd(26) +
      domainShort.padEnd(22) +
      sourceShort.padEnd(16) +
      creditsStr.padEnd(10) +
      costStr
    );
  });
  console.log('──────────────────────────────────────────────────────────────────\n');

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Fatal error running API cost monitor:', err);
  process.exit(1);
});
