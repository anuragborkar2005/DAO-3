"use client";

import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Vote, TrendingUp, Award } from "lucide-react";
import { useGovernanceToken } from "@/hooks/use-governance-token";

export default function DashboardOverview() {
    const { address } = useAccount();
    const { votingPower, totalSupply } = useGovernanceToken();

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-zinc-400 mt-2">
                        Welcome back, {address?.slice(0, 6)}...
                        {address?.slice(-4)}
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-zinc-400 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> Voting Power
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-semibold text-emerald-400">
                            {votingPower}
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">
                            FYDAO Tokens
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-zinc-400">
                            Total Supply
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-semibold">
                            {totalSupply}
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">
                            Governance Tokens
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-zinc-400">
                            My Campaigns
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-semibold">3</div>
                        <p className="text-emerald-400 text-xs mt-1">
                            1 pending approval
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-zinc-400">
                            Votes Cast
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-semibold">12</div>
                        <p className="text-xs text-zinc-500 mt-1">
                            This season
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Link href="/campaigns/create">
                    <Card className="glass hover:border-emerald-500/50 transition-all h-full cursor-pointer">
                        <CardContent className="p-10 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6">
                                <Plus className="w-10 h-10 text-emerald-400" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-3">
                                Create New Campaign
                            </h3>
                            <p className="text-zinc-400">
                                Submit your project for DAO review and funding
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/governance">
                    <Card className="glass hover:border-violet-500/50 transition-all h-full cursor-pointer">
                        <CardContent className="p-10 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-violet-500/10 rounded-3xl flex items-center justify-center mb-6">
                                <Vote className="w-10 h-10 text-violet-400" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-3">
                                Participate in Governance
                            </h3>
                            <p className="text-zinc-400">
                                Vote on pending campaigns and milestone releases
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
