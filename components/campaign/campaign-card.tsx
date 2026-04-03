"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatUnits } from "viem";
import { Target, Users, ArrowRight } from "lucide-react";

//eslint-disable-next-line
export default function CampaignCard({ campaign }: { campaign: any }) {
    const isLive = campaign.isLive || campaign.status === "live";

    // Formatting USDC with 6 decimals
    const raised = Number(formatUnits(BigInt(campaign.raisedAmount || 0), 6));
    const target = Number(formatUnits(BigInt(campaign.targetAmount || 0), 6));
    const percent = Math.min(Math.round((raised / target) * 100), 100) || 0;

    return (
        <Link href={`/campaigns/${campaign.onChainAddress}`}>
            <Card className="glass border-zinc-800/50 hover:border-emerald-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <CardContent className="p-8 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                        <Badge
                            className={`${
                                isLive
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                            } px-3 py-1 font-bold text-[10px] tracking-widest rounded-lg`}
                        >
                            {campaign.status.toUpperCase()}
                        </Badge>
                        <div className="p-2 rounded-lg bg-zinc-800/50 text-zinc-500 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-all">
                            <ArrowRight size={16} />
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white group-hover:text-emerald-500 transition-colors line-clamp-2 leading-tight">
                        {campaign.metadata?.title || "Untitled Campaign"}
                    </h3>

                    <p className="text-zinc-500 text-sm mt-4 line-clamp-3 leading-relaxed flex-grow">
                        {campaign.metadata?.description}
                    </p>

                    <div className="mt-8 pt-6 border-t border-zinc-800/50">
                        <div className="flex justify-between items-end mb-3">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter mb-1 flex items-center gap-1">
                                    <Target size={10} /> Progress
                                </span>
                                <span className="text-lg font-bold text-white">
                                    {percent}%
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold text-zinc-400">
                                    {raised.toLocaleString()}
                                </span>
                                <span className="text-xs font-medium text-zinc-600">
                                    {" "}
                                    / {target.toLocaleString()} USDC
                                </span>
                            </div>
                        </div>

                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000"
                                style={{ width: `${percent}%` }}
                            />
                        </div>

                        <div className="flex items-center gap-4 mt-6">
                            <div className="flex items-center gap-1.5">
                                <Users size={14} className="text-zinc-500" />
                                <span className="text-xs font-bold text-zinc-500">
                                    {campaign.milestones?.length || 0}
                                </span>
                                <span className="text-[10px] font-bold text-zinc-600 uppercase">
                                    Steps
                                </span>
                            </div>
                            <div className="h-1 w-1 rounded-full bg-zinc-700" />
                            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">
                                {campaign.metadata?.category || "General"}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
