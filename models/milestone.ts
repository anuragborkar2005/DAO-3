import mongoose, { Schema, Document } from "mongoose";

export interface IMilestone extends Document {
  campaignAddress: string;
  milestoneId: number;
  proofCid: string;
  amount: string;
  status: "proposed" | "voting" | "approved" | "released" | "rejected";
  aiAnalysis?: {
    reportCid: string;
    verdict: "positive" | "negative" | "neutral";
    confidence: number;
    details: string;
  };
  proposalId?: string;
  createdAt: Date;
}

const MilestoneSchema = new Schema<IMilestone>({
  campaignAddress: { type: String, required: true },
  milestoneId: { type: Number, required: true },
  proofCid: { type: String, required: true },
  amount: { type: String, required: true },
  status: {
    type: String,
    enum: ["proposed", "voting", "approved", "released", "rejected"],
    default: "proposed",
  },
  aiAnalysis: {
    reportCid: String,
    verdict: String,
    confidence: Number,
    details: String,
  },
  proposalId: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Milestone ||
  mongoose.model<IMilestone>("Milestone", MilestoneSchema);
