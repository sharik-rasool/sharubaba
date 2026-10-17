import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import DomainCache, { CountryTrafficData, TrafficHistoryPoint } from '@/models/DomainCache';
import { trackApiCost } from '@/lib/trackApiCost';

interface CacheEntry {
  data: AuthorityData;
  timestamp: number;
}

interface AuthorityData {
  domain: string;
  domainRating: number;
  ahrefsRank?: number;
  organicTraffic: number;
  trafficFormatted: string;
  referringDomains: number;
  backlinks: number;
  organicKeywords: number;
  authorityTier: string;
  healthScore: number;
  verdict: string;
  recommendation: string;
  source: 'live' | 'simulation';
  topCountries?: CountryTrafficData[];
  trafficHistory?: TrafficHistoryPoint[];
  analyzedAt: string;
  cached?: boolean;
  cacheExpiresInDays?: number;
}

// Tier 1 In-memory cache for ultra-fast response (<1ms)
const inMemoryCache = new Map<string, CacheEntry>();

// Cache TTL: 15 Days (Balances fresh data with high API credit conservation)
const CACHE_TTL_DAYS = 15;
const CACHE_TTL_MS = CACHE_TTL_DAYS * 24 * 60 * 60 * 1000;

// Helper to clean and normalize domains
function cleanDomain(input: string): string {
  let cleaned = input.trim().toLowerCase();
  cleaned = cleaned.replace(/^https?:\/\//, '');
  cleaned = cleaned.replace(/^www\./, '');
  cleaned = cleaned.split('/')[0];
  cleaned = cleaned.split('?')[0];
  cleaned = cleaned.split('#')[0];
  cleaned = cleaned.split(':')[0]; // remove port if any
  return cleaned;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

function getCountryName(code: string): string {
  try {
    if (!code || code.length !== 2) return code || 'Global';
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return regionNames.of(code.toUpperCase()) || code;
  } catch {
    return code;
  }
}

function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return '🌐';
  }
}

function getTierAndRecommendations(dr: number, traffic: number) {
  if (dr >= 80) {
    return {
      tier: 'Elite Industry Authority (DR 80+)',
      healthScore: 96,
      verdict: 'Dominant search footprint with unbeatable backlink equity and category leadership.',
      recommendation: 'Protect rankings with high-tier digital PR, brand mentions, and enterprise topical clustering.',
    };
  }
  if (dr >= 60) {
    return {
      tier: 'High Authority Brand (DR 60–79)',
      healthScore: 84,
      verdict: 'Strong search visibility and established link profile capable of ranking for competitive commercial terms.',
      recommendation: 'Target high-intent competitor link gaps and acquire DR70+ contextual editorial placements.',
    };
  }
  if (dr >= 40) {
    return {
      tier: 'Growing SaaS / Mid-Market (DR 40–59)',
      healthScore: 70,
      verdict: 'Solid foundation with consistent organic visibility, but vulnerable to aggressive competitor link building.',
      recommendation: 'Scale manual guest post outreach, high-DR SaaS resource link insertions, and anchor text diversification.',
    };
  }
  if (dr >= 20) {
    return {
      tier: 'Emerging Website (DR 20–39)',
      healthScore: 54,
      verdict: 'Developing domain authority with ranking potential on low-to-medium difficulty keywords.',
      recommendation: 'Execute a dedicated link building sprint to reach DR50+ and unlock first-page Google rankings.',
    };
  }
  return {
    tier: 'Early Stage / New Domain (DR 0–19)',
    healthScore: 38,
    verdict: 'Limited backlink equity. Google requires more trust signals before ranking pages for high-volume keywords.',
    recommendation: 'Build foundation authority links, secure founder interviews, and establish high-quality contextual SaaS backlinks.',
  };
}

// Generate a realistic 6-month historical trajectory ending at current traffic
function generateTrafficHistory(currentTraffic: number, currentKeywords: number): TrafficHistoryPoint[] {
  const points: TrafficHistoryPoint[] = [];
  const now = new Date();
  
  // Historical multipliers showing natural organic movement
  const multipliers = [0.81, 0.85, 0.91, 0.88, 0.96, 1.0];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const monthIndex = d.getMonth();
    const monthShort = d.toLocaleString('en-US', { month: 'short' });
    const yearShort = String(year).slice(-2);
    const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
    const label = `${monthShort} '${yearShort}`;

    const mult = multipliers[5 - i];
    // Gentle pseudo-variance so each month looks organic
    const variance = 1 + (((monthIndex * 5) % 7) - 3) * 0.015;
    const trafficVal = i === 0 ? currentTraffic : Math.max(10, Math.round(currentTraffic * mult * variance));
    const kwVal = i === 0 ? currentKeywords : Math.max(5, Math.round(currentKeywords * mult * variance));

    points.push({
      date: dateStr,
      label,
      traffic: trafficVal,
      keywords: kwVal,
    });
  }

  return points;
}

// Generate realistic simulated metrics when Ahrefs API key is not supplied or for testing
function generateSimulatedData(domain: string): AuthorityData {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = domain.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash);

  const knownDomains: Record<string, { dr: number; traffic: number; refDomains: number; backlinks: number; keywords: number }> = {
    'stripe.com': { dr: 92, traffic: 18450000, refDomains: 142000, backlinks: 12800000, keywords: 284000 },
    'ahrefs.com': { dr: 91, traffic: 8900000, refDomains: 98000, backlinks: 9200000, keywords: 195000 },
    'notion.so': { dr: 89, traffic: 24200000, refDomains: 112000, backlinks: 14500000, keywords: 340000 },
    'linear.app': { dr: 79, traffic: 1450000, refDomains: 12400, backlinks: 240000, keywords: 48000 },
    'sharikrasool.com': { dr: 48, traffic: 12500, refDomains: 520, backlinks: 4800, keywords: 1420 },
    'github.com': { dr: 96, traffic: 145000000, refDomains: 950000, backlinks: 140000000, keywords: 2400000 },
    'vercel.com': { dr: 88, traffic: 6200000, refDomains: 54000, backlinks: 2100000, keywords: 110000 },
  };

  let dr = 0;
  let traffic = 0;
  let refDomains = 0;
  let backlinks = 0;
  let keywords = 0;

  if (knownDomains[domain]) {
    const d = knownDomains[domain];
    dr = d.dr;
    traffic = d.traffic;
    refDomains = d.refDomains;
    backlinks = d.backlinks;
    keywords = d.keywords;
  } else {
    dr = 20 + (absHash % 62);
    refDomains = Math.floor((dr * dr) * (1.2 + (absHash % 10) * 0.1));
    backlinks = Math.floor(refDomains * (5 + (absHash % 12)));
    traffic = Math.floor(refDomains * (15 + (absHash % 40)));
    keywords = Math.floor(traffic / 8) + 120;
  }

  const { tier, healthScore, verdict, recommendation } = getTierAndRecommendations(dr, traffic);

  const simulatedCountries: CountryTrafficData[] = [
    {
      countryCode: 'US',
      countryName: 'United States',
      flagEmoji: '🇺🇸',
      traffic: Math.floor(traffic * 0.46),
      trafficFormatted: `${formatNumber(Math.floor(traffic * 0.46))} /mo`,
      percentage: 46,
      keywords: Math.floor(keywords * 0.48),
    },
    {
      countryCode: 'GB',
      countryName: 'United Kingdom',
      flagEmoji: '🇬🇧',
      traffic: Math.floor(traffic * 0.18),
      trafficFormatted: `${formatNumber(Math.floor(traffic * 0.18))} /mo`,
      percentage: 18,
      keywords: Math.floor(keywords * 0.19),
    },
    {
      countryCode: 'IN',
      countryName: 'India',
      flagEmoji: '🇮🇳',
      traffic: Math.floor(traffic * 0.14),
      trafficFormatted: `${formatNumber(Math.floor(traffic * 0.14))} /mo`,
      percentage: 14,
      keywords: Math.floor(keywords * 0.13),
    },
    {
      countryCode: 'CA',
      countryName: 'Canada',
      flagEmoji: '🇨🇦',
      traffic: Math.floor(traffic * 0.09),
      trafficFormatted: `${formatNumber(Math.floor(traffic * 0.09))} /mo`,
      percentage: 9,
      keywords: Math.floor(keywords * 0.09),
    },
    {
      countryCode: 'AU',
      countryName: 'Australia',
      flagEmoji: '🇦🇺',
      traffic: Math.floor(traffic * 0.06),
      trafficFormatted: `${formatNumber(Math.floor(traffic * 0.06))} /mo`,
      percentage: 6,
      keywords: Math.floor(keywords * 0.06),
    },
  ];

  return {
    domain,
    domainRating: dr,
    ahrefsRank: Math.floor(10000000 / (dr * dr || 1)),
    organicTraffic: traffic,
    trafficFormatted: `${formatNumber(traffic)} /mo`,
    referringDomains: refDomains,
    backlinks,
    organicKeywords: keywords,
    authorityTier: tier,
    healthScore,
    verdict,
    recommendation,
    source: 'simulation',
    topCountries: simulatedCountries,
    trafficHistory: generateTrafficHistory(traffic, keywords),
    analyzedAt: new Date().toISOString(),
  };
}

export async function POST(request: Request) {
  try {
    const rawIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip')?.trim() ||
      request.headers.get('cf-connecting-ip')?.trim() ||
      '127.0.0.1';
    const ip = rawIp;

    const body = await request.json();
    const rawDomain = body.domain || '';
    const forceRefresh = body.refresh === true;
    const domain = cleanDomain(rawDomain);

    if (!domain || domain.length < 3 || !domain.includes('.')) {
      return NextResponse.json(
        { error: 'Please enter a valid website domain name (e.g. stripe.com).' },
        { status: 400 }
      );
    }

    // -------------------------------------------------------------
    // Tier 1: Check In-Memory Cache (if not forcing refresh)
    // -------------------------------------------------------------
    if (!forceRefresh) {
      const memoryHit = inMemoryCache.get(domain);
      if (memoryHit && Date.now() - memoryHit.timestamp < CACHE_TTL_MS) {
        const remainingDays = Math.ceil((CACHE_TTL_MS - (Date.now() - memoryHit.timestamp)) / (24 * 60 * 60 * 1000));
        
        // Log Cache Hit ($0.00 cost)
        await trackApiCost({
          tool: 'Website Authority Checker',
          domain,
          source: 'CACHE_HIT',
          creditsUsed: 0,
          estimatedCostUsd: 0,
          ip,
          details: 'In-memory cache (<1ms)',
        });

        return NextResponse.json({
          success: true,
          data: {
            ...memoryHit.data,
            cached: true,
            cacheExpiresInDays: remainingDays,
          },
        });
      }
    }

    // -------------------------------------------------------------
    // Tier 2: Check MongoDB Persistent Cache (15 Days TTL)
    // -------------------------------------------------------------
    let dbConnected = false;
    try {
      await connectDB();
      dbConnected = true;

      if (!forceRefresh) {
        const dbCached = await DomainCache.findOne({ domain }).lean();
        if (dbCached && dbCached.updatedAt) {
          const ageMs = Date.now() - new Date(dbCached.updatedAt).getTime();
          if (ageMs < CACHE_TTL_MS) {
            const data: AuthorityData = {
              domain: dbCached.domain,
              domainRating: dbCached.domainRating,
              ahrefsRank: dbCached.ahrefsRank,
              organicTraffic: dbCached.organicTraffic,
              trafficFormatted: dbCached.trafficFormatted || `${formatNumber(dbCached.organicTraffic)} /mo`,
              referringDomains: dbCached.referringDomains,
              backlinks: dbCached.backlinks,
              organicKeywords: dbCached.organicKeywords,
              authorityTier: dbCached.authorityTier,
              healthScore: dbCached.healthScore,
              verdict: dbCached.verdict,
              recommendation: dbCached.recommendation,
              source: dbCached.source as 'live' | 'simulation',
              topCountries: (dbCached.topCountries as CountryTrafficData[]) || [],
              trafficHistory: (dbCached.trafficHistory && dbCached.trafficHistory.length > 0)
                ? (dbCached.trafficHistory as TrafficHistoryPoint[])
                : generateTrafficHistory(dbCached.organicTraffic, dbCached.organicKeywords),
              analyzedAt: dbCached.analyzedAt || new Date(dbCached.updatedAt).toISOString(),
              cached: true,
              cacheExpiresInDays: Math.ceil((CACHE_TTL_MS - ageMs) / (24 * 60 * 60 * 1000)),
            };

            // Warm up in-memory cache
            inMemoryCache.set(domain, { data, timestamp: new Date(dbCached.updatedAt).getTime() });

            // Log MongoDB Cache Hit ($0.00 cost)
            await trackApiCost({
              tool: 'Website Authority Checker',
              domain,
              source: 'CACHE_HIT',
              creditsUsed: 0,
              estimatedCostUsd: 0,
              ip,
              details: `MongoDB persistent cache (${data.cacheExpiresInDays}d remaining)`,
            });

            return NextResponse.json({ success: true, data });
          }
        }
      }
    } catch (dbErr) {
      console.warn('[DOMAIN RATING] DB cache read skipped/failed:', dbErr);
    }

    // -------------------------------------------------------------
    // Tier 3: Fetch Live from Ahrefs API v3
    // -------------------------------------------------------------
    const ahrefsApiKey = process.env.AHREFS_API_KEY;

    if (ahrefsApiKey) {
      try {
        const today = new Date().toISOString().split('T')[0];
        const sixMonthsAgoDate = new Date();
        sixMonthsAgoDate.setMonth(sixMonthsAgoDate.getMonth() - 6);
        const sixMonthsAgo = sixMonthsAgoDate.toISOString().split('T')[0];

        const headers = {
          Authorization: `Bearer ${ahrefsApiKey}`,
          Accept: 'application/json',
        };

        // Call Ahrefs v3 endpoints in parallel with 6s timeout
        const [drRes, metricsRes, backlinksRes, countriesRes, historyRes] = await Promise.allSettled([
          fetch(
            `https://api.ahrefs.com/v3/site-explorer/domain-rating?target=${encodeURIComponent(domain)}&date=${today}`,
            { headers, next: { revalidate: 86400 }, signal: AbortSignal.timeout(6000) }
          ),
          fetch(
            `https://api.ahrefs.com/v3/site-explorer/metrics?target=${encodeURIComponent(domain)}&date=${today}`,
            { headers, next: { revalidate: 86400 }, signal: AbortSignal.timeout(6000) }
          ),
          fetch(
            `https://api.ahrefs.com/v3/site-explorer/backlinks-stats?target=${encodeURIComponent(domain)}&date=${today}`,
            { headers, next: { revalidate: 86400 }, signal: AbortSignal.timeout(6000) }
          ),
          fetch(
            `https://api.ahrefs.com/v3/site-explorer/metrics-by-country?target=${encodeURIComponent(domain)}&date=${today}&limit=5&order_by=org_traffic:desc`,
            { headers, next: { revalidate: 86400 }, signal: AbortSignal.timeout(6000) }
          ),
          fetch(
            `https://api.ahrefs.com/v3/site-explorer/metrics-history?target=${encodeURIComponent(domain)}&date_from=${sixMonthsAgo}&history_grouping=monthly`,
            { headers, next: { revalidate: 86400 }, signal: AbortSignal.timeout(6000) }
          ),
        ]);

        let dr = 0;
        let ahrefsRank = 0;
        let traffic = 0;
        let keywords = 0;
        let refDomains = 0;
        let backlinks = 0;
        let hasLiveDr = false;
        let topCountries: CountryTrafficData[] = [];
        let trafficHistory: TrafficHistoryPoint[] = [];

        if (drRes.status === 'fulfilled' && drRes.value.ok) {
          const drData = await drRes.value.json();
          dr = Math.round(drData.domain_rating?.domain_rating ?? 0);
          ahrefsRank = drData.domain_rating?.ahrefs_rank ?? 0;
          hasLiveDr = true;
        }

        if (metricsRes.status === 'fulfilled' && metricsRes.value.ok) {
          const metricsData = await metricsRes.value.json();
          traffic = metricsData.metrics?.org_traffic ?? 0;
          keywords = metricsData.metrics?.org_keywords ?? 0;
        }

        if (backlinksRes.status === 'fulfilled' && backlinksRes.value.ok) {
          const backlinksData = await backlinksRes.value.json();
          refDomains = backlinksData.metrics?.live_refdomains ?? backlinksData.metrics?.all_time_refdomains ?? 0;
          backlinks = backlinksData.metrics?.live ?? backlinksData.metrics?.all_time ?? 0;
        }

        interface AhrefsCountryMetric {
          country?: string;
          org_traffic?: number;
          org_keywords?: number;
          paid_traffic?: number;
        }

        if (countriesRes.status === 'fulfilled' && countriesRes.value.ok) {
          const countriesData = await countriesRes.value.json();
          if (Array.isArray(countriesData.metrics) && countriesData.metrics.length > 0) {
            const countryList = countriesData.metrics as AhrefsCountryMetric[];
            const sumTraffic = traffic > 0 ? traffic : countryList.reduce((acc: number, item: AhrefsCountryMetric) => acc + (item.org_traffic || 0), 0);
            topCountries = countryList.slice(0, 5).map((item: AhrefsCountryMetric) => {
              const cCode = (item.country || '').toUpperCase();
              const cTraffic = item.org_traffic || 0;
              const pct = sumTraffic > 0 ? Math.max(1, Math.min(100, Math.round((cTraffic / sumTraffic) * 100))) : 0;
              return {
                countryCode: cCode,
                countryName: getCountryName(cCode),
                flagEmoji: getFlagEmoji(cCode),
                traffic: cTraffic,
                trafficFormatted: `${formatNumber(cTraffic)} /mo`,
                percentage: pct,
                keywords: item.org_keywords || 0,
              };
            });
          }
        }

        if (historyRes.status === 'fulfilled' && historyRes.value.ok) {
          try {
            const historyData = await historyRes.value.json();
            if (Array.isArray(historyData.metrics) && historyData.metrics.length > 0) {
              interface AhrefsHistoryMetric {
                date?: string;
                org_traffic?: number;
                org_keywords?: number;
              }
              const metricsArray = historyData.metrics as AhrefsHistoryMetric[];
              trafficHistory = metricsArray.slice(-6).map((item: AhrefsHistoryMetric) => {
                const itemDate = item.date || '';
                const parts = itemDate.split('-');
                let label = itemDate;
                if (parts.length >= 2) {
                  const year = parts[0];
                  const monthNum = parseInt(parts[1], 10);
                  const monthDate = new Date(parseInt(year, 10), monthNum - 1, 1);
                  if (!isNaN(monthDate.getTime())) {
                    const monthShort = monthDate.toLocaleString('en-US', { month: 'short' });
                    label = `${monthShort} '${year.slice(-2)}`;
                  }
                }
                return {
                  date: itemDate,
                  label,
                  traffic: item.org_traffic ?? 0,
                  keywords: item.org_keywords ?? 0,
                };
              });
            }
          } catch (hErr) {
            console.warn('[AHREFS API] Failed parsing metrics-history JSON:', hErr);
          }
        }

        // If Ahrefs metrics-history returned empty or was unavailable, generate realistic 6-month trajectory based on live traffic
        if (trafficHistory.length === 0) {
          trafficHistory = generateTrafficHistory(traffic, keywords);
        }

        if (hasLiveDr) {
          const { tier, healthScore, verdict, recommendation } = getTierAndRecommendations(dr, traffic);

          const result: AuthorityData = {
            domain,
            domainRating: dr,
            ahrefsRank,
            organicTraffic: traffic,
            trafficFormatted: `${formatNumber(traffic)} /mo`,
            referringDomains: refDomains,
            backlinks,
            organicKeywords: keywords,
            authorityTier: tier,
            healthScore,
            verdict,
            recommendation,
            source: 'live',
            topCountries: topCountries.length > 0 ? topCountries : undefined,
            trafficHistory: trafficHistory.length > 0 ? trafficHistory : undefined,
            analyzedAt: new Date().toISOString(),
            cached: false,
            cacheExpiresInDays: CACHE_TTL_DAYS,
          };

          // Save to memory cache
          inMemoryCache.set(domain, { data: result, timestamp: Date.now() });

          // Save / Upsert to MongoDB persistent cache
          if (dbConnected) {
            try {
              await DomainCache.findOneAndUpdate(
                { domain },
                {
                  $set: {
                    ...result,
                    analyzedAt: result.analyzedAt,
                  },
                },
                { upsert: true, new: true }
              );
            } catch (saveErr) {
              console.warn('[DOMAIN RATING] Failed saving to DB cache:', saveErr);
            }
          }

          // Log Live Ahrefs API Cost (5 credits = ~$0.05)
          await trackApiCost({
            tool: 'Website Authority Checker',
            domain,
            source: 'LIVE_AHREFS_API',
            creditsUsed: 5,
            estimatedCostUsd: 0.05,
            ip,
            details: `Ahrefs v3 Live: DR ${dr} | Traffic ${formatNumber(traffic)} | RefDomains ${formatNumber(refDomains)}`,
          });

          return NextResponse.json({ success: true, data: result });
        }
      } catch (apiError) {
        console.warn('[AHREFS API] Live lookup failed, falling back to simulated data:', apiError);
      }
    }

    // -------------------------------------------------------------
    // Tier 4: Fallback Simulation Data
    // -------------------------------------------------------------
    const simulated = generateSimulatedData(domain);
    inMemoryCache.set(domain, { data: simulated, timestamp: Date.now() });

    // Log Simulation ($0.00 cost)
    await trackApiCost({
      tool: 'Website Authority Checker',
      domain,
      source: 'SIMULATED',
      creditsUsed: 0,
      estimatedCostUsd: 0,
      ip,
      details: 'Simulation fallback (no API credits used)',
    });

    return NextResponse.json({ success: true, data: simulated });
  } catch (error) {
    console.error('[DOMAIN RATING API ERROR]', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while analyzing domain authority.' },
      { status: 500 }
    );
  }
}
