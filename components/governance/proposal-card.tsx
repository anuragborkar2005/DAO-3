"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Clock,
    Play,
    CheckCircle,
    Vote as VoteIcon,
    ArrowRight,
    ShieldCheck,
    FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import VoteModal from "./vote-modal";
import { formatUnits } from "viem";
import { useQueue } from "@/hooks/use-queue";
import { useExecute } from "@/hooks/use-execute";
import { Badge } from "@/components/ui/badge";

export default function ProposalCard({
    proposal,
    refetch,
}: {
    //eslint-disable-next-line
    proposal: any;
    refetch: () => void;
}) {
    const [showVoteModal, setShowVoteModal] = useState(false);

    const { queue, isPending: isQueuing } = useQueue();
    const { execute, isPending: isExecuting } = useExecute();

    const isActive = proposal.status === "active";
    const isSucceeded = proposal.status === "succeeded";
    const isQueued = proposal.status === "queued";
    const isExecuted = proposal.status === "executed";

    const isCampaignApproval = proposal.isCampaignApproval;
    const isMilestoneRelease = proposal.isMilestoneRelease;

    const vFor = BigInt(proposal.votesFor || 0);
    const vAgainst = BigInt(proposal.votesAgainst || 0);
    const totalVotes = vFor + vAgainst;

    const formattedVotesFor = Number(formatUnits(vFor, 6)).toLocaleString();
    const formattedVotesAgainst = Number(
        formatUnits(vAgainst, 6),
    ).toLocaleString();

    const forPercent = totalVotes > 0n ? Number((vFor * 100n) / totalVotes) : 0;
    const againstPercent =
        totalVotes > 0n ? Number((vAgainst * 100n) / totalVotes) : 0;

    const handleQueue = async () => {
        try {
            await queue(
                proposal.targets,
                proposal.values,
                proposal.calldatas,
                proposal.description,
            );
            refetch();
        } catch (error) {
            console.error("Queue failed", error);
        }
    };

    const handleExecute = async () => {
        try {
            await execute(
                proposal.targets,
                proposal.values,
                proposal.calldatas,
                proposal.description,
            );
            refetch();
        } catch (error) {
            console.error("Execute failed", error);
        }
    };

    const getStatusColor = () => {
        switch (proposal.status) {
            case "active":
                return "text-amber-400 bg-amber-400/10 border-amber-400/20";
            case "succeeded":
                return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
            case "executed":
                return "text-blue-400 bg-blue-400/10 border-blue-400/20";
            case "defeated":
                return "text-red-400 bg-red-400/10 border-red-400/20";
            default:
                return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
        }
    };

    return (
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-[2rem] p-8 hover:border-emerald-500/20 transition-all group relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {isCampaignApproval && (
                            <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 px-3 py-1 font-bold text-[10px] tracking-widest uppercase">
                                <ShieldCheck size={12} className="mr-1.5" />{" "}
                                Campaign Launch
                            </Badge>
                        )}
                        {isMilestoneRelease && (
                            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 px-3 py-1 font-bold text-[10px] tracking-widest uppercase">
                                <FileText size={12} className="mr-1.5" />{" "}
                                Milestone Release
                            </Badge>
                        )}
                        <Badge
                            className={`${getStatusColor()} px-3 py-1 font-bold text-[10px] tracking-widest uppercase`}
                        >
                            {proposal.status}
                        </Badge>
                        <span className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-tighter">
                            Ref: {proposal.proposalId.slice(0, 10)}
                        </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-emerald-400 transition-colors">
                        {proposal.description}
                    </h3>

                    <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-md">
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                                    For
                                </span>
                                <span className="text-sm font-bold text-white">
                                    {formattedVotesFor} GTK
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 transition-all duration-1000"
                                    style={{ width: `${forPercent}%` }}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                                    Against
                                </span>
                                <span className="text-sm font-bold text-white">
                                    {formattedVotesAgainst} GTK
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-red-500 transition-all duration-1000"
                                    style={{ width: `${againstPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[180px]">
                    {isActive && (
                        <div className="flex items-center gap-2 text-amber-400/80 text-[10px] font-bold uppercase tracking-widest mb-2 justify-center md:justify-end">
                            <Clock size={12} /> Voting Active
                        </div>
                    )}

                    {isActive && (
                        <Button
                            onClick={() => setShowVoteModal(true)}
                            className="bg-white text-black hover:bg-zinc-200 font-bold py-6 rounded-2xl shadow-xl shadow-white/5 active:scale-95 transition-all"
                        >
                            <VoteIcon size={18} className="mr-2" /> Cast Vote
                        </Button>
                    )}

                    {isSucceeded && (
                        <Button
                            onClick={handleQueue}
                            disabled={isQueuing}
                            className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-6 rounded-2xl active:scale-95 transition-all"
                        >
                            {isQueuing ? "Queuing..." : "Queue for Execution"}
                            <Play size={18} className="ml-2" />
                        </Button>
                    )}

                    {isQueued && (
                        <Button
                            onClick={handleExecute}
                            disabled={isExecuting}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-2xl active:scale-95 transition-all"
                        >
                            {isExecuting ? "Executing..." : "Execute Proposal"}
                            <CheckCircle size={18} className="ml-2" />
                        </Button>
                    )}

                    {!isActive && !isSucceeded && !isQueued && !isExecuted && (
                        <div className="px-6 py-4 bg-zinc-800/50 rounded-2xl text-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest border border-zinc-700/50">
                            {proposal.status}
                        </div>
                    )}

                    {isExecuted && (
                        <div className="px-6 py-4 bg-emerald-500/5 rounded-2xl text-center text-[10px] font-bold text-emerald-500 uppercase tracking-widest border border-emerald-500/20 flex items-center justify-center gap-2">
                            <CheckCircle size={12} /> Executed
                        </div>
                    )}

                    <Link
                        href={`/governance/${proposal.proposalId}`}
                        className="text-center text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors mt-4"
                    >
                        Detailed Analytics{" "}
                        <ArrowRight size={10} className="inline ml-1" />
                    </Link>
                </div>
            </div>
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
