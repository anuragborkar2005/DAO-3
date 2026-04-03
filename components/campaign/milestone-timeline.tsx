"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AiAnalysisBadge from "../ai/ai-analysis-badge";
import { IMilestone } from "@/types";
import { useQueue } from "@/hooks/use-queue";
import { useExecute } from "@/hooks/use-execute";
import { Loader2, Play, CheckCircle, Clock, ChevronRight, Vote as VoteIcon } from "lucide-react";
import { formatUnits } from "viem";
import Link from "next/link";

interface Props {
    milestones: IMilestone[];
    isCreator?: boolean;
    refetch?: () => void;
}

export default function MilestoneTimeline({
    milestones,
    isCreator,
    refetch,
}: Props) {
    const { queue, isPending: isQueuing } = useQueue();
    const { execute, isPending: isExecuting } = useExecute();

    const handleQueue = async (milestone: IMilestone) => {
        if (!milestone.daoProposal) return;
        const p = milestone.daoProposal;
        try {
            await queue(p.targets, p.values, p.calldatas, p.description);
            if (refetch) refetch();
        } catch (err) {
            console.error("Queue failed", err);
        }
    };

    const handleExecute = async (milestone: IMilestone) => {
        if (!milestone.daoProposal) return;
        const p = milestone.daoProposal;
        try {
            await execute(p.targets, p.values, p.calldatas, p.description);
            if (refetch) refetch();
        } catch (err) {
            console.error("Execute failed", err);
        }
    };

    return (
        <Card className="glass border-zinc-800/50 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500/20 via-violet-500/20 to-transparent" />
            
            <CardContent className="p-10">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        Project Milestones
                    </h2>
                </div>

                <div className="space-y-12 relative">
                    {/* Vertical line connector */}
                    <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-zinc-800/50" />

                    {milestones.length === 0 && (
                        <div className="text-center py-12 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 border-dashed">
                            <p className="text-zinc-500 font-medium">No milestones proposed yet.</p>
                        </div>
                    )}

                    {milestones.map((milestone, index) => {
                        const daoStatus = milestone.daoProposal?.status;
                        const isSucceeded = daoStatus === "succeeded";
                        const isQueued = daoStatus === "queued";
                        const isExecuted = daoStatus === "executed";
                        
                        const formattedAmount = Number(formatUnits(BigInt(milestone.amount || 0), 6)).toLocaleString();

                        return (
                            <div
                                key={milestone.milestoneId}
                                className="flex gap-8 relative group"
                            >
                                {/* Milestone Number Circle */}
                                <div className={`w-12 h-12 rounded-2xl ${isExecuted ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700"} flex items-center justify-center font-bold text-lg shrink-0 z-10 transition-all duration-300`}>
                                    {index + 1}
                                </div>

                                <div className="flex-1 bg-zinc-900/30 group-hover:bg-zinc-900/50 rounded-3xl p-8 border border-zinc-800/50 group-hover:border-zinc-700/50 transition-all duration-300">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge
                                                    variant="outline"
                                                    className={`${
                                                        isExecuted
                                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                                                    } px-2 py-0 text-[9px] font-bold uppercase tracking-widest`}
                                                >
                                                    {isExecuted ? "Completed" : daoStatus || milestone.status}
                                                </Badge>
                                                <span className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-tighter">
                                                    ID: {milestone.milestoneId}
                                                </span>
                                            </div>
                                            <p className="text-3xl font-black text-white">
                                                {formattedAmount} <span className="text-sm font-bold text-zinc-500 ml-1">USDC</span>
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                                            {isCreator && isSucceeded && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleQueue(milestone)}
                                                    disabled={isQueuing}
                                                    className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold h-10 px-6 rounded-xl w-full md:w-auto shadow-lg shadow-emerald-500/10"
                                                >
                                                    {isQueuing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                                    Queue Release
                                                </Button>
                                            )}

                                            {isCreator && isQueued && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleExecute(milestone)}
                                                    disabled={isExecuting}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold h-10 px-6 rounded-xl w-full md:w-auto shadow-lg shadow-blue-500/10"
                                                >
                                                    {isExecuting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                                                    Execute Release
                                                </Button>
                                            )}
                                            
                                            {isExecuted && (
                                                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/10">
                                                    <CheckCircle size={14} /> Funds Released
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-zinc-950/50 rounded-2xl p-6 border border-zinc-800/30">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
                                            AI Verification Report
                                        </div>
                                        <AiAnalysisBadge analysis={milestone.aiAnalysis} />
                                        
                                        <div className="mt-4 flex items-center gap-4 text-[10px] font-medium text-zinc-500">
                                            <span className="flex items-center gap-1.5">
                                                Proof CID: <span className="text-zinc-400 font-mono">{milestone.proofCid.slice(0, 10)}...</span>
                                            </span>
                                        </div>
                                    </div>

                                    {milestone.daoProposal && (
                                        <Link
                                            href={`/governance/${milestone.proposalId}`}
                                            className="mt-6 flex items-center justify-between p-4 bg-zinc-800/20 hover:bg-zinc-800/40 rounded-2xl border border-zinc-800/50 transition-all group/link"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                                    <VoteIcon className="w-4 h-4 text-violet-400" />
                                                </div>
                                                <span className="text-xs font-bold text-zinc-400">DAO Proposal History</span>
                                            </div>
                                            <ChevronRight size={16} className="text-zinc-600 group-hover/link:text-white transition-all transform group-hover/link:translate-x-1" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
