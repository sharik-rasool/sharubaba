import connectDB from '@/lib/db';
import ApiCostLog from '@/models/ApiCostLog';

export interface TrackApiCostParams {
  tool: 'Website Authority Checker' | 'Competitor Backlink Gap Checker';
  domain: string;
  source: 'LIVE_AHREFS_API' | 'CACHE_HIT' | 'SIMULATED';
  creditsUsed: number;
  estimatedCostUsd: number;
  ip?: string;
  status?: 'success' | 'error';
  details?: string;
}

export async function trackApiCost(params: TrackApiCostParams): Promise<void> {
  const {
    tool,
    domain,
    source,
    creditsUsed,
    estimatedCostUsd,
    ip = '127.0.0.1',
    status = 'success',
    details = '',
  } = params;

  const now = new Date();

  // 1. Save to MongoDB (Non-blocking)
  try {
    const conn = await connectDB();
    if (conn) {
      await ApiCostLog.create({
        tool,
        domain: domain.toLowerCase(),
        source,
        creditsUsed,
        estimatedCostUsd,
        ip,
        status,
        details,
      });
    }
  } catch (dbErr) {
    console.warn('[API COST TRACKER] MongoDB log warning:', dbErr);
  }

  // 2. Dispatch to existing Google Sheets Webhook (Non-blocking)
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const cacheSavings = source === 'CACHE_HIT' ? (tool === 'Website Authority Checker' ? 0.05 : 0.01) : 0;
      const savingsText = source === 'CACHE_HIT' ? ` ($${cacheSavings.toFixed(2)} Saved via Cache)` : '';
      const dateStr = now.toISOString().split('T')[0];
      const pagePath = tool === 'Website Authority Checker' 
        ? '/tools/website-authority-checker' 
        : '/tools/backlink-gap-checker';

      const sheetPayload = {
        action: 'api_cost_log',
        tab: 'API Tracking',
        timestamp: now.toISOString(),
        date: dateStr,
        tool,
        page: pagePath,
        domain,
        source,
        credits: creditsUsed,
        cost: Number(estimatedCostUsd.toFixed(2)),
        savings: cacheSavings,
        status,
        details,
        ip_address: ip,
        // Legacy fallback fields
        type: `API Cost Log: ${tool}`,
        name: `[API] ${tool}`,
        email: 'api-tracker@sharikrasool.com',
        website: domain,
        company: `${source} • ${creditsUsed} Credits • $${estimatedCostUsd.toFixed(2)}${savingsText}`,
        message: `[${tool}] Target: ${domain} | Source: ${source} | Credits: ${creditsUsed} | Est. Cost: $${estimatedCostUsd.toFixed(2)}${savingsText} | IP: ${ip} | Status: ${status}${details ? ` | ${details}` : ''}`,
      };

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sheetPayload),
        redirect: 'follow',
        signal: AbortSignal.timeout(6000),
      });
      if (!res.ok) {
        console.warn(`[API COST TRACKER] Google Sheets webhook returned status ${res.status}`);
      }
    } catch (sheetErr) {
      console.warn('[API COST TRACKER] Google Sheets webhook error:', sheetErr);
    }
  }
}
