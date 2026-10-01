import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEngineSetting extends Document {
    key: string;
    isPaused: boolean;
    pausedAt?: Date;
    pausedBy?: string;
    reason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const EngineSettingSchema = new Schema<IEngineSetting>(
    {
        key: { type: String, required: true, unique: true, default: "blog_generator" },
        isPaused: { type: Boolean, default: false },
        pausedAt: { type: Date },
        pausedBy: { type: String, default: "" },
        reason: { type: String, default: "" },
    },
    { timestamps: true }
);

const EngineSetting: Model<IEngineSetting> =
    (mongoose.models.EngineSetting as Model<IEngineSetting>) ||
    mongoose.model<IEngineSetting>("EngineSetting", EngineSettingSchema);

export default EngineSetting;
