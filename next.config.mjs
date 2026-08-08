import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://code.jquery.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; img-src 'self' data: https://www.sharikrasool.com https://*.sharikrasool.com https://images.unsplash.com https://*.supabase.co; connect-src 'self' https://*.supabase.co https://api.emailjs.com; font-src 'self' data: https://cdnjs.cloudflare.com https://fonts.gstatic.com; frame-src https://calendly.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), usb=(), payment=()',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/blog/pinterest-blogging',
        destination: '/blog/how-to-use-pinterest-for-blogging-traffic-and-success',
        permanent: true,
      },
      {
        source: '/blog/entry-level-jobs',
        destination: '/blog/finding-and-succeeding-in-entry-level-blogging-jobs',
        permanent: true,
      },
      {
        source: '/blog/blogging-vs-vlogging',
        destination: '/blog/blogging-vs-vlogging-how-to-choose-the-best-medium',
        permanent: true,
      },
      {
        source: '/blog/blogging-for-lawyers',
        destination: '/blog/blogging-for-lawyers-key-strategies-for-law-firm-growth',
        permanent: true,
      },
      {
        source: '/blog/blogging-for-small-businesses',
        destination: '/blog/blogging-for-small-businesses-strategies-to-boost-growth',
        permanent: true,
      },
      {
        source: '/blog/spam-blogging',
        destination: '/blog/how-to-stop-spam-blogging-and-protect-your-sites-reputation',
        permanent: true,
      },
      {
        source: '/blog/mastering-remote-freelancing-tips-for-developers-a-comprehensive-guide',
        destination: '/blog/remote-freelancing-tips-for-developers',
        permanent: true,
      },
      {
        source: '/blog/mastering-ahrefs-blogging-for-business-the-ultimate-guide',
        destination: '/blog/ahrefs-blogging-for-business',
        permanent: true,
      },
      {
        source: '/blog/the-ultimate-guide-to-finding-the-best-blogging-sites-for-your-needs',
        destination: '/blog/best-blogging-sites',
        permanent: true,
      },
      {
        source: '/blog/the-ultimate-guide-to-link-building-for-lawyers-boost-your-law-firms-online-presence',
        destination: '/blog/link-building-for-lawyers',
        permanent: true,
      },
      {
        source: '/blog/the-ultimate-guide-to-local-link-building-service-boosting-your-local-seo',
        destination: '/blog/local-link-building-service',
        permanent: true,
      },
      {
        source: '/blog/mastering-white-label-web-development',
        destination: '/blog/white-label-web-development-scaling-agency-growth',
        permanent: true,
      },
      {
        source: '/blog/mastering-blogging-courses',
        destination: '/blog/best-blogging-courses-how-to-choose-the-right-training',
        permanent: true,
      },
      {
        source: '/blog/mastering-backlink-submission',
        destination: '/blog/backlink-submission-high-impact-sites-and-strategies',
        permanent: true,
      },
      {
        source: '/blog/mastering-backlink-outreach-services',
        destination: '/blog/backlink-outreach-services-how-to-get-authority-links',
        permanent: true,
      },
      {
        source: '/blog/mastering-backlink-packages',
        destination: '/blog/backlink-packages-buying-quality-backlinks-safely',
        permanent: true,
      },
      {
        source: '/blog/earn-money-blogging',
        destination: '/blog/how-to-earn-money-blogging-proven-methods',
        permanent: true,
      },
      {
        source: '/blog/blogging-tools-for-beginners',
        destination: '/blog/best-blogging-tools-for-beginners',
        permanent: true,
      },
      {
        source: '/blog/blogging-for-therapists',
        destination: '/blog/blogging-for-therapists-grow-practice',
        permanent: true,
      },
      {
        source: '/blog/wix-for-blogging',
        destination: '/blog/wix-for-blogging-review',
        permanent: true,
      },
      {
        source: '/blog/b2b-blogging',
        destination: '/blog/b2b-blogging-strategies-generate-leads',
        permanent: true,
      },
      {
        source: '/blog/manual-backlinks-service',
        destination: '/blog/manual-backlinks-service-safe-rankings',
        permanent: true,
      },
      {
        source: '/blog/fingerprinting-website-backlink-strategy-seo',
        destination: '/blog/fingerprint-website-backlinks-seo-strategy',
        permanent: true,
      },
      {
        source: '/blog/questions-to-ask-web-dev',
        destination: '/blog/questions-to-ask-web-developer-before-hiring',
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    config.resolve.modules = [
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
    ];
    return config;
  },
};

export default nextConfig;
