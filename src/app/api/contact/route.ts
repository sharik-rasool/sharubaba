import { NextResponse } from 'next/server';

// Basic in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
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
        from_name: name,
        from_email: email,
        company,
        website,
        message,
      },
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailJsPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[CONTACT FORM] EmailJS API Error:`, errorText);
      throw new Error('Failed to send email via EmailJS');
    }

    console.log(`[CONTACT FORM] [${new Date(timestamp).toISOString()}] [IP: ${ip}] Success - Name: ${name}, Email: ${email}`);
    
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error(`[CONTACT FORM] Error processing submission:`, error);
    // Generic 500 error for real server errors
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
