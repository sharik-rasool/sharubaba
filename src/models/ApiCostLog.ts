import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApiCostLog extends Document {
  tool: string;
  domain: string;
  source: "LIVE_AHREFS_API" | "CACHE_HIT" | "SIMULATED";
  creditsUsed: number;
  estimatedCostUsd: number;
  ip: string;
  status: "success" | "error";
  details?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApiCostLogSchema = new Schema<IApiCostLog>(
  {
    tool: {
      type: String,
      required: true,
      index: true,
    },
    domain: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    source: {
      type: String,
      enum: ["LIVE_AHREFS_API", "CACHE_HIT", "SIMULATED"],
      required: true,
      index: true,
    },
    creditsUsed: {
      type: Number,
      default: 0,
    },
    estimatedCostUsd: {
      type: Number,
      default: 0,
    },
    ip: {
      type: String,
      default: "127.0.0.1",
    },
    status: {
      type: String,
      enum: ["success", "error"],
      default: "success",
    },
    details: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const ApiCostLog: Model<IApiCostLog> =
  mongoose.models.ApiCostLog ||
  mongoose.model<IApiCostLog>("ApiCostLog", ApiCostLogSchema);

export default ApiCostLog;
