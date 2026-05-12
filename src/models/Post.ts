import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for this post.'],
        maxlength: [60, 'Title cannot be more than 60 characters'],
    },
    slug: {
        type: String,
        required: [true, 'Please provide a slug for this post.'],
        unique: true,
    },
    content: {
        type: String,
        required: [true, 'Please provide content for this post.'],
    },
    excerpt: {
        type: String,
        maxlength: [200, 'Excerpt cannot be more than 200 characters'],
    },
    coverImage: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    tags: {
        type: [String],
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
    },
}, { timestamps: true });

export default mongoose.models?.Post || mongoose.model('Post', PostSchema);
