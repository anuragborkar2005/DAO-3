"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Play, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import VoteModal from "./vote-modal";
import { formatUnits } from "viem";
import { useQueue } from "@/hooks/use-queue";
import { useExecute } from "@/hooks/use-execute";

interface Proposal {
    proposalId: string;
    description: string;
    status:
        | "pending"
        | "active"
        | "succeeded"
        | "defeated"
        | "executed"
        | "canceled"
        | "queued";
    targets: string[];
    values: string[];
    calldatas: string[];
    isCampaignApproval: boolean;
    isMilestoneRelease?: boolean;
    campaignAddress?: string;
    votesFor: string | number;
    votesAgainst: string | number;
    endTime: number;
}

interface Props {
    proposal: Proposal;
    refetch: () => void;
}

export default function ProposalCard({ proposal, refetch }: Props) {
    const [showVoteModal, setShowVoteModal] = useState(false);
    
    const { queue, isPending: isQueuing } = useQueue();
    const { execute, isPending: isExecuting } = useExecute();

    const isActive = proposal.status === "active";
    const isSucceeded = proposal.status === "succeeded";
    const isQueued = proposal.status === "queued";
    
    const isCampaignApproval = proposal.isCampaignApproval;
    const isMilestoneRelease = proposal.isMilestoneRelease;

    // Formatting votes for token with 6 decimals
    const formattedVotesFor = formatUnits(BigInt(proposal.votesFor || 0), 6);
    const formattedVotesAgainst = formatUnits(BigInt(proposal.votesAgainst || 0), 6);

    const handleQueue = async () => {
        try {
            await queue(proposal.targets, proposal.values, proposal.calldatas, proposal.description);
        } catch (error) {
            console.error("Queue failed", error);
        }
    };

    const handleExecute = async () => {
        try {
            await execute(proposal.targets, proposal.values, proposal.calldatas, proposal.description);
        } catch (error) {
            console.error("Execute failed", error);
        }
    };

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
                                {formattedVotesFor}
                            </span>
                        </div>
                        <div>
                            <span className="text-red-400">Against: </span>
                            <span className="font-medium">
                                {formattedVotesAgainst}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="text-right flex flex-col items-end gap-2">
                    {isActive && (
                        <div className="flex items-center gap-2 text-amber-400 text-sm mb-2">
                            <Clock className="w-4 h-4" />
                            Voting ends soon
                        </div>
                    )}

                    {isActive && (
                        <Button
                            onClick={() => setShowVoteModal(true)}
                            className="bg-white text-black hover:bg-zinc-200"
                        >
                            Cast Vote
                        </Button>
                    )}

                    {isSucceeded && (
                        <Button
                            onClick={handleQueue}
                            disabled={isQueuing}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isQueuing ? "Queuing..." : "Queue Proposal"}
                            <Play className="ml-2 w-4 h-4" />
                        </Button>
                    )}

                    {isQueued && (
                        <Button
                            onClick={handleExecute}
                            disabled={isExecuting}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {isExecuting ? "Executing..." : "Execute Proposal"}
                            <CheckCircle className="ml-2 w-4 h-4" />
                        </Button>
                    )}

                    {!isActive && !isSucceeded && !isQueued && (
                        <Button disabled className="bg-zinc-800 text-zinc-500">
                            {proposal.status.toUpperCase()}
                        </Button>
                    )}
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
