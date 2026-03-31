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
