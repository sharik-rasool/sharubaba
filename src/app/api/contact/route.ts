import { NextResponse } from 'next/server';

// Basic in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5;

export async function POST(request: Request) {
  try {
    const rawIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip')?.trim() ||
      request.headers.get('cf-connecting-ip')?.trim() ||
      request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim() ||
      '127.0.0.1';
    const ip = rawIp;
    const timestamp = Date.now();

    const body = await request.json();
    const { name, email, company, website, website_url_backup, message } = body;

    // 1. Origin Check
    const origin = request.headers.get('origin');
    const allowedOrigins = ['https://www.sharikrasool.com', 'https://www.sharikrasool.com', 'http://localhost:3000', 'http://localhost:3001'];
    
    if (origin && !allowedOrigins.some(o => origin.startsWith(o))) {
      console.warn(`[CONTACT FORM] [${new Date(timestamp).toISOString()}] [IP: ${ip}] Origin rejected: ${origin}`);
      return NextResponse.json({ success: true }, { status: 200 }); // Silent generic 200
    }

    // 2. Honeypot Check
    if (website_url_backup) {
      console.warn(`[CONTACT FORM] [${new Date(timestamp).toISOString()}] [IP: ${ip}] Honeypot triggered`);
      return NextResponse.json({ success: true }, { status: 200 }); // Silent generic 200
    }

    // 3. Rate Limiting Check
    const userRateData = rateLimitMap.get(ip);
    if (userRateData) {
      if (timestamp - userRateData.timestamp < RATE_LIMIT_WINDOW) {
        if (userRateData.count >= RATE_LIMIT_MAX) {
          console.warn(`[CONTACT FORM] [${new Date(timestamp).toISOString()}] [IP: ${ip}] Rate limited`);
          return NextResponse.json({ success: true }, { status: 200 }); // Silent generic 200
        }
        userRateData.count += 1;
      } else {
        rateLimitMap.set(ip, { count: 1, timestamp });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp });
    }

    // 4. Send Email via EmailJS REST API
    const emailJsPayload = {
      service_id: process.env.EMAILJS_SERVICE_ID || 'service_vyo6d5t',
      template_id: process.env.EMAILJS_TEMPLATE_ID || 'template_oxwiq1r',
      user_id: process.env.EMAILJS_PUBLIC_KEY || '55VneOagkBBvVQDN0',
      accessToken: process.env.EMAILJS_PRIVATE_KEY, // Optional if required by EmailJS account settings
      template_params: {
        to_email: 'shariksr7@gmail.com',
        subject: body.subject || `New Contact Inquiry from ${name} (${email})`,
        from_name: name,
        name: name, // Alias
        from_email: email,
        email: email, // Alias
        company: company || '',
        website: website || '',
        message: `${message}\n\n---\nLead IP Address: ${ip}\nWebsite: ${website || 'N/A'}${company ? `\nCompany: ${company}` : ''}`,
        ip_address: ip,
        ip: ip, // Alias
        client_ip: ip, // Alias
        user_ip: ip, // Alias
      },
    };

    const userAgent = request.headers.get('user-agent') || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const requestOrigin = request.headers.get('origin') || 'https://www.sharikrasool.com';
    const referer = request.headers.get('referer') || 'https://www.sharikrasool.com/contact';

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': userAgent,
        'Origin': requestOrigin,
        'Referer': referer,
      },
      body: JSON.stringify(emailJsPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[CONTACT FORM] EmailJS API Error:`, errorText);
      throw new Error('Failed to send email via EmailJS');
    }

    // 5. Send Instant Automated Reply to the Lead (Non-blocking)
    try {
      const firstName = (name || '').trim().split(' ')[0] || 'there';
      const formSubjectLower = (body.subject || '').toLowerCase();
      const isSampleSheet = formSubjectLower.includes('sample sheet');
      const isAuditRequest = formSubjectLower.includes('audit');
      const isEstimatorRequest = formSubjectLower.includes('estimator') || formSubjectLower.includes('cost');

      let autoReplySubject = `Thanks for reaching out, ${firstName}! — Sharik Rasool`;
      let autoReplyMessage = '';

      if (isSampleSheet) {
        autoReplySubject = 'Your 10+ UK & SaaS Backlink Sample Spreadsheet';
        autoReplyMessage = `Hi ${firstName},

Here is your direct access to our curated 10+ Live UK & SaaS Backlink Sample Spreadsheet:

DIRECT SPREADSHEET LINK:
https://docs.google.com/spreadsheets/d/1LmzE6gmTJzksvlvwWsCGbqxu_RTEZL-afjAbx6KixRY/edit?gid=0#gid=0

WHAT'S INSIDE:
• 10+ Unmasked DR 50–85+ Editorial & Tech Publishers
• Verified Live Organic Search Traffic & Authority
• Real In-Content Contextual Placements

If you'd like me to review your website and tell you which exact publishers from this list would pass the highest ranking equity for your domain, reply with your site URL and I'll take a look!

Best regards,
Sharik Rasool
SEO Strategist & Founder
https://www.sharikrasool.com`;
      } else if (isAuditRequest) {
        autoReplySubject = `Your Website SEO Audit Request — Sharik Rasool`;
        autoReplyMessage = `Hi ${firstName},

Thank you for requesting an SEO & Competitor Gap Audit! I have received your request and will review your website details.

To help me tailor the audit specifically to your business goals:
1. Target Keywords: Which 2–5 primary keywords are you aiming to rank on Page 1?
2. Target Pages: Which specific service or landing pages do you most want to rank?
3. Target Niche & Competitors: Who are your top 1–2 organic search competitors?

In the meantime, if you want immediate data on your link gaps or a comprehensive video breakdown:
• Competitor Backlink Gap Checker ($10 Pro Pass): https://www.sharikrasool.com/tools/backlink-gap-checker
  (Find high-converting DR 50–80 editorial publishers linking to competitors that don't link to you)
• $15 Full Technical & Video SEO Audit: https://www.sharikrasool.com/seo-audit
  (Includes a deep technical crawl, indexing audit, and a personalized 15-minute Loom video walkthrough)

Prefer to discuss your project directly? You can grab a quick 15-minute strategy call on my calendar here:
https://calendly.com/sharikkashmiri

I look forward to analyzing your site and helping you scale your organic traffic!

Best regards,
Sharik Rasool
SEO Strategist & Founder
https://www.sharikrasool.com`;
      } else if (isEstimatorRequest) {
        autoReplySubject = `Your Link Building Estimate Breakdown — Sharik Rasool`;
        autoReplyMessage = `Hi ${firstName},

Thank you for using our Link Building Cost Estimator! I've received your estimated link requirements.

To help me map out the exact publisher mix and projected ranking timeline for your domain:
1. Target Keywords: Which 2–5 primary keywords do you want to rank for?
2. Target Pages: Which URLs are you looking to power with editorial links?
3. Target Niche & Competitors: Who are your key organic search rivals?

In the meantime, feel free to explore our premium analysis tools:
• Competitor Backlink Gap Checker ($10 Pro Pass): https://www.sharikrasool.com/tools/backlink-gap-checker
• $15 Full Technical & Video SEO Audit: https://www.sharikrasool.com/seo-audit

Prefer to discuss your link acquisition strategy on a quick call? Book a 15-minute session here:
https://calendly.com/sharikkashmiri

Best regards,
Sharik Rasool
SEO Strategist & Founder
https://www.sharikrasool.com`;
      } else {
        // General Contact Form Auto-Reply
        autoReplySubject = `Thanks for reaching out, ${firstName}! — Sharik Rasool`;
        autoReplyMessage = `Hi ${firstName},

Thank you for reaching out! I've received your message and will review your website details.

To help me analyze your site and tailor the most effective growth and link-building solution for you, could you reply with a few quick details?
1. Target Keywords: Which 2–5 primary keywords are you aiming to rank for?
2. Target Pages: Which specific service, landing, or product URLs do you want to push up?
3. Target Niche & Competitors: Who are your top 1–2 organic search competitors?

In the meantime, if you want immediate data on your rankings and link opportunities, check out my premium growth tools:
• Competitor Backlink Gap Checker ($10 Pro Pass): https://www.sharikrasool.com/tools/backlink-gap-checker
  (Find high-converting DR 50–80 referring articles and listicles linking to competitors that don't link to you)
• $15 Full Technical & Video SEO Audit: https://www.sharikrasool.com/seo-audit
  (Includes a deep technical crawl, indexing audit, and a personalized 15-minute Loom video walkthrough)

Prefer to discuss your project directly? You can grab a quick 15-minute strategy call on my calendar here:
https://calendly.com/sharikkashmiri

I look forward to reviewing your site and helping you scale your organic traffic!

Best regards,
Sharik Rasool
SEO Strategist & Founder
https://www.sharikrasool.com`;
      }

      const autoReplyPayload = {
        service_id: process.env.EMAILJS_SERVICE_ID || 'service_vyo6d5t',
        template_id: process.env.EMAILJS_TEMPLATE_ID || 'template_oxwiq1r',
        user_id: process.env.EMAILJS_PUBLIC_KEY || '55VneOagkBBvVQDN0',
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
          to_email: email,
          subject: autoReplySubject,
          from_name: 'Sharik Rasool',
          name: 'Sharik Rasool',
          sender_name: 'Sharik Rasool',
          from_email: 'hello@sharikrasool.com',
          reply_to: 'shariksr7@gmail.com',
          message: autoReplyMessage,
        },
      };

      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': userAgent,
          'Origin': requestOrigin,
          'Referer': referer,
        },
        body: JSON.stringify(autoReplyPayload),
      });
    } catch (autoReplyErr) {
      console.warn('[CONTACT FORM] Auto-reply send failed (non-blocking):', autoReplyErr);
    }

    // 5. Send Lead to Google Sheets Webhook (optional)
    const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (sheetsWebhookUrl) {
      try {
        const leadPayload = {
          timestamp: new Date(timestamp).toISOString(),
          name,
          email,
          company: company || '',
          website: website || '',
          message,
          ip_address: ip,
        };

        const sheetResponse = await fetch(sheetsWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(leadPayload),
        });

        if (!sheetResponse.ok) {
          console.error(`[CONTACT FORM] Google Sheets Webhook failed with status: ${sheetResponse.status}`);
        } else {
          console.log(`[CONTACT FORM] Successfully recorded lead in Google Sheets`);
        }
      } catch (sheetError) {
        console.error(`[CONTACT FORM] Error sending lead to Google Sheets:`, sheetError);
      }
    }

    console.log(`[CONTACT FORM] [${new Date(timestamp).toISOString()}] [IP: ${ip}] Success - Name: ${name}, Email: ${email}`);
    
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error(`[CONTACT FORM] Error processing submission:`, error);
    // Generic 500 error for real server errors
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
