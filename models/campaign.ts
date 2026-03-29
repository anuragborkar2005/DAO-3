import mongoose, { Schema, Document } from "mongoose";

export interface ICampaign extends Document {
  onChainAddress: string;
  factoryTxHash?: string;
  creator: string;
  metadataCid: string;
  status: "created" | "pending_approval" | "live" | "rejected" | "completed";
  isLive: boolean;
  approvalProposalId?: string;
  targetAmount?: string;
  raisedAmount?: string;
  aiReview?: {
    reportCid?: string;
    confidence?: number;
    summary?: string;
  };
  createdAt: Date;
  approvedAt?: Date;
}

const CampaignSchema = new Schema<ICampaign>({
  onChainAddress: { type: String, required: true, unique: true },
  creator: { type: String, required: true },
  metadataCid: { type: String, required: true },
  status: {
    type: String,
    enum: ["created", "pending_approval", "live", "rejected", "completed"],
    default: "created",
  },
  isLive: { type: Boolean, default: false },
  approvalProposalId: String,
  targetAmount: String,
  raisedAmount: String,
  aiReview: {
    reportCid: String,
    confidence: Number,
    summary: String,
  },
  createdAt: { type: Date, default: Date.now },
  approvedAt: Date,
});

export default mongoose.models.Campaign ||
  mongoose.model<ICampaign>("Campaign", CampaignSchema);
