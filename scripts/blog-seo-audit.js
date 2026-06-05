import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const BlogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  excerpt: String,
  coverImage: String,
  tags: [String],
  status: String,
  seoTitle: String,
  seoDescription: String,
  canonicalUrl: String,
  ogImage: String,
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

// ANSI Escape Codes for colored terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underline: '\x1b[4m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m'
};

// --- Helper Functions ---

function slugify(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function detectMalformedHeadings(html) {
  const warnings = [];
  if (!html) return warnings;

  const headingRegex = /<(h[2-4])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const tag = match[1].toUpperCase();
    const content = match[2];
    const text = content.replace(/<[^>]*>?/gm, "").trim();

    const hasBr = /<br\s*\/?>/i.test(content);
    const hasBlock = /<(p|div|blockquote|ul|ol|li)\b/i.test(content);

    if (hasBr || hasBlock) {
      warnings.push(`Malformed Heading: Heading ${tag} "${text.substring(0, 40)}..." wraps structural block tags or line breaks.`);
    } else if (text.length > 150) {
      warnings.push(`Extremely Long Heading: Heading ${tag} is unusually long (${text.length} characters) and may contain paragraph content.`);
    }
  }

  return warnings;
}

function detectDeprecatedMarkup(html) {
  const tags = [];
  const attrs = [];
  if (!html) return { tags, attrs };

  const tagRegex = /<([a-z1-6]+)\b([^>]*)>/gi;
  let match;
  const deprecatedTagsList = ["font", "center", "u", "strike", "s", "big", "dir", "applet", "basefont", "tt"];
  const deprecatedAttrsList = ["align", "bgcolor", "border", "color", "face", "size"];

  while ((match = tagRegex.exec(html)) !== null) {
    const tagName = match[1].toLowerCase();
    const tagAttrs = match[2] || "";

    if (deprecatedTagsList.includes(tagName)) {
      tags.push(tagName);
    }

    deprecatedAttrsList.forEach(attr => {
      const attrRegex = new RegExp(`\\b${attr}\\s*=`, "i");
      if (attrRegex.test(tagAttrs)) {
        attrs.push(`${attr} in <${tagName}>`);
      }
    });
  }

  return { tags, attrs };
}

function validateHeadingHierarchy(html) {
  const warnings = [];
  if (!html) return warnings;

  const headings = [];
  const headingRegex = /<(h[1-4])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const tag = match[1].toUpperCase();
    const text = match[2].replace(/<[^>]*>?/gm, "").trim();
    headings.push({ tag, text });
  }

  let lastLevel = 1;

  headings.forEach((heading) => {
    const level = parseInt(heading.tag.substring(1), 10);

    if (level === 1) {
      warnings.push(`Multiple H1 headings: "${heading.text}" should be H2.`);
    } else if (level > lastLevel + 1) {
      warnings.push(`Hierarchy Gap: H${level} "${heading.text}" directly follows H${lastLevel} without intermediate.`);
    }

    lastLevel = level;
  });

  return warnings;
}

function scanContentHealth(content = "", blogMeta, allBlogs, currentBlogId) {
  let contentSize = 0;
  if (content) {
    contentSize = Buffer.byteLength(content, "utf8");
  }

  let imageCount = 0;
  let base64Count = 0;
  let missingAltCount = 0;
  let missingDimensionsCount = 0;

  let headingsCount = 0;
  let emptyHeadingsCount = 0;
  let imageHeadingsCount = 0;
  let missingIdsCount = 0;

  let internalLinksCount = 0;
  let brokenLinksCount = 0;
  const brokenLinksList = [];

  // Headings
  const headingRegex = /<(h[2-4])\b([^>]*)>([\s\S]*?)<\/h\1>/gi;
  let headingMatch;
  while ((headingMatch = headingRegex.exec(content)) !== null) {
    headingsCount++;
    const attrs = headingMatch[2] || "";
    const innerContent = headingMatch[3] || "";
    const plainText = innerContent.replace(/<[^>]*>?/gm, "").trim();

    if (!/\bid\s*=\s*["']/i.test(attrs)) {
      missingIdsCount++;
    }

    if (!plainText || plainText.replace(/&nbsp;/g, "").trim() === "") {
      const hasImg = /<img\b[^>]*>/i.test(innerContent);
      if (hasImg) {
        imageHeadingsCount++;
      } else {
        emptyHeadingsCount++;
      }
    }
  }

  const malformedHeadingsList = detectMalformedHeadings(content);
  const malformedHeadingsCount = malformedHeadingsList.length;

  // Images
  const imgRegex = /<img\b([^>]*?)>/gi;
  let imgMatch;
  const allAlts = [];
  let shortAltsCount = 0;
  let genericAltsCount = 0;
  let oversizedImagesCount = 0;
  const genericWords = ["image", "screenshot", "photo", "img", "pic", "picture", "logo"];

  while ((imgMatch = imgRegex.exec(content)) !== null) {
    imageCount++;
    const attrs = imgMatch[1] || "";
    
    const srcMatch = attrs.match(/src\s*=\s*["']([^"']+)["']/i);
    const src = srcMatch ? srcMatch[1] : "";
    if (/^data:image\/[^;]+;base64,/i.test(src)) {
      base64Count++;
    }

    const hasAlt = /alt\s*=\s*["']/i.test(attrs);
    const altMatch = attrs.match(/alt\s*=\s*["']([^"']*)["']/i);
    const altText = altMatch ? altMatch[1].trim() : "";
    if (!hasAlt || altText === "") {
      missingAltCount++;
    } else {
      allAlts.push(altText.toLowerCase());
      if (altText.length < 5) {
        shortAltsCount++;
      }
      if (genericWords.some(word => altText.toLowerCase() === word || altText.toLowerCase().includes(" " + word) || altText.toLowerCase().includes(word + " "))) {
        genericAltsCount++;
      }
    }

    const hasWidth = /width\s*=\s*["']/i.test(attrs);
    const hasHeight = /height\s*=\s*["']/i.test(attrs);
    if (!hasWidth || !hasHeight) {
      missingDimensionsCount++;
    } else {
      const widthMatch = attrs.match(/width\s*=\s*["'](\d+)["']/i);
      const heightMatch = attrs.match(/height\s*=\s*["'](\d+)["']/i);
      const wVal = widthMatch ? parseInt(widthMatch[1], 10) : 0;
      const hVal = heightMatch ? parseInt(heightMatch[1], 10) : 0;
      if (wVal > 1600 || hVal > 1600) {
        oversizedImagesCount++;
      }
    }
  }

  const duplicateAlts = allAlts.filter((alt, idx) => allAlts.indexOf(alt) !== idx);

  // Links
  const linkRegex = /<a\b([^>]*?)>/gi;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(content)) !== null) {
    const attrs = linkMatch[1] || "";
    const hrefMatch = attrs.match(/href\s*=\s*["']([^"']*)["']/i);
    const href = hrefMatch ? hrefMatch[1].trim() : "";

    const isPlaceholder = !href || 
      href === "#" || 
      href.toLowerCase().startsWith("javascript:") || 
      href.toLowerCase().includes("example.com") || 
      href.toLowerCase().includes("todo.com");

    if (isPlaceholder) {
      brokenLinksCount++;
      brokenLinksList.push(href || "(empty)");
    } else {
      const isInternal = /^\/(?!\/)/.test(href) || 
        href.includes("sharikrasool.com") || 
        href.includes("localhost");
      if (isInternal) {
        internalLinksCount++;
      }
    }
  }

  const hierarchyWarnings = validateHeadingHierarchy(content);
  const deprecatedMarkup = detectDeprecatedMarkup(content);
  const deprecatedTagsCount = deprecatedMarkup.tags.length;
  const deprecatedAttrsCount = deprecatedMarkup.attrs.length;
  const deprecatedDetails = [
    ...deprecatedMarkup.tags.map(t => `<${t}> element`),
    ...deprecatedMarkup.attrs.map(a => `${a} attribute`)
  ];

  // Heavy Embeds
  let heavyEmbedsCount = 0;
  const iframeRegex = /<iframe\b[^>]*>/gi;
  const iframes = content.match(iframeRegex) || [];
  heavyEmbedsCount += iframes.length;

  const scriptRegex = /<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi;
  let scriptMatch;
  while ((scriptMatch = scriptRegex.exec(content)) !== null) {
    const scriptSrc = scriptMatch[1].toLowerCase();
    if (scriptSrc.includes("calendly") || scriptSrc.includes("twitter") || scriptSrc.includes("facebook") || scriptSrc.includes("instagram") || scriptSrc.includes("widget")) {
      heavyEmbedsCount++;
    }
  }

  // Canonical & Metadata
  let missingCanonical = false;
  let missingMetaDesc = false;
  let missingOgImage = false;

  if (blogMeta) {
    const expectedCanonical = `https://www.sharikrasool.com/blog/${blogMeta.slug}`;
    if (!blogMeta.canonicalUrl || blogMeta.canonicalUrl.trim() !== expectedCanonical) {
      missingCanonical = true;
    }
    if (!blogMeta.seoDescription || blogMeta.seoDescription.trim() === "") {
      missingMetaDesc = true;
    }
    if (!blogMeta.ogImage && !blogMeta.coverImage) {
      missingOgImage = true;
    }
  } else {
    missingCanonical = true;
    missingMetaDesc = true;
    missingOgImage = true;
  }

  const missingSchemaProps = [];
  if (blogMeta) {
    if (!blogMeta.title || blogMeta.title.trim() === "") missingSchemaProps.push("Headline (title)");
    if (!blogMeta.createdAt) missingSchemaProps.push("Published Date (createdAt)");
    if (!blogMeta.updatedAt) missingSchemaProps.push("Modified Date (updatedAt)");
    if (!blogMeta.coverImage && !blogMeta.ogImage) missingSchemaProps.push("Featured Image (coverImage)");
  } else {
    missingSchemaProps.push("Headline (title)", "Published Date (createdAt)", "Modified Date (updatedAt)", "Featured Image (coverImage)");
  }

  // Age & Freshness
  let ageInDays = 0;
  if (blogMeta?.updatedAt) {
    const updatedDate = new Date(blogMeta.updatedAt);
    ageInDays = Math.floor((Date.now() - updatedDate.getTime()) / (1000 * 60 * 60 * 24));
  } else if (blogMeta?.createdAt) {
    const createdDate = new Date(blogMeta.createdAt);
    ageInDays = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Incoming Links & Suggestions
  let incomingLinksCount = 0;
  let isOrphan = false;
  const internalLinkSuggestions = [];

  const slugLower = (blogMeta?.slug || "").toLowerCase();
  const tagsLower = (blogMeta?.tags || []).map(t => t.toLowerCase());
  const isToolOrLanding = slugLower.includes("-tool") || 
                          slugLower.includes("-calculator") || 
                          slugLower.includes("landing") || 
                          tagsLower.includes("tool") || 
                          tagsLower.includes("landing");
  const isNewPost = ageInDays <= 30;

  if (allBlogs && blogMeta?.slug) {
    allBlogs.forEach(other => {
      if (other.slug === blogMeta.slug) return;
      const otherContent = other.content || "";
      const slugLinkRegex = new RegExp(`href=["'][^"']*/blog/${blogMeta.slug}["']`, "i");
      if (slugLinkRegex.test(otherContent)) {
        incomingLinksCount++;
      }
    });

    if (incomingLinksCount === 0) {
      isOrphan = true;
    }

    const contentPlain = content.replace(/<[^>]*>?/gm, " ").toLowerCase();
    for (const other of allBlogs) {
      if (other.slug === blogMeta.slug) continue;
      if (currentBlogId && String(other._id) === String(currentBlogId)) continue;

      const linksToOtherRegex = new RegExp(`href=["'][^"']*/blog/${other.slug}["']`, "i");
      if (linksToOtherRegex.test(content)) continue;

      const keywords = other.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .split(/\s+/)
        .filter(word => word.length >= 5)
        .filter(word => !["should", "about", "their", "there", "these", "those", "would", "could"].includes(word));
      
      for (const keyword of keywords) {
        const keywordRegex = new RegExp(`\\b${keyword}\\b`, "i");
        if (keywordRegex.test(contentPlain)) {
          internalLinkSuggestions.push({
            title: other.title,
            slug: other.slug,
            matchedPhrase: keyword
          });
          break;
        }
      }

      if (internalLinkSuggestions.length >= 3) break;
    }
  }

  // Health Score
  let deductions = 0;
  if (contentSize > 1.5 * 1024 * 1024) deductions += 50;
  else if (contentSize > 500 * 1024) deductions += 20;

  deductions += base64Count * 50;
  deductions += emptyHeadingsCount * 10;
  deductions += imageHeadingsCount * 10;
  deductions += missingIdsCount * 2;
  deductions += hierarchyWarnings.length * 2;
  deductions += malformedHeadingsCount * 5;
  deductions += missingAltCount * 10;
  deductions += missingDimensionsCount * 2;
  deductions += shortAltsCount * 2;
  deductions += genericAltsCount * 2;
  deductions += brokenLinksCount * 15;

  if (missingCanonical) deductions += 15;
  if (missingMetaDesc) deductions += 15;
  if (missingOgImage) deductions += 5;

  deductions += missingSchemaProps.length * 10;

  if (isOrphan && !isToolOrLanding && !isNewPost) {
    deductions += 5;
  }

  const seoHealthScore = Math.max(0, 100 - deductions);

  // Status and messages
  let status = "safe";
  const messages = [];

  if (base64Count > 0) {
    status = "critical";
    messages.push(`Base64 Images (${base64Count} found)`);
  }
  if (brokenLinksCount > 0) {
    if (status !== "critical") status = "warning";
    messages.push(`Broken Links (${brokenLinksCount} found)`);
  }
  if (missingAltCount > 0) {
    if (status !== "critical") status = "warning";
    messages.push(`Missing Alt tags (${missingAltCount} found)`);
  }
  if (malformedHeadingsCount > 0) {
    if (status !== "critical") status = "warning";
    messages.push(`Malformed Headings (${malformedHeadingsCount} found)`);
  }
  if (missingCanonical) {
    if (status !== "critical") status = "warning";
    messages.push(`Canonical URL Mismatch / Missing`);
  }
  if (missingMetaDesc) {
    if (status !== "critical") status = "warning";
    messages.push(`Meta Description Missing`);
  }
  if (missingSchemaProps.length > 0) {
    if (status !== "critical") status = "warning";
    messages.push(`Missing Schema Properties (${missingSchemaProps.length} missing)`);
  }
  if (isOrphan && !isToolOrLanding && !isNewPost) {
    if (status !== "critical") status = "warning";
    messages.push(`Orphan Post`);
  }
  if (ageInDays > 180) {
    if (status !== "critical") status = "warning";
    messages.push(`Obsolete/Stale Content (${ageInDays} days old)`);
  }
  if (deprecatedTagsCount > 0 || deprecatedAttrsCount > 0) {
    if (status !== "critical") status = "warning";
    messages.push(`Deprecated HTML Markup`);
  }

  return {
    contentSize,
    imageCount,
    base64Count,
    headingsCount,
    emptyHeadingsCount,
    imageHeadingsCount,
    missingIdsCount,
    missingAltCount,
    missingDimensionsCount,
    internalLinksCount,
    brokenLinksCount,
    brokenLinksList,
    seoHealthScore,
    hierarchyWarnings,
    status,
    messages,
    malformedHeadingsCount,
    malformedHeadingsList,
    missingCanonical,
    missingMetaDesc,
    missingSchemaProps,
    duplicateAlts,
    shortAltsCount,
    genericAltsCount,
    oversizedImagesCount,
    deprecatedTagsCount,
    deprecatedAttrsCount,
    deprecatedDetails,
    heavyEmbedsCount,
    incomingLinksCount,
    isOrphan,
    internalLinkSuggestions,
    ageInDays,
    isToolOrLanding,
    isNewPost
  };
}

// --- CLI Runner ---

async function run() {
  if (!MONGODB_URI) {
    console.error(`${colors.red}${colors.bright}❌ Error: MONGODB_URI is not defined in .env.local${colors.reset}`);
    process.exit(1);
  }

  try {
    console.log(`${colors.cyan}Connecting to MongoDB...${colors.reset}`);
    await mongoose.connect(MONGODB_URI);
    console.log(`${colors.green}Connected successfully.${colors.reset}\n`);

    const blogs = await Blog.find({}).lean();
    console.log(`${colors.bright}Found ${blogs.length} total posts. Running monthly SEO audit...${colors.reset}\n`);

    const audited = blogs.map(blog => {
      const audit = scanContentHealth(
        blog.content,
        {
          title: blog.title,
          slug: blog.slug,
          seoDescription: blog.seoDescription,
          canonicalUrl: blog.canonicalUrl,
          coverImage: blog.coverImage,
          ogImage: blog.ogImage,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
          tags: blog.tags
        },
        blogs.map(b => ({
          _id: b._id,
          title: b.title,
          slug: b.slug,
          content: b.content,
          createdAt: b.createdAt,
          tags: b.tags
        })),
        blog._id
      );
      return { blog, audit };
    });

    // Sort by size desc
    const sortedBySize = [...audited].sort((a, b) => b.audit.contentSize - a.audit.contentSize);
    
    // Sort by score asc
    const sortedByScore = [...audited].sort((a, b) => a.audit.seoHealthScore - b.audit.seoHealthScore);

    console.log(`${colors.bright}${colors.cyan}================================================================================${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}                      SITE-WIDE BLOG SEO HEALTH REPORT                          ${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}================================================================================${colors.reset}\n`);

    // Aggregate counts
    let safeCount = 0;
    let warningCount = 0;
    let criticalCount = 0;
    let totalSize = 0;
    let totalBase64 = 0;
    let totalOrphans = 0;
    let totalStale = 0;

    audited.forEach(({ audit }) => {
      totalSize += audit.contentSize;
      totalBase64 += audit.base64Count;
      if (audit.status === 'safe') safeCount++;
      if (audit.status === 'warning') warningCount++;
      if (audit.status === 'critical') criticalCount++;
      if (audit.isOrphan && !audit.isToolOrLanding && !audit.isNewPost) totalOrphans++;
      if (audit.ageInDays > 180) totalStale++;
    });

    console.log(`${colors.bright}Overview stats:${colors.reset}`);
    console.log(`- Total Blog Posts:   ${colors.bright}${blogs.length}${colors.reset}`);
    console.log(`- Average Page Size:  ${colors.bright}${(totalSize / blogs.length / 1024).toFixed(1)} KB${colors.reset}`);
    
    const perfectPct = ((safeCount / blogs.length) * 100).toFixed(0);
    console.log(`- SEO Compliant:      ${colors.green}${colors.bright}${safeCount} (${perfectPct}%)${colors.reset}`);
    console.log(`- Warning Posts:      ${colors.yellow}${colors.bright}${warningCount}${colors.reset}`);
    console.log(`- Critical Posts:     ${colors.red}${colors.bright}${criticalCount}${colors.reset}`);
    console.log(`- Base64 Images:      ${totalBase64 > 0 ? colors.red : colors.green}${colors.bright}${totalBase64}${colors.reset}`);
    console.log(`- Orphan Articles:    ${totalOrphans > 0 ? colors.red : colors.green}${colors.bright}${totalOrphans}${colors.reset}`);
    console.log(`- Stale (>180 days):  ${totalStale > 0 ? colors.yellow : colors.green}${colors.bright}${totalStale}${colors.reset}\n`);

    console.log(`${colors.bright}${colors.underline}1. Top SEO issues (Sorted by SEO Score ascending)${colors.reset}`);
    sortedByScore.slice(0, 5).forEach(({ blog, audit }, idx) => {
      const scoreColor = audit.seoHealthScore >= 90 ? colors.green : (audit.seoHealthScore >= 70 ? colors.yellow : colors.red);
      console.log(`\n${idx + 1}. [${scoreColor}${colors.bright}${audit.seoHealthScore}/100${colors.reset}] "${colors.bright}${blog.title}${colors.reset}"`);
      console.log(`   URL:   /blog/${blog.slug}`);
      console.log(`   Size:  ${(audit.contentSize / 1024).toFixed(1)} KB | Status: ${audit.status.toUpperCase()}`);
      if (audit.messages.length > 0) {
        console.log(`   Issues found:`);
        audit.messages.forEach(msg => {
          console.log(`     - ${colors.red}${msg}${colors.reset}`);
        });
      } else {
        console.log(`     - ${colors.green}Perfect structure! No issues detected.${colors.reset}`);
      }
    });

    console.log(`\n${colors.bright}${colors.underline}2. Largest Page Footprints (Crawl footprint ranking)${colors.reset}`);
    sortedBySize.slice(0, 3).forEach(({ blog, audit }, idx) => {
      const sizeColor = audit.contentSize > 1.5 * 1024 * 1024 ? colors.red : (audit.contentSize > 500 * 1024 ? colors.yellow : colors.green);
      console.log(`   ${idx + 1}. [${sizeColor}${colors.bright}${(audit.contentSize / 1024).toFixed(1)} KB${colors.reset}] "${blog.title}"`);
    });

    console.log(`\n${colors.bright}${colors.underline}3. Content Freshness Actions (Older than 180 days)${colors.reset}`);
    const stalePosts = audited.filter(({ audit }) => audit.ageInDays > 180);
    if (stalePosts.length === 0) {
      console.log(`   ${colors.green}✅ All articles are fresh and recently updated!${colors.reset}`);
    } else {
      stalePosts.slice(0, 5).forEach(({ blog, audit }) => {
        console.log(`   - [${colors.yellow}${audit.ageInDays} days old${colors.reset}] "${blog.title}" -> Consider reviewing statistical facts, outbound links or adding structured blocks.`);
      });
      if (stalePosts.length > 5) {
        console.log(`     ... and ${stalePosts.length - 5} more posts.`);
      }
    }

    console.log(`\n${colors.bright}${colors.underline}4. Internal Link Opportunities (Keyword matches)${colors.reset}`);
    let totalSuggestions = 0;
    audited.forEach(({ blog, audit }) => {
      if (audit.internalLinkSuggestions.length > 0) {
        totalSuggestions += audit.internalLinkSuggestions.length;
        console.log(`\n   "${colors.bright}${blog.title}${colors.reset}" (/blog/${blog.slug})`);
        audit.internalLinkSuggestions.forEach(s => {
          console.log(`     -> Link to ${colors.cyan}/blog/${s.slug}${colors.reset} (matched keyword: ${colors.underline}"${s.matchedPhrase}"${colors.reset})`);
        });
      }
    });
    if (totalSuggestions === 0) {
      console.log(`   ${colors.green}✅ No immediate keyword matching link opportunities found.${colors.reset}`);
    }

    console.log(`\n${colors.bright}${colors.cyan}================================================================================${colors.reset}`);
    console.log(`${colors.bright}${colors.green}Audit completed successfully.${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}================================================================================${colors.reset}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`${colors.red}Audit failed:${colors.reset}`, error);
    process.exit(1);
  }
}

run();
