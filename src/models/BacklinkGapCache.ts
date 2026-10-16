import mongoose, { Schema, Document, Model } from "mongoose";

export interface RefPageResult {
  urlFrom: string;
  titleFrom: string;
  domain: string;
  domainRating: number;
  urlRating?: number;
  trafficDomain: number;
  trafficPage?: number;
  isDofollow: boolean;
  intersectCount: number;
  competitorsLinked: string[];
}

export interface IBacklinkGapCache extends Document {
  cacheKey: string;
  targetDomain: string;
  competitorDomains: string[];
  results: RefPageResult[];
  totalResults: number;
  analyzedAt: string;
  createdAt: Date;
  updatedAt: Date;
}

const BacklinkGapCacheSchema = new Schema<IBacklinkGapCache>(
  {
    cacheKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    targetDomain: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    competitorDomains: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    results: [
      {
        urlFrom: { type: String, required: true },
        titleFrom: { type: String, default: "" },
        domain: { type: String, required: true },
        domainRating: { type: Number, default: 0 },
        urlRating: { type: Number, default: 0 },
        trafficDomain: { type: Number, default: 0 },
        trafficPage: { type: Number, default: 0 },
        isDofollow: { type: Boolean, default: true },
        intersectCount: { type: Number, default: 1 },
        competitorsLinked: [{ type: String }],
      },
    ],
    totalResults: {
      type: Number,
      default: 0,
    },
    analyzedAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  { timestamps: true }
);

// TTL index to automatically purge entries after 15 days (15 * 24 * 3600 seconds)
BacklinkGapCacheSchema.index({ createdAt: 1 }, { expireAfterSeconds: 15 * 24 * 60 * 60 });

const BacklinkGapCache: Model<IBacklinkGapCache> =
  mongoose.models.BacklinkGapCache ||
  mongoose.model<IBacklinkGapCache>("BacklinkGapCache", BacklinkGapCacheSchema);

export default BacklinkGapCache;
