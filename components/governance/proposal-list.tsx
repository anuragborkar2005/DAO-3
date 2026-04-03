"use client";

import { Loader2, AlertCircle } from "lucide-react";
import ProposalCard from "./proposal-card";

interface Proposal {
    proposalId: string;
    description: string;
    status:
        | "pending"
        | "active"
        | "succeeded"
        | "defeated"
        | "executed"
        | "canceled";
    targets: string[];
    isCampaignApproval: boolean;
    campaignAddress?: string;
    milestoneId?: number;
    votesFor: string;
    votesAgainst: string;
    endTime: number;
    createdAt: string;
}

interface Props {
    proposals: Proposal[];
    isLoading: boolean;
    refetch: () => void;
}

export default function ProposalList({ proposals, isLoading, refetch }: Props) {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
                <p className="text-zinc-400">Loading governance proposals...</p>
            </div>
        );
    }

    if (!proposals || proposals.length === 0) {
        return (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-16 text-center">
                <AlertCircle className="w-16 h-16 mx-auto text-zinc-500 mb-6" />
                <h3 className="text-2xl font-semibold text-zinc-300 mb-3">
                    No Active Proposals
                </h3>
                <p className="text-zinc-500 max-w-md mx-auto">
                    There are currently no governance proposals. Create a
                    campaign or propose a milestone to start the voting process.
                </p>
            </div>
        );
    }

    // Separate proposals by type for better UX
    const campaignApprovals = proposals.filter((p) => p.isCampaignApproval);
    const milestoneProposals = proposals.filter((p) => !p.isCampaignApproval);

    return (
        <div className="space-y-12">
            {/* Campaign Approval Proposals Section */}
            {campaignApprovals.length > 0 && (
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Campaign Approvals
                        </h2>
                        <span className="text-zinc-500 text-sm">
                            ({campaignApprovals.length})
                        </span>
                    </div>

                    <div className="grid gap-6">
                        {campaignApprovals.map((proposal) => (
                            <ProposalCard
                                key={proposal.proposalId}
                                proposal={proposal}
                                refetch={refetch}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Milestone Release Proposals Section */}
            {milestoneProposals.length > 0 && (
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Milestone Releases
                        </h2>
                        <span className="text-zinc-500 text-sm">
                            ({milestoneProposals.length})
                        </span>
                    </div>

                    <div className="grid gap-6">
                        {milestoneProposals.map((proposal) => (
                            <ProposalCard
                                key={proposal.proposalId}
                                proposal={proposal}
                                refetch={refetch}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
