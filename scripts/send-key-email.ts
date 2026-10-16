import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const KEY_HOLDERS = [
  {
    name: 'Sharik',
    email: 'shariksr7@gmail.com',
    key: 'GAP-SHARIK-6321',
  },
  {
    name: 'Safora',
    email: 'saforabeigh@gmail.com',
    key: 'GAP-SAFORA-5094',
  },
  {
    name: 'Mushahid',
    email: 'mushahid.marketinglad@gmail.com',
    key: 'GAP-MUSHAHID-4161',
  },
];

async function sendKeyEmail(user: { name: string; email: string; key: string }) {
  const toolUrl = 'https://www.sharikrasool.com/tools/backlink-gap-checker';

  const emailBody = `Hi ${user.name},

Thanks for purchasing the 90-day Backlink Gap Checker Key!

Welcome to the Competitor Backlink Gap Checker. Your personalized 90-day access key is ready to use:

┌────────────────────────────────────────────────────────┐
│                                                        │
│               YOUR 90-DAY PRO ACCESS KEY               │
│                                                        │
│                  **${user.key}**                       │
│                                                        │
│           (90-Day Validity • 20 Scans/Day)             │
│                                                        │
└────────────────────────────────────────────────────────┘

DIRECT TOOL LINK:
${toolUrl}

HOW TO ACTIVATE (30 SECONDS):
1. Click the tool link: ${toolUrl}
2. Under the "I Have a Key" tab, paste your key: ${user.key}
3. Click "Unlock 3-Month Pro Pass".
   (Your browser will remember you automatically—you will not need to re-enter it!)

WHAT'S INCLUDED IN YOUR 90-DAY PASS:
• Exact Referring Article URLs & Listicle Titles linking to your competitors.
• Curated DR 50–80 Outreach Sweet Spot (all zero-traffic scraper spam filtered out).
• 1-Click CSV Export formatted for cold outreach campaigns (Instantly, Lemlist, Excel).
• Up to 20 fresh competitor link gap scans every day for 90 days.
• Full 90-Day Validity (your timer only starts on your very first scan).

If you have any questions or want my team to run custom backlink outreach for you, simply reply directly to this email!

Best regards,
Sharik Rasool
SEO Strategist & Founder
https://www.sharikrasool.com`;

  const emailJsPayload = {
    service_id: process.env.EMAILJS_SERVICE_ID || 'service_vyo6d5t',
    template_id: process.env.EMAILJS_TEMPLATE_ID || 'template_oxwiq1r',
    user_id: process.env.EMAILJS_PUBLIC_KEY || '55VneOagkBBvVQDN0',
    accessToken: process.env.EMAILJS_PRIVATE_KEY,
    template_params: {
      from_name: 'Sharik Rasool',
      name: user.name,
      to_name: user.name,
      from_email: 'hello@sharikrasool.com',
      reply_to: 'shariksr7@gmail.com',
      to_email: user.email,
      email: user.email,
      to: user.email,
      recipient: user.email,
      user_email: user.email,
      website: toolUrl,
      subject: `Thanks for purchasing the 90-day Backlink Gap Checker Key (${user.key})`,
      message: emailBody,
    },
  };

  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
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

    if (res.ok) {
      console.log(`✅ Sent email successfully to ${user.name} (${user.email}) [Key: ${user.key}]`);
      return true;
    } else {
      const errText = await res.text();
      console.error(`❌ Failed sending to ${user.email}: HTTP ${res.status} - ${errText}`);
      return false;
    }
  } catch (err) {
    console.error(`❌ Network error sending to ${user.email}:`, err);
    return false;
  }
}

async function main() {
  const targetEmail = process.argv[2];

  let listToSend = KEY_HOLDERS;
  if (targetEmail) {
    listToSend = KEY_HOLDERS.filter(
      (k) => k.email.toLowerCase() === targetEmail.toLowerCase()
    );
    if (listToSend.length === 0) {
      console.log(`Target email ${targetEmail} not found in existing key holders. Creating custom recipient...`);
      listToSend = [{ name: 'Valued Client', email: targetEmail, key: 'GAP-PRO-DEMO' }];
    }
  }

  console.log(`Sending test access key emails to ${listToSend.length} recipient(s)...\n`);

  for (const user of listToSend) {
    await sendKeyEmail(user);
    // Add small 500ms delay between sends to respect rate limits
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log('\nAll test emails processed!');
}

main();
