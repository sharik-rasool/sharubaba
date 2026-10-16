import mongoose, { Schema, Document, Model } from "mongoose";

export interface DailyUsageItem {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface IToolAccessKey extends Document {
  key: string;
  name: string;
  email: string;
  status: "active" | "expired" | "revoked" | "pending_payment";
  activatedAt?: Date;
  expiresAt?: Date;
  dailyLimit: number;
  dailyUsage: DailyUsageItem[];
  totalUsage: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ToolAccessKeySchema = new Schema<IToolAccessKey>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "revoked", "pending_payment"],
      default: "pending_payment",
      index: true,
    },
    activatedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    dailyLimit: {
      type: Number,
      default: 20,
    },
    dailyUsage: [
      {
        date: { type: String, required: true },
        count: { type: Number, default: 0 },
      },
    ],
    totalUsage: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const ToolAccessKey: Model<IToolAccessKey> =
  mongoose.models.ToolAccessKey ||
  mongoose.model<IToolAccessKey>("ToolAccessKey", ToolAccessKeySchema);

export default ToolAccessKey;
