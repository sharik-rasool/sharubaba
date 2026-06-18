import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlog extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    tags: string[];
    faqs?: { question: string; answer: string }[];
    status: "draft" | "published";
    seoTitle?: string;
    seoDescription?: string;
    canonicalUrl?: string;
    robotsMeta?: string;
    ogImage?: string;
    scheduledFor?: Date;
    viewCount: number;
    readingTime?: number;
    createdAt: Date;
    updatedAt: Date;
    
    // SEO Automation Fields
    aiGenerated: boolean;
    freshnessCheckedAt?: Date;
    primaryKeyword: string;
    secondaryKeywords: string[];
    anchors: string[];
    embeddings: number[];
    topicClusterId?: string;
    pillarPageSlug?: string;
    
    contentBrief?: {
        intent: string;
        primaryKeyword: string;
        secondaryKeywords: string[];
        competitorHeadings: string[];
        paaQuestions: string[];
        entities: string[];
    };
    
    qaReport?: {
        wordCount: number;
        headingCounts: Record<string, number>;
        internalLinkCount: number;
        primaryKeywordPresence: boolean;
        metaTitleLength: number;
        metaDescriptionLength: number;
        status: "passed" | "warned" | "failed";
    };
}

const BlogSchema = new Schema<IBlog>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, trim: true },
        content: { type: String, required: true },
        excerpt: { type: String, default: "" },
        coverImage: { type: String, default: "" },
        tags: { type: [String], default: [] },
        faqs: [
            {
                question: { type: String, required: true },
                answer: { type: String, required: true },
            },
        ],
        status: { type: String, enum: ["draft", "published"], default: "draft" },
        seoTitle: { type: String, default: "" },
        seoDescription: { type: String, default: "" },
        canonicalUrl: { type: String, default: "" },
        robotsMeta: { type: String, default: "index, follow" },
        ogImage: { type: String, default: "" },
        scheduledFor: { type: Date },
        viewCount: { type: Number, default: 0 },
        readingTime: { type: Number, default: 0 },
        
        // SEO Automation Fields
        aiGenerated: { type: Boolean, default: false },
        freshnessCheckedAt: { type: Date },
        primaryKeyword: { type: String, default: "" },
        secondaryKeywords: { type: [String], default: [] },
        anchors: { type: [String], default: [] },
        embeddings: { type: [Number], default: [] },
        topicClusterId: { type: String, default: "" },
        pillarPageSlug: { type: String, default: "" },
        
        contentBrief: {
            intent: { type: String, default: "" },
            primaryKeyword: { type: String, default: "" },
            secondaryKeywords: { type: [String], default: [] },
            competitorHeadings: { type: [String], default: [] },
            paaQuestions: { type: [String], default: [] },
            entities: { type: [String], default: [] }
        },
        
        qaReport: {
            wordCount: { type: Number },
            headingCounts: { type: Map, of: Number },
            internalLinkCount: { type: Number },
            primaryKeywordPresence: { type: Boolean },
            metaTitleLength: { type: Number },
            metaDescriptionLength: { type: Number },
            status: { type: String, enum: ["passed", "warned", "failed"] }
        }
    },
    { timestamps: true }
);

BlogSchema.index({ status: 1, scheduledFor: 1, createdAt: -1 });

BlogSchema.index({ status: 1, createdAt: -1 });

const Blog: Model<IBlog> =
    (mongoose.models.Blog as Model<IBlog>) ||
    mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
