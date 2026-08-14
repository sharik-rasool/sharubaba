import { ImageResponse } from 'next/og';

export const alt = 'Sharik Rasool — SEO Strategist & Link Builder for SaaS Brands';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const stats = [
    { value: 'DR 15 → 72', label: 'Domain Rating' },
    { value: '10K → 150K', label: 'Monthly Traffic' },
    { value: '500+', label: 'High-Auth Backlinks' },
];

export default async function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '72px',
                    background: '#0a0e14',
                    backgroundImage:
                        'radial-gradient(circle at 82% 18%, rgba(34,197,94,0.28), transparent 55%), radial-gradient(circle at 8% 92%, rgba(34,197,94,0.14), transparent 45%)',
                    fontFamily: 'sans-serif',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: '#22c55e',
                            color: '#0a0e14',
                            fontSize: 24,
                            fontWeight: 800,
                        }}
                    >
                        S
                    </div>
                    <div style={{ display: 'flex', color: '#94a3b8', fontSize: 24, fontWeight: 600 }}>
                        sharikrasool.com
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div
                        style={{
                            display: 'flex',
                            color: '#ffffff',
                            fontSize: 66,
                            fontWeight: 800,
                            lineHeight: 1.08,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        SEO Strategist &amp; Link Builder for SaaS Brands
                    </div>
                    <div style={{ display: 'flex', color: '#94a3b8', fontSize: 28, fontWeight: 500 }}>
                        Sharik Rasool — 7+ years driving organic growth through data-driven SEO
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 20 }}>
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 6,
                                padding: '20px 28px',
                                borderRadius: 16,
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(34,197,94,0.35)',
                            }}
                        >
                            <div style={{ display: 'flex', color: '#22c55e', fontSize: 30, fontWeight: 800 }}>
                                {stat.value}
                            </div>
                            <div style={{ display: 'flex', color: '#94a3b8', fontSize: 18, fontWeight: 500 }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),
        { ...size }
    );
}
