"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import VoteModal from "./vote-modal";

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
    isMilestoneRelease?: boolean;
    campaignAddress?: string;
    votesFor: string;
    votesAgainst: string;
    endTime: number;
}

interface Props {
    proposal: Proposal;
    refetch: () => void;
}

export default function ProposalCard({ proposal, refetch }: Props) {
    const [showVoteModal, setShowVoteModal] = useState(false);

    const isActive = proposal.status === "active";
    const isCampaignApproval = proposal.isCampaignApproval;
    const isMilestoneRelease = proposal.isMilestoneRelease;

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-zinc-700 transition-all">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        {isCampaignApproval && (
                            <div className="px-3 py-1 bg-violet-500/10 text-violet-400 text-xs rounded-full">
                                Campaign Approval
                            </div>
                        )}
                        {isMilestoneRelease && (
                            <div className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-full">
                                Milestone Release
                            </div>
                        )}
                        {!isCampaignApproval && !isMilestoneRelease && (
                            <div className="px-3 py-1 bg-zinc-500/10 text-zinc-400 text-xs rounded-full">
                                Proposal
                            </div>
                        )}
                        <span className="text-xs font-mono text-zinc-500">
                            ID: {proposal.proposalId.slice(0, 10)}...
                        </span>
                    </div>

                    <h3 className="text-xl font-semibold mt-4 line-clamp-2">
                        {proposal.description}
                    </h3>

                    <div className="mt-6 flex gap-8 text-sm">
                        <div>
                            <span className="text-emerald-400">For: </span>
                            <span className="font-medium">
                                {proposal.votesFor}
                            </span>
                        </div>
                        <div>
                            <span className="text-red-400">Against: </span>
                            <span className="font-medium">
                                {proposal.votesAgainst}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    {isActive && (
                        <div className="flex items-center gap-2 text-amber-400 text-sm mb-4">
                            <Clock className="w-4 h-4" />
                            Voting ends soon
                        </div>
                    )}

                    <Button
                        onClick={() => setShowVoteModal(true)}
                        disabled={!isActive}
                        className="bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500"
                    >
                        {isActive ? "Cast Vote" : proposal.status.toUpperCase()}
                    </Button>
                </div>
            </div>

            <Link
                href={`/governance/${proposal.proposalId}`}
                className="mt-6 block text-sm text-zinc-400 hover:text-white transition"
            >
                View full proposal details →
            </Link>

            <VoteModal
                isOpen={showVoteModal}
                onClose={() => setShowVoteModal(false)}
                proposalId={proposal.proposalId}
                description={proposal.description}
                onVoteSuccess={refetch}
            />
        </div>
    );
}
