import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AuditOrder from '@/models/AuditOrder';

export async function POST(request: Request) {
  try {
    const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || '127.0.0.1';
    const timestamp = Date.now();

    const body = await request.json();
    const { website, name, email, competitors, targetKeywords, notes, honeypot } = body;

    // Honeypot check for spam prevention
    if (honeypot) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (!website || !name || !email) {
      return NextResponse.json(
        { error: 'Please provide your website URL, name, and email address.' },
        { status: 400 }
      );
    }

    // 1. Save order in MongoDB
    let orderRecord = null;
    try {
      await connectDB();
      orderRecord = await AuditOrder.create({
        website: website.trim(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        competitors: competitors ? competitors.trim() : '',
        targetKeywords: targetKeywords ? targetKeywords.trim() : '',
        notes: notes ? notes.trim() : '',
        price: 15,
        currency: 'USD',
        status: 'pending',
        ipAddress: ip,
      });
    } catch (dbErr) {
      console.warn('[SEO AUDIT ORDER] DB save warning:', dbErr);
    }

    // 2. Send Notification Email via EmailJS
    try {
      const emailJsPayload = {
        service_id: process.env.EMAILJS_SERVICE_ID || 'service_vyo6d5t',
        template_id: process.env.EMAILJS_TEMPLATE_ID || 'template_oxwiq1r',
        user_id: process.env.EMAILJS_PUBLIC_KEY || '55VneOagkBBvVQDN0',
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
          from_name: `${name} ($15 SEO Audit Request)`,
          name,
          from_email: email,
          email,
          website,
          message: `NEW $15 SEO AUDIT ORDER RECEIVED:\n\n` +
                   `Website: ${website}\n` +
                   `Client Name: ${name}\n` +
                   `Email: ${email}\n` +
                   `Competitors: ${competitors || 'None specified'}\n` +
                   `Target Keywords: ${targetKeywords || 'None specified'}\n` +
                   `Notes: ${notes || 'None'}\n` +
                   `Order ID: ${orderRecord?._id || 'N/A'}\n` +
                   `Amount: $15 USD`,
          ip_address: ip,
        },
      };

      const userAgent = request.headers.get('user-agent') || 'Mozilla/5.0';
      const requestOrigin = request.headers.get('origin') || 'https://www.sharikrasool.com';
      const referer = request.headers.get('referer') || 'https://www.sharikrasool.com/seo-audit';

      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': userAgent,
          'Origin': requestOrigin,
          'Referer': referer,
        },
        body: JSON.stringify(emailJsPayload),
      });
    } catch (emailErr) {
      console.warn('[SEO AUDIT ORDER] EmailJS notification warning:', emailErr);
    }

    // 3. Send to Google Sheets Webhook
    const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (sheetsWebhookUrl) {
      try {
        const leadPayload = {
          timestamp: new Date(timestamp).toISOString(),
          type: 'SEO Audit Order ($15)',
          name,
          email,
          website,
          company: competitors ? `Competitors: ${competitors}` : '',
          message: `Target Keywords: ${targetKeywords || 'N/A'} | Notes: ${notes || 'N/A'} | Price: $15`,
          ip_address: ip,
        };

        await fetch(sheetsWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadPayload),
        });
      } catch (sheetErr) {
        console.warn('[SEO AUDIT ORDER] Google Sheets webhook warning:', sheetErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Your $15 SEO Audit order has been received successfully!',
      orderId: orderRecord?._id || 'AUDIT-' + Date.now().toString(36).toUpperCase(),
    });
  } catch (error) {
    console.error('[SEO AUDIT ORDER API ERROR]', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while placing your audit order.' },
      { status: 500 }
    );
  }
}
