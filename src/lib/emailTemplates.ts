/**
 * Shared Email Template Generator
 * Builds vibrant, responsive, modern HTML email cards with gradients,
 * status badges, cards, and CTA buttons for all customer form auto-replies.
 */

interface BaseEmailProps {
  previewText?: string;
  badgeText: string;
  badgeBg?: string;
  badgeColor?: string;
  title: string;
  subtitle?: string;
  contentHtml: string;
}

export function wrapInEmailCard({
  previewText = '',
  badgeText,
  badgeBg = 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
  badgeColor = '#ffffff',
  title,
  subtitle = '',
  contentHtml,
}: BaseEmailProps): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 16px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <!-- Preview text hack -->
  <div style="display: none; max-height: 0px; overflow: hidden;">
    ${previewText || title}
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
    <!-- Vibrant Gradient Header -->
    <tr>
      <td style="background: ${badgeBg}; padding: 32px 24px; text-align: center; color: ${badgeColor};">
        <div style="display: inline-block; padding: 4px 12px; background: rgba(255, 255, 255, 0.2); border-radius: 9999px; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 12px; backdrop-filter: blur(4px);">
          ${badgeText}
        </div>
        <h1 style="margin: 0; font-size: 22px; font-weight: 800; line-height: 1.3; color: #ffffff;">
          ${title}
        </h1>
        ${
          subtitle
            ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: rgba(255, 255, 255, 0.85); line-height: 1.5;">${subtitle}</p>`
            : ''
        }
      </td>
    </tr>

    <!-- Body Content Area -->
    <tr>
      <td style="padding: 28px 24px;">
        ${contentHtml}

        <!-- Divider -->
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0 20px 0;" />

        <!-- Signature -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="48" valign="top">
              <div style="width: 42px; height: 42px; border-radius: 10px; background: #0284c7; color: #ffffff; text-align: center; line-height: 42px; font-weight: 900; font-size: 16px; box-shadow: 0 2px 8px rgba(2, 132, 199, 0.3);">
                SR
              </div>
            </td>
            <td valign="top" style="padding-left: 12px;">
              <div style="font-size: 14px; font-weight: 800; color: #0f172a;">Sharik Rasool</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 1px;">SEO Strategist &amp; Founder</div>
              <div style="font-size: 12px; margin-top: 3px;">
                <a href="https://www.sharikrasool.com" style="color: #0284c7; font-weight: 600; text-decoration: none;">sharikrasool.com</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer Note -->
    <tr>
      <td style="background-color: #f8fafc; padding: 14px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
        Have a question or want to discuss a custom campaign? Simply reply directly to this email.
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// --------------------------------------------------------------------------
// 1. $15 SEO Page Order Confirmation Email
// --------------------------------------------------------------------------
export function getSeoAuditOrderEmail({
  firstName,
  website,
  orderId,
  targetKeywords,
  competitors,
}: {
  firstName: string;
  website: string;
  orderId: string;
  targetKeywords?: string;
  competitors?: string;
}): string {
  const contentHtml = `
    <p style="font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 18px 0;">
      Hi <strong>${firstName}</strong>,
    </p>
    <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 20px 0;">
      Thank you for placing your order for the <strong>$15 Technical &amp; Backlink SEO Audit</strong>! I've received your request and queued your site for analysis.
    </p>

    <!-- Order Status Card -->
    <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 18px 20px; margin-bottom: 22px;">
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <span style="display: inline-block; padding: 3px 10px; background: #f59e0b; color: #ffffff; border-radius: 6px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
          Order Status: Payment Pending ($15 USD)
        </span>
      </div>
      <table width="100%" cellpadding="4" cellspacing="0" border="0" style="font-size: 13px; color: #475569;">
        <tr>
          <td width="130" style="color: #92400e; font-weight: 700;">Target Domain:</td>
          <td style="color: #0f172a; font-weight: 600;">${website}</td>
        </tr>
        <tr>
          <td style="color: #92400e; font-weight: 700;">Order Reference:</td>
          <td style="font-family: monospace; color: #0284c7; font-weight: 700;">${orderId}</td>
        </tr>
        <tr>
          <td style="color: #92400e; font-weight: 700;">Focus Keywords:</td>
          <td>${targetKeywords || 'Full domain audit'}</td>
        </tr>
        <tr>
          <td style="color: #92400e; font-weight: 700;">Competitors:</td>
          <td>${competitors || 'Top market rivals'}</td>
        </tr>
      </table>
    </div>

    <!-- Action Button -->
    <div style="text-align: center; margin: 24px 0 26px 0;">
      <a href="https://buy.stripe.com/dummy_15_seo_audit" style="display: inline-block; padding: 15px 36px; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; font-size: 14px; font-weight: 800; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4); text-transform: uppercase; letter-spacing: 0.5px;">
        Complete Your $15 Audit Payment &rarr;
      </a>
      <div style="font-size: 11px; color: #64748b; margin-top: 8px;">
        🔒 Secure Stripe Checkout &bull; Immediate Receipt
      </div>
    </div>

    <!-- Timeline Steps Card -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin-bottom: 22px;">
      <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; margin-bottom: 12px;">
        📦 What Happens Once Payment is Confirmed:
      </div>
      <table width="100%" cellpadding="6" cellspacing="0" border="0" style="font-size: 13px; color: #334155; line-height: 1.6;">
        <tr>
          <td width="24" valign="top" style="color: #0284c7; font-weight: 800;">1.</td>
          <td><strong>Deep Technical Crawl:</strong> Complete crawl of your website to isolate indexation blockers, 404 links, and thin content.</td>
        </tr>
        <tr>
          <td width="24" valign="top" style="color: #0284c7; font-weight: 800;">2.</td>
          <td><strong>Competitor Backlink Teardown:</strong> Uncover high-converting editorial links that your rivals rank with.</td>
        </tr>
        <tr>
          <td width="24" valign="top" style="color: #0284c7; font-weight: 800;">3.</td>
          <td><strong>Excel &amp; PDF Report Delivery:</strong> Within 48 hours, I will deliver an actionable Excel sheet and complete PDF roadmap directly to your inbox.</td>
        </tr>
      </table>
    </div>

    <!-- Strategy Call Option -->
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 14px 18px; margin-bottom: 16px;">
      <div style="font-size: 13px; color: #166534; line-height: 1.5;">
        📅 <strong>Prefer to discuss your website live?</strong><br />
        You can <a href="https://calendly.com/sharikrasool" style="color: #059669; font-weight: 700; text-decoration: underline;">Schedule a 15-Minute Strategy Call on My Calendar</a>.
      </div>
    </div>
  `;

  return wrapInEmailCard({
    previewText: `Order Pending: $15 Technical & Backlink SEO Audit for ${website}`,
    badgeText: 'Audit Order Queued',
    badgeBg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    title: '$15 SEO Audit Order Confirmation',
    subtitle: `Queued for ${website} &bull; 48-Hour Delivery Turnaround`,
    contentHtml,
  });
}

// --------------------------------------------------------------------------
// 2. Contact Us Page Auto-Reply Email
// --------------------------------------------------------------------------
export function getContactFormAutoReplyEmail({ firstName }: { firstName: string }): string {
  const contentHtml = `
    <p style="font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px 0;">
      Hi <strong>${firstName}</strong>,
    </p>
    <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 20px 0;">
      Thank you for reaching out! I have received your message and will review your website details personally.
    </p>

    <!-- Information Request Card -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin-bottom: 22px;">
      <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; margin-bottom: 10px;">
        💡 To Help Me Prepare the Best Roadmap for You:
      </div>
      <p style="font-size: 13px; color: #475569; margin: 0 0 10px 0; line-height: 1.5;">
        Could you hit <em>Reply</em> with a few quick details about your website?
      </p>
      <ol style="margin: 0; padding-left: 20px; font-size: 13px; color: #334155; line-height: 1.8;">
        <li><strong>Target Keywords:</strong> Which 2–5 primary keywords do you want on Page 1 of Google?</li>
        <li><strong>Target Pages:</strong> Which specific service, product, or landing URLs do you want to push up?</li>
        <li><strong>Top Competitors:</strong> Who are your 1–2 main organic search competitors?</li>
      </ol>
    </div>

    <!-- Quick Strategy Call Button -->
    <div style="text-align: center; margin: 24px 0 26px 0;">
      <a href="https://calendly.com/sharikrasool" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; font-size: 14px; font-weight: 800; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);">
        Schedule a 15-Minute Strategy Call &rarr;
      </a>
      <div style="font-size: 11px; color: #64748b; margin-top: 8px;">
        Direct 1-on-1 Zoom call with Sharik Rasool
      </div>
    </div>

    <!-- Featured Growth Tools Card -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; margin-bottom: 18px;">
      <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; margin-bottom: 10px;">
        ⚡ In the Meantime, Explore Our Analysis Tools:
      </div>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #475569; line-height: 1.8;">
        <li>
          <a href="https://www.sharikrasool.com/tools/backlink-gap-checker" style="color: #0284c7; font-weight: 700; text-decoration: underline;">Competitor Backlink Gap Checker ($10 Pro Pass)</a>
          <div style="font-size: 12px; color: #64748b;">Find DR 50–80 referring articles linking to competitors that don't link to you.</div>
        </li>
        <li style="margin-top: 8px;">
          <a href="https://www.sharikrasool.com/seo-audit" style="color: #0284c7; font-weight: 700; text-decoration: underline;">$15 Technical &amp; Backlink SEO Audit</a>
          <div style="font-size: 12px; color: #64748b;">Deep technical crawl, indexing audit, actionable Excel sheet, and PDF report.</div>
        </li>
      </ul>
    </div>
  `;

  return wrapInEmailCard({
    previewText: `Thanks for reaching out, ${firstName}! — Sharik Rasool`,
    badgeText: 'Message Received',
    badgeBg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    title: 'Thank You for Reaching Out!',
    subtitle: "I've received your inquiry and will review your website details",
    contentHtml,
  });
}

// --------------------------------------------------------------------------
// 3. Link Sample Sheet Auto-Reply Email
// --------------------------------------------------------------------------
export function getSampleSheetAutoReplyEmail({ firstName }: { firstName: string }): string {
  const contentHtml = `
    <p style="font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px 0;">
      Hi <strong>${firstName}</strong>,
    </p>
    <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 18px 0;">
      Thank you for showing interest in our <strong>link building process</strong>!
    </p>
    <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 20px 0;">
      We work on securing high-authority contextual editorial placements for your brand from vetted DR50–85+ domains, and we have dozens of niche-specific publisher options ready to scale your organic visibility.
    </p>

    <!-- Qualification Card -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin-bottom: 22px;">
      <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; margin-bottom: 10px;">
        🎯 To Help Me Pull the Most Relevant Placement Options for Your Brand:
      </div>
      <p style="font-size: 13px; color: #475569; margin: 0 0 10px 0; line-height: 1.5;">
        Could you reply with 3 quick details?
      </p>
      <ol style="margin: 0; padding-left: 20px; font-size: 13px; color: #334155; line-height: 1.8;">
        <li><strong>Target Keywords:</strong> Which 2–5 primary keywords are you targeting to rank on Google?</li>
        <li><strong>Target Niche:</strong> What is your exact industry or vertical?</li>
        <li><strong>Target Pages:</strong> Which specific service, landing, or product URLs do you want to power up?</li>
      </ol>
    </div>

    <!-- Quick Strategy Call Button -->
    <div style="text-align: center; margin: 24px 0 24px 0;">
      <a href="https://calendly.com/sharikrasool" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; font-size: 14px; font-weight: 800; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);">
        Schedule a 15-Minute Strategy Call &rarr;
      </a>
      <div style="font-size: 11px; color: #64748b; margin-top: 8px;">
        Let's review placement options &amp; pricing directly
      </div>
    </div>
  `;

  return wrapInEmailCard({
    previewText: `Thanks for your interest in our link building process — Sharik Rasool`,
    badgeText: 'Link Placement Inquiry',
    badgeBg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    title: 'High-Authority Link Placements',
    subtitle: 'Vetted DR50–85+ editorial placements tailored to your niche',
    contentHtml,
  });
}

// --------------------------------------------------------------------------
// 4. Link Building Cost Estimator Auto-Reply Email
// --------------------------------------------------------------------------
export function getEstimatorAutoReplyEmail({ firstName }: { firstName: string }): string {
  const contentHtml = `
    <p style="font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px 0;">
      Hi <strong>${firstName}</strong>,
    </p>
    <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 20px 0;">
      Thank you for using our <strong>Link Building Cost Estimator</strong>! I've received your estimated link volume requirements.
    </p>

    <!-- Information Card -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin-bottom: 22px;">
      <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; margin-bottom: 10px;">
        📊 To Help Me Map Out Your Publisher Mix &amp; Ranking Timeline:
      </div>
      <ol style="margin: 0; padding-left: 20px; font-size: 13px; color: #334155; line-height: 1.8;">
        <li><strong>Target Keywords:</strong> Which 2–5 primary search queries do you want to dominate?</li>
        <li><strong>Target Pages:</strong> Which URLs are you looking to power with editorial links?</li>
        <li><strong>Key Rivals:</strong> Who are your top 1–2 organic search competitors?</li>
      </ol>
    </div>

    <!-- Strategy Call Button -->
    <div style="text-align: center; margin: 24px 0 26px 0;">
      <a href="https://calendly.com/sharikrasool" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; font-size: 14px; font-weight: 800; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);">
        Schedule a 15-Minute Strategy Call &rarr;
      </a>
      <div style="font-size: 11px; color: #64748b; margin-top: 8px;">
        Book a custom strategy session on my calendar
      </div>
    </div>

    <!-- Recommended Tools Card -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; margin-bottom: 18px;">
      <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; margin-bottom: 8px;">
        🔎 Recommended Next Steps:
      </div>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #475569; line-height: 1.8;">
        <li>
          <a href="https://www.sharikrasool.com/tools/backlink-gap-checker" style="color: #0284c7; font-weight: 700; text-decoration: underline;">Competitor Backlink Gap Checker ($10 Pro Pass)</a>
        </li>
        <li>
          <a href="https://www.sharikrasool.com/seo-audit" style="color: #0284c7; font-weight: 700; text-decoration: underline;">$15 Technical &amp; Backlink SEO Audit</a>
        </li>
      </ul>
    </div>
  `;

  return wrapInEmailCard({
    previewText: `Your Link Building Estimate Breakdown — Sharik Rasool`,
    badgeText: 'Estimate Received',
    badgeBg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    title: 'Link Building Estimate Received',
    subtitle: 'Projected link volumes and acquisition roadmap',
    contentHtml,
  });
}

// --------------------------------------------------------------------------
// 5. Backlink Gap Checker Key Reservation Auto-Reply Email
// --------------------------------------------------------------------------
export function getBacklinkGapReservationEmail({
  firstName,
  website,
}: {
  firstName: string;
  website: string;
}): string {
  const contentHtml = `
    <p style="font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px 0;">
      Hi <strong>${firstName}</strong>,
    </p>
    <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 20px 0;">
      Thank you for your interest in the <strong>Competitor Backlink Gap Checker</strong>!
    </p>

    <!-- Reservation Status Card -->
    <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 18px 20px; margin-bottom: 22px;">
      <div style="margin-bottom: 12px;">
        <span style="display: inline-block; padding: 3px 10px; background: #f59e0b; color: #ffffff; border-radius: 6px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
          Reservation Status: Order Pending ($10 USD)
        </span>
      </div>
      <table width="100%" cellpadding="4" cellspacing="0" border="0" style="font-size: 13px; color: #475569;">
        <tr>
          <td width="130" style="color: #92400e; font-weight: 700;">Access Pass:</td>
          <td style="color: #0f172a; font-weight: 600;">3-Month Pro Pass (90 Days)</td>
        </tr>
        <tr>
          <td style="color: #92400e; font-weight: 700;">Target Domain:</td>
          <td style="color: #0284c7; font-weight: 600;">${website || 'Your Website'}</td>
        </tr>
        <tr>
          <td style="color: #92400e; font-weight: 700;">Daily Quota:</td>
          <td>20 Fresh Competitor Scans / Day</td>
        </tr>
      </table>
    </div>

    <!-- Payment CTA Button -->
    <div style="text-align: center; margin: 24px 0 26px 0;">
      <a href="https://buy.stripe.com/dummy_10_backlink_gap_pass" style="display: inline-block; padding: 15px 36px; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; font-size: 14px; font-weight: 800; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4); text-transform: uppercase; letter-spacing: 0.5px;">
        Complete Your $10 Payment to Activate &rarr;
      </a>
      <div style="font-size: 11px; color: #64748b; margin-top: 8px;">
        🔒 Secure Stripe Checkout &bull; Immediate Key Generation
      </div>
    </div>

    <!-- How Activation Works -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin-bottom: 20px;">
      <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; margin-bottom: 10px;">
        🔑 How Key Activation Works:
      </div>
      <p style="font-size: 13px; color: #475569; margin: 0; line-height: 1.6;">
        Once your $10 payment is confirmed, I will personally dispatch your exclusive <strong>90-Day Pro Access Key</strong> and 30-second activation guide directly to your email.
      </p>
    </div>

    <!-- Strategy Call Option -->
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 14px 18px; margin-bottom: 16px;">
      <div style="font-size: 13px; color: #166534; line-height: 1.5;">
        📅 <strong>Prefer to discuss your search rankings and link roadmap directly?</strong><br />
        You can <a href="https://calendly.com/sharikrasool" style="color: #059669; font-weight: 700; text-decoration: underline;">Schedule a 15-Minute Call on My Calendar</a>.
      </div>
    </div>
  `;

  return wrapInEmailCard({
    previewText: 'Order Pending: 3-Month Pro Pass Reservation ($10 USD)',
    badgeText: 'Pro Pass Reservation',
    badgeBg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    title: 'Backlink Gap Pass Reservation',
    subtitle: '90-Day Unlimited Access &bull; 20 Scans Every Day',
    contentHtml,
  });
}
