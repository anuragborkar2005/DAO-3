"use client";

import { useQuery } from "@tanstack/react-query";
import CampaignCard from "@/components/campaign/campaign-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ICampaign } from "@/types";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function CampaignsPage() {
    const { address } = useAccount();
    const [activeTab, setActiveTab] = useState<"all" | "my">("all");

    const { data: campaigns = [], isLoading } = useQuery({
        queryKey: ["campaigns", activeTab, address],
        queryFn: async () => {
            const endpoint =
                activeTab === "all"
                    ? "/api/campaigns"
                    : `/api/campaigns/my?address=${address}`;
            const res = await fetch(endpoint);
            const data = await res.json();
            return data.campaigns || [];
        },
        refetchInterval: 20000,
        enabled: activeTab === "all" || !!address,
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold">Campaigns</h1>
                    <p className="text-zinc-400 mt-2">
                        {activeTab === "all"
                            ? "Discover and support verified projects"
                            : "Manage projects you have created"}
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

            {/* Tabs */}
            <div className="flex border-b border-zinc-800">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`px-8 py-4 text-sm font-medium transition-all relative ${activeTab === "all" ? "text-emerald-400" : "text-zinc-500 hover:text-white"}`}
                >
                    All Campaigns
                    {activeTab === "all" && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("my")}
                    className={`px-8 py-4 text-sm font-medium transition-all relative ${activeTab === "my" ? "text-emerald-400" : "text-zinc-500 hover:text-white"}`}
                >
                    My Campaigns
                    {activeTab === "my" && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400" />
                    )}
                </button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div
                            key={n}
                            className="h-80 bg-zinc-900 animate-pulse rounded-3xl"
                        />
                    ))}
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
                <div className="text-center py-24 bg-zinc-900/50 rounded-3xl border border-zinc-800 border-dashed">
                    <p className="text-zinc-500 mb-6">
                        {activeTab === "all"
                            ? "No campaigns yet. Be the first to create one!"
                            : "You haven't created any campaigns yet."}
                    </p>
                    {activeTab === "my" && (
                        <Link href="/campaigns/create">
                            <Button variant="outline">
                                Start Your First Campaign
                            </Button>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
