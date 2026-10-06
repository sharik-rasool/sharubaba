import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuditOrder extends Document {
  website: string;
  name: string;
  email: string;
  competitors?: string;
  targetKeywords?: string;
  notes?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  price: number;
  currency: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AuditOrderSchema = new Schema<IAuditOrder>(
  {
    website: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    competitors: { type: String, default: '', trim: true },
    targetKeywords: { type: String, default: '', trim: true },
    notes: { type: String, default: '', trim: true },
    status: { type: String, enum: ['pending', 'processing', 'completed', 'cancelled'], default: 'pending' },
    price: { type: Number, default: 15 },
    currency: { type: String, default: 'USD' },
    ipAddress: { type: String, default: '' },
  },
  { timestamps: true }
);

const AuditOrder: Model<IAuditOrder> =
  (mongoose.models.AuditOrder as Model<IAuditOrder>) ||
  mongoose.model<IAuditOrder>("AuditOrder", AuditOrderSchema);

export default AuditOrder;
