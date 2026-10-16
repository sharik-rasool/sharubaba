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
        status: 'active',
        dailyLimit: 20,
        notes: `Requested via website form. Target Website: ${website || 'N/A'}. Notes: ${notes || 'N/A'}`,
      });
      isNew = true;
    }

    // Fire EmailJS notification to Sharik so he knows a $10 lead arrived
    try {
      const emailJsPayload = {
        service_id: process.env.EMAILJS_SERVICE_ID || 'service_vyo6d5t',
        template_id: process.env.EMAILJS_TEMPLATE_ID || 'template_oxwiq1r',
        user_id: process.env.EMAILJS_PUBLIC_KEY || '55VneOagkBBvVQDN0',
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
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
            `Action Required: Send invoice/payment link ($10) or confirm access.`,
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
    } catch (emailErr) {
      console.warn('[REQUEST KEY] EmailJS notification failed (non-blocking):', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Your request has been received. Check your inbox for payment confirmation and access instructions.',
      key: existing.key, // Optionally provide key immediately or after payment
    });
  } catch (error) {
    console.error('[REQUEST ACCESS KEY ERROR]', error);
    return NextResponse.json(
      { error: 'An error occurred while submitting your key request.' },
      { status: 500 }
    );
  }
}
