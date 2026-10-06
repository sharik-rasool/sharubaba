import { NextResponse } from 'next/server';

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
  analyzedAt: string;
}

// In-memory 24-hour cache for queried domains to conserve Ahrefs API credits
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

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

// Generate realistic simulated metrics when Ahrefs API key is not supplied or for testing
function generateSimulatedData(domain: string): AuthorityData {
  // Deterministic seed based on domain string
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = domain.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash);

  // Famous domains override
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
    dr = 20 + (absHash % 62); // 20 - 81
    refDomains = Math.floor((dr * dr) * (1.2 + (absHash % 10) * 0.1));
    backlinks = Math.floor(refDomains * (5 + (absHash % 12)));
    traffic = Math.floor(refDomains * (15 + (absHash % 40)));
    keywords = Math.floor(traffic / 8) + 120;
  }

  const { tier, healthScore, verdict, recommendation } = getTierAndRecommendations(dr, traffic);

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
    analyzedAt: new Date().toISOString(),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawDomain = body.domain || '';
    const domain = cleanDomain(rawDomain);

    if (!domain || domain.length < 3 || !domain.includes('.')) {
      return NextResponse.json(
        { error: 'Please enter a valid website domain name (e.g. stripe.com).' },
        { status: 400 }
      );
    }

    // Check cache
    const cached = cache.get(domain);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ success: true, data: cached.data });
    }

    const ahrefsApiKey = process.env.AHREFS_API_KEY;

    if (ahrefsApiKey) {
      try {
        const today = new Date().toISOString().split('T')[0];
        const headers = {
          Authorization: `Bearer ${ahrefsApiKey}`,
          Accept: 'application/json',
        };

        // Call Ahrefs v3 endpoints in parallel
        const [drRes, metricsRes, backlinksRes] = await Promise.allSettled([
          fetch(
            `https://api.ahrefs.com/v3/site-explorer/domain-rating?target=${encodeURIComponent(domain)}&date=${today}`,
            { headers, next: { revalidate: 86400 } }
          ),
          fetch(
            `https://api.ahrefs.com/v3/site-explorer/metrics?target=${encodeURIComponent(domain)}&date=${today}`,
            { headers, next: { revalidate: 86400 } }
          ),
          fetch(
            `https://api.ahrefs.com/v3/site-explorer/backlinks-stats?target=${encodeURIComponent(domain)}&date=${today}`,
            { headers, next: { revalidate: 86400 } }
          ),
        ]);

        let dr = 0;
        let ahrefsRank = 0;
        let traffic = 0;
        let keywords = 0;
        let refDomains = 0;
        let backlinks = 0;
        let hasLiveDr = false;

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
            analyzedAt: new Date().toISOString(),
          };

          cache.set(domain, { data: result, timestamp: Date.now() });
          return NextResponse.json({ success: true, data: result });
        }
      } catch (apiError) {
        console.warn('[AHREFS API] Live lookup failed, falling back to simulated data:', apiError);
      }
    }

    // Fallback if no API key or API call failed
    const simulated = generateSimulatedData(domain);
    cache.set(domain, { data: simulated, timestamp: Date.now() });

    return NextResponse.json({ success: true, data: simulated });
  } catch (error) {
    console.error('[DOMAIN RATING API ERROR]', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while analyzing domain authority.' },
      { status: 500 }
    );
  }
}
