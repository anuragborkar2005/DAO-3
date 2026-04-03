"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EscrowProgressBar from "../escrow/escrow-progress-bar";

//eslint-disable-next-line
export default function CampaignCard({ campaign }: { campaign: any }) {
    return (
        <Link href={`/campaigns/${campaign.onChainAddress}`}>
            <Card className="glass border-zinc-800 hover:border-emerald-500/30 transition-all overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <Badge
                                variant={
                                    campaign.isLive ? "default" : "secondary"
                                }
                            >
                                {campaign.status.toUpperCase()}
                            </Badge>
                            <h3 className="text-xl font-semibold mt-4 line-clamp-2">
                                {campaign.metadata?.title ||
                                    "Untitled Campaign"}
                            </h3>
                        </div>
                    </div>

                    <p className="text-zinc-400 text-sm mt-3 line-clamp-3">
                        {campaign.metadata?.description}
                    </p>

                    <div className="mt-8">
                        <EscrowProgressBar
                            raised={Number(campaign.raisedAmount || 0)}
                            target={Number(campaign.targetAmount || 0)}
                        />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
