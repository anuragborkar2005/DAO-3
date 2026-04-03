import { Document } from "mongoose";

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

export interface IProposal extends Document {
    proposalId: string;
    description: string;
    targets: string[];
    values: string[];
    calldatas: string[];
    proposer: string;
    status:
        | "pending"
        | "active"
        | "succeeded"
        | "defeated"
        | "executed"
        | "canceled";
    isCampaignApproval?: boolean;
    campaignAddress?: string;
    milestoneId?: number;
    votesFor: string;
    votesAgainst: string;
    endTime?: Date;
    createdAt: Date;
}

export interface IUser extends Document {
    address: string;
    votingPower?: string;
    createdAt: Date;
}
