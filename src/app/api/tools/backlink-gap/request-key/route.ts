import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ToolAccessKey from '@/models/ToolAccessKey';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, website, notes } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Please provide both your name and email address.' },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    await connectDB();

    // Check if key already exists for this email
    let existing = await ToolAccessKey.findOne({ email: cleanEmail });
    let isNew = false;

    if (!existing) {
      // Auto-generate name-wise key in active status ready for the user
      const namePrefix = cleanName
        .toUpperCase()
        .replace(/[^A-Z]/g, '')
        .slice(0, 10);
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const generatedKey = `GAP-${namePrefix || 'PRO'}-${randomSuffix}`;

      existing = await ToolAccessKey.create({
        key: generatedKey,
        name: cleanName,
        email: cleanEmail,
        status: 'pending_payment',
        dailyLimit: 20,
        notes: `Requested via website form. Target Website: ${website || 'N/A'}. Notes: ${notes || 'N/A'}`,
      });
      isNew = true;
    }

    const rawIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip')?.trim() ||
      request.headers.get('cf-connecting-ip')?.trim() ||
      request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim() ||
      '127.0.0.1';
    const ip = rawIp;

    // Fire EmailJS notification to Sharik so he knows a $10 lead arrived
    try {
      const emailJsPayload = {
        service_id: process.env.EMAILJS_SERVICE_ID || 'service_vyo6d5t',
        template_id: process.env.EMAILJS_TEMPLATE_ID || 'template_oxwiq1r',
        user_id: process.env.EMAILJS_PUBLIC_KEY || '55VneOagkBBvVQDN0',
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
          to_email: 'shariksr7@gmail.com',
          subject: `🔑 New $10 Backlink Gap Key Request: ${cleanName} (${cleanEmail})`,
          from_name: `${cleanName} ($10 Backlink Gap Pass Request)`,
          name: cleanName,
          from_email: cleanEmail,
          email: cleanEmail,
          website: website || 'N/A',
          message:
            `NEW $10 BACKLINK GAP KEY REQUEST:\n\n` +
            `Customer Name: ${cleanName}\n` +
            `Email: ${cleanEmail}\n` +
            `Website: ${website || 'N/A'}\n` +
            `Generated Key: ${existing.key}\n` +
            `Status: ${existing.status}\n` +
            `IP Address: ${ip}\n` +
            `Action Required: Send invoice/payment link ($10) or confirm access.`,
          ip_address: ip,
          ip: ip,
          client_ip: ip,
          user_ip: ip,
        },
      };

      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Origin: 'https://www.sharikrasool.com',
          Referer: 'https://www.sharikrasool.com/tools/backlink-gap-checker',
        },
        body: JSON.stringify(emailJsPayload),
      });

      // Send Customer Confirmation Auto-Reply
      const firstName = cleanName.split(' ')[0] || 'there';
      const customerAutoReplyMessage = `Hi ${firstName},

Thank you for your interest in the Competitor Backlink Gap Checker!

RESERVATION STATUS: Order Pending ($10 USD)
• Pass: 3-Month Pro Pass (90-Day Unlimited Access)
• Target Website: ${website || 'Your Domain'}
• Daily Allowance: 20 Fresh Competitor Scans / Day

NEXT STEP — Complete Payment:
To complete your reservation and activate your pass, please <a href="https://buy.stripe.com/dummy_10_backlink_gap_pass" style="color: #0284c7; font-weight: 700; text-decoration: underline;">Complete Your $10 Payment Here</a>.

HOW ACTIVATION WORKS:
Once your $10 payment is confirmed, I will personally dispatch your exclusive 90-Day Pro Access Key and 30-second activation guide directly to your email.

In the meantime, if you want a complete technical and keyword teardown of your website:
• <a href="https://www.sharikrasool.com/seo-audit" style="color: #0284c7; font-weight: 600; text-decoration: underline;">$15 Technical & Backlink SEO Audit</a>

Prefer to discuss your search rankings and link building roadmap directly?
<a href="https://calendly.com/sharikkashmiri" style="color: #0284c7; font-weight: 600; text-decoration: underline;">Schedule a 15-Minute Call on My Calendar</a>

Best regards,
Sharik Rasool
SEO Strategist & Founder
<a href="https://www.sharikrasool.com" style="color: #0284c7; text-decoration: none;">sharikrasool.com</a>`;

      const customerAutoReplyPayload = {
        service_id: process.env.EMAILJS_SERVICE_ID || 'service_vyo6d5t',
        template_id: process.env.EMAILJS_TEMPLATE_ID || 'template_oxwiq1r',
        user_id: process.env.EMAILJS_PUBLIC_KEY || '55VneOagkBBvVQDN0',
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
          to_email: cleanEmail,
          subject: 'Order Pending: 3-Month Pro Pass Reservation ($10 USD)',
          from_name: 'Sharik Rasool',
          name: 'Sharik Rasool',
          sender_name: 'Sharik Rasool',
          from_email: 'hello@sharikrasool.com',
          reply_to: 'shariksr7@gmail.com',
          message: customerAutoReplyMessage,
        },
      };

      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Origin: 'https://www.sharikrasool.com',
          Referer: 'https://www.sharikrasool.com/tools/backlink-gap-checker',
        },
        body: JSON.stringify(customerAutoReplyPayload),
      });
    } catch (emailErr) {
      console.warn('[REQUEST KEY] EmailJS notification/auto-reply failed (non-blocking):', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Your request for a 3-Month Pro Pass has been received. We will email payment details and access instructions shortly.',
    });
  } catch (error) {
    console.error('[REQUEST ACCESS KEY ERROR]', error);
    return NextResponse.json(
      { error: 'An error occurred while submitting your key request.' },
      { status: 500 }
    );
  }
}
