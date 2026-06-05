import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const BlogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  status: String,
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

function scanContentHealth(content = "") {
  let contentSize = 0;
  if (content) {
    contentSize = Buffer.byteLength(content, "utf8");
  }

  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let imageCount = 0;
  let base64Count = 0;
  let match;

  while ((match = imgRegex.exec(content)) !== null) {
    imageCount++;
    const src = match[1] || "";
    if (/^data:image\/[^;]+;base64,/i.test(src)) {
      base64Count++;
    }
  }

  return {
    contentSize,
    imageCount,
    base64Count,
  };
}

async function audit() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB.');

    const blogs = await Blog.find({}).lean();
    console.log(`Found ${blogs.length} total posts. Analyzing...\n`);

    const affected = [];
    let totalBase64Images = 0;

    console.log('--------------------------------------------------------------------------------');
    console.log(String('TITLE').padEnd(40) + ' | ' + String('SIZE').padEnd(10) + ' | ' + String('IMAGES').padEnd(8) + ' | ' + String('BASE64').padEnd(8) + ' | STATUS');
    console.log('--------------------------------------------------------------------------------');

    for (const blog of blogs) {
      const { contentSize, imageCount, base64Count } = scanContentHealth(blog.content);
      const isAffected = base64Count > 0;
      
      const sizeKB = (contentSize / 1024).toFixed(1) + ' KB';
      const titleStr = blog.title.length > 38 ? blog.title.substring(0, 35) + '...' : blog.title;
      
      console.log(
        titleStr.padEnd(40) + ' | ' + 
        sizeKB.padEnd(10) + ' | ' + 
        String(imageCount).padEnd(8) + ' | ' + 
        String(base64Count).padEnd(8) + ' | ' + 
        blog.status.toUpperCase() + (isAffected ? ' ❌ AFFECTED' : ' ✅ OK')
      );

      if (isAffected) {
        affected.push({
          title: blog.title,
          slug: blog.slug,
          size: contentSize,
          base64Count
        });
        totalBase64Images += base64Count;
      }
    }

    console.log('--------------------------------------------------------------------------------');
    console.log(`\nAudit Summary:`);
    console.log(`- Total Posts Scanned: ${blogs.length}`);
    console.log(`- Total Affected Posts: ${affected.length}`);
    console.log(`- Total Embedded Base64 Images: ${totalBase64Images}`);
    console.log('\nAffected Posts details:');
    affected.forEach((post, i) => {
      console.log(`${i + 1}. "${post.title}" (slug: /blog/${post.slug})`);
      console.log(`   Size: ${(post.size / 1024 / 1024).toFixed(2)} MB, Base64 Images: ${post.base64Count}`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Audit failed:', error);
    process.exit(1);
  }
}

audit();
