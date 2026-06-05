import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const BlogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  status: String,
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

async function run() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Supabase credentials not configured in .env.local');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Mock WebSocket to bypass Supabase Realtime client check in Node < 22
    globalThis.WebSocket = class {};

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const blogs = await Blog.find({}).lean();
    console.log(`Analyzing ${blogs.length} posts for embedded Base64 images...\n`);

    let updatedCount = 0;

    for (const blog of blogs) {
      const content = blog.content || '';
      const regex = /data:image\/([^;]+);base64,([^"'\s>]+)/gi;
      const matches = [];
      let match;

      while ((match = regex.exec(content)) !== null) {
        matches.push({
          full: match[0],
          ext: match[1] === 'svg+xml' ? 'svg' : (match[1] === 'jpeg' ? 'jpg' : match[1]),
          mimeType: match[1] === 'svg+xml' ? 'image/svg+xml' : `image/${match[1]}`,
          base64: match[2],
        });
      }

      if (matches.length === 0) {
        continue;
      }

      console.log(`Processing post "${blog.title}" (${matches.length} Base64 image(s) found)...`);
      let updatedContent = content;

      for (let i = 0; i < matches.length; i++) {
        const item = matches[i];
        console.log(`  Uploading image ${i + 1}/${matches.length} (Mime: ${item.mimeType})...`);

        // Decode base64
        const buffer = Buffer.from(item.base64, 'base64');
        const filename = `migrated-${Date.now()}-${Math.random().toString(36).slice(2)}.${item.ext}`;

        // Upload to Supabase storage
        const { error } = await supabase.storage
          .from('uploads')
          .upload(filename, buffer, {
            contentType: item.mimeType,
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          console.error(`  ❌ Failed to upload image ${i + 1}:`, error.message);
          throw error;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(filename);
        const imageUrl = publicUrlData.publicUrl;
        console.log(`  Uploaded successfully: ${imageUrl}`);

        // Replace base64 data string in content
        updatedContent = updatedContent.replace(item.full, imageUrl);
      }

      // Save the updated blog post
      await Blog.findByIdAndUpdate(blog._id, { content: updatedContent });
      console.log(`  ✅ Post "${blog.title}" updated successfully.\n`);
      updatedCount++;
    }

    console.log(`Migration completed. Total posts migrated/updated: ${updatedCount}`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

run();
