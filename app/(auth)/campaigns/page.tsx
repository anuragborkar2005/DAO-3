"use client";

import { useQuery } from "@tanstack/react-query";
import CampaignCard from "@/components/campaign/campaign-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ICampaign } from "@/types";

export default function CampaignsPage() {
    const { data: campaigns = [], isLoading } = useQuery({
        queryKey: ["all-campaigns"],
        queryFn: async () => {
            const res = await fetch("/api/campaigns");
            const data = await res.json();
            return data.campaigns || [];
        },
        refetchInterval: 20000,
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold">All Campaigns</h1>
                    <p className="text-zinc-400">
                        Discover and support verified projects
                    </p>
                </div>
                <Link href="/campaigns/create">
                    <Button
                        size="lg"
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        <Plus className="mr-2 w-5 h-5" />
                        Create Campaign
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="text-center py-20 text-zinc-400">
                    Loading campaigns...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((campaign: ICampaign) => (
                        <CampaignCard
                            key={campaign.onChainAddress}
                            campaign={campaign}
                        />
                    ))}
                </div>
            )}

            {campaigns.length === 0 && !isLoading && (
                <div className="text-center py-20">
                    <p className="text-zinc-400">
                        No campaigns yet. Be the first to create one!
                    </p>
                </div>
            )}
        </div>
    );
}
