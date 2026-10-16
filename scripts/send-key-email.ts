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

  const emailBody = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #ffffff; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 16px;">
  <div style="text-align: center; margin-bottom: 24px;">
    <span style="display: inline-block; padding: 4px 12px; background: #e0f2fe; color: #0284c7; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-radius: 9999px;">Ahrefs-Powered Link Intersect</span>
    <h2 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 12px 0 4px 0;">Competitor Backlink Gap Checker</h2>
    <p style="font-size: 14px; color: #64748b; margin: 0;">Official 90-Day Pro Pass Activation</p>
  </div>

  <p style="font-size: 15px; line-height: 1.6; color: #334155;">
    Hi <strong>${user.name}</strong>,
  </p>
  <p style="font-size: 15px; line-height: 1.6; color: #334155;">
    Thanks for purchasing the <strong>90-day Backlink Gap Checker Key</strong>! Your personalized license is active and ready to discover high-converting, DR 50–80 backlink opportunities your competitors have that you don't.
  </p>

  <!-- Centered Bold Key Card -->
  <div style="margin: 28px 0; padding: 24px; background-color: #f8fafc; border: 2px dashed #0284c7; border-radius: 14px; text-align: center;">
    <div style="font-size: 11px; font-weight: 800; color: #0284c7; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
      YOUR 90-DAY PRO ACCESS KEY
    </div>
    <div style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 28px; font-weight: 900; color: #0f172a; letter-spacing: 2px; padding: 6px 0;">
      <strong>${user.key}</strong>
    </div>
    <div style="font-size: 12px; font-weight: 600; color: #64748b; margin-top: 6px;">
      Valid for 90 Days • 20 Fresh Scans Per Day
    </div>
  </div>

  <!-- Big CTA Button -->
  <div style="text-align: center; margin: 28px 0;">
    <a href="${toolUrl}" style="display: inline-block; padding: 14px 32px; background-color: #0284c7; color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 12px;">
      Launch Backlink Gap Checker &rarr;
    </a>
  </div>

  <!-- How to Activate -->
  <div style="margin-bottom: 24px; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
    <h3 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">
      How to Activate in 30 Seconds:
    </h3>
    <ol style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #334155;">
      <li>Click the tool link: <a href="${toolUrl}" style="color: #0284c7; font-weight: 600;">${toolUrl}</a></li>
      <li>Under the <strong>"I Have a Key"</strong> tab, paste your key: <strong>${user.key}</strong></li>
      <li>Click <strong>"Unlock 3-Month Pro Pass"</strong>. Your browser will remember your key automatically.</li>
    </ol>
  </div>

  <!-- What's Included -->
  <div style="margin-bottom: 24px; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
    <h3 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">
      What's Included in Your 90-Day Pass:
    </h3>
    <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.8; color: #475569;">
      <li><strong>Exact Referring Article URLs &amp; Titles:</strong> See the exact listicles and roundups linking to competitors.</li>
      <li><strong>DR 50–80 Filter:</strong> Hand-curated to the outreach sweet spot (zero scraper spam).</li>
      <li><strong>1-Click CSV Export:</strong> Formatted for cold outreach (Instantly, Lemlist, Excel).</li>
      <li><strong>20 Scans/Day:</strong> Up to 1,800 fresh scans across your 90 days.</li>
      <li><strong>90-Day Validity:</strong> The countdown only starts on your very first scan.</li>
    </ul>
  </div>

  <p style="font-size: 14px; line-height: 1.6; color: #64748b;">
    If you have any questions or want my team to run custom outreach to secure these links for you, simply reply directly to this email!
  </p>

  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 16px 0;" />

  <div style="font-size: 13px; color: #64748b; line-height: 1.5;">
    <strong>Sharik Rasool</strong><br />
    SEO Strategist &amp; Founder<br />
    <a href="https://www.sharikrasool.com" style="color: #0284c7; text-decoration: none;">www.sharikrasool.com</a>
  </div>
</div>`;

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
      ip_address: 'Verified Direct Access',
      ip: 'Verified Direct Access',
      client_ip: 'Verified Direct Access',
      user_ip: 'Verified Direct Access',
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
