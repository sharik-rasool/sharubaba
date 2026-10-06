import mongoose, { Schema, Document, Model } from "mongoose";

export interface CountryTrafficData {
  countryCode: string;
  countryName: string;
  flagEmoji: string;
  traffic: number;
  trafficFormatted: string;
  percentage: number;
  keywords: number;
}

export interface IDomainCache extends Document {
  domain: string;
  domainRating: number;
  ahrefsRank?: number;
  organicTraffic: number;
  trafficFormatted: string;
  referringDomains: number;
  backlinks: number;
  organicKeywords: number;
  authorityTier: string;
  healthScore: number;
  verdict: string;
  recommendation: string;
  source: 'live' | 'simulation';
  topCountries?: CountryTrafficData[];
  analyzedAt: string;
  createdAt: Date;
  updatedAt: Date;
}

const DomainCacheSchema = new Schema<IDomainCache>(
  {
    domain: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    domainRating: { type: Number, default: 0 },
    ahrefsRank: { type: Number, default: 0 },
    organicTraffic: { type: Number, default: 0 },
    trafficFormatted: { type: String, default: '0 /mo' },
    referringDomains: { type: Number, default: 0 },
    backlinks: { type: Number, default: 0 },
    organicKeywords: { type: Number, default: 0 },
    authorityTier: { type: String, default: '' },
    healthScore: { type: Number, default: 50 },
    verdict: { type: String, default: '' },
    recommendation: { type: String, default: '' },
    source: { type: String, enum: ['live', 'simulation'], default: 'live' },
    topCountries: [
      {
        countryCode: { type: String, default: '' },
        countryName: { type: String, default: '' },
        flagEmoji: { type: String, default: '' },
        traffic: { type: Number, default: 0 },
        trafficFormatted: { type: String, default: '' },
        percentage: { type: Number, default: 0 },
        keywords: { type: Number, default: 0 },
      },
    ],
    analyzedAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

const DomainCache: Model<IDomainCache> =
  (mongoose.models.DomainCache as Model<IDomainCache>) ||
  mongoose.model<IDomainCache>("DomainCache", DomainCacheSchema);

export default DomainCache;
