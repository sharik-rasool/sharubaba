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

  const emailBody = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px 20px; background-color: #ffffff; color: #1e293b; border-radius: 16px; border: 1px solid #e2e8f0; line-height: 1.6;">

  <!-- Header Badge -->
  <div style="text-align: center; margin-bottom: 20px;">
    <span style="display: inline-block; padding: 5px 14px; background: #e0f2fe; color: #0284c7; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 9999px;">
      ⚡ 90-Day Pro Pass Activated
    </span>
    <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 12px 0 4px 0;">
      Competitor Backlink Gap Checker
    </h2>
    <p style="font-size: 13px; color: #64748b; margin: 0;">
      Official Access Key &amp; Activation Guide
    </p>
  </div>

  <p style="font-size: 15px; color: #334155; margin: 0 0 16px 0;">
    Hi <strong>${user.name}</strong>,
  </p>

  <p style="font-size: 14px; color: #334155; margin: 0 0 20px 0;">
    Thanks for purchasing the <strong>90-day Backlink Gap Checker Key</strong>! Your personalized access key is ready to use:
  </p>

  <!-- Colourful Mobile-Responsive Key Card (Linear Gradient Blue) -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0; border-collapse: separate;">
    <tr>
      <td align="center" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 24px 16px; border-radius: 14px; color: #ffffff; box-shadow: 0 8px 20px -4px rgba(2, 132, 199, 0.35);">
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #bae6fd; margin-bottom: 8px;">
          YOUR 90-DAY PRO ACCESS KEY
        </div>
        <div style="font-family: 'SFMono-Regular', Consolas, 'Courier New', monospace; font-size: 26px; font-weight: 900; letter-spacing: 2px; color: #ffffff; padding: 4px 0; word-break: break-all;">
          ${user.key}
        </div>
        <div style="font-size: 12px; font-weight: 600; color: #e0f2fe; margin-top: 8px;">
          ✔ 90-Day Validity &bull; 20 Fresh Scans Every Day
        </div>
      </td>
    </tr>
  </table>

  <!-- Colourful CTA Button -->
  <div style="text-align: center; margin: 24px 0 28px 0;">
    <a href="${toolUrl}" style="display: inline-block; padding: 14px 32px; background: #0284c7; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);">
      Launch Backlink Gap Checker &rarr;
    </a>
  </div>

  <!-- How to Activate Card -->
  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin-bottom: 20px;">
    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; margin-bottom: 10px;">
      🚀 How to Activate (30 Seconds):
    </div>
    <ol style="margin: 0; padding-left: 20px; font-size: 13px; color: #334155; line-height: 1.8;">
      <li>Click to open the <a href="${toolUrl}" style="color: #0284c7; font-weight: 600; text-decoration: underline;">Backlink Gap Checker Tool</a></li>
      <li>Under the <strong>"I Have a Key"</strong> tab, paste your key: <strong style="color: #0284c7;">${user.key}</strong></li>
      <li>Click <strong>"Unlock 3-Month Pro Pass"</strong>. (Your browser will remember you automatically—you will not need to re-enter it!)</li>
    </ol>
  </div>

  <!-- What's Included Card -->
  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin-bottom: 20px;">
    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; margin-bottom: 10px;">
      💎 What's Included in Your 90-Day Pass:
    </div>
    <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #475569; line-height: 1.8;">
      <li><strong>Exact Referring URLs:</strong> High-converting listicles and articles linking to your competitors.</li>
      <li><strong>Curated DR 50–80 Sweet Spot:</strong> Zero-traffic scraper spam automatically filtered out.</li>
      <li><strong>1-Click CSV Export:</strong> Formatted for cold outreach (Instantly, Lemlist, Excel).</li>
      <li><strong>20 Fresh Scans / Day:</strong> Explore up to 1,800 competitor analyses.</li>
      <li><strong>Full 90-Day Validity:</strong> Your countdown timer only starts on your very first scan.</li>
    </ul>
  </div>

  <p style="font-size: 13px; color: #64748b; margin: 0 0 20px 0;">
    If you have any questions or want my team to run custom backlink outreach for you, simply reply directly to this email!
  </p>

  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0 16px 0;" />

  <div style="font-size: 13px; color: #64748b; line-height: 1.5;">
    <strong style="color: #0f172a;">Sharik Rasool</strong><br />
    SEO Strategist &amp; Founder<br />
    <a href="https://www.sharikrasool.com" style="color: #0284c7; text-decoration: none;">sharikrasool.com</a>
  </div>
</div>`;

  const emailJsPayload = {
    service_id: process.env.EMAILJS_SERVICE_ID || 'service_vyo6d5t',
    template_id: process.env.EMAILJS_TEMPLATE_ID || 'template_oxwiq1r',
    user_id: process.env.EMAILJS_PUBLIC_KEY || '55VneOagkBBvVQDN0',
    accessToken: process.env.EMAILJS_PRIVATE_KEY,
    template_params: {
      from_name: 'Sharik Rasool',
      name: 'Sharik Rasool', // Ensures EmailJS "From Name" shows Sharik Rasool
      sender_name: 'Sharik Rasool',
      to_name: user.name,
      customer_name: user.name,
      from_email: 'hello@sharikrasool.com',
      reply_to: 'shariksr7@gmail.com',
      to_email: user.email,
      email: user.email,
      to: user.email,
      recipient: user.email,
      user_email: user.email,
      website: toolUrl,
      subject: 'Your 90-Day Backlink Gap Checker Key', // Short and precise, no key in subject
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
