"use client";

import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Vote, TrendingUp, Award } from "lucide-react";
import { useGovernanceToken } from "@/hooks/use-governance-token";
import RoleGuard from "@/components/auth/role-guard";
import MakeDaoMember from "@/components/admin/make-dao-member";
import { formatUnits } from "viem";
import { useState, useEffect } from "react";

export default function DashboardOverview() {
    const { address } = useAccount();
    const { votingPowerRaw, totalSupplyRaw } = useGovernanceToken();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Formatting with 6 decimals for the Governance Token
    const formattedVP = Number(formatUnits((votingPowerRaw as bigint) || 0n, 6)).toLocaleString(undefined, { maximumFractionDigits: 2 });
    const formattedTotal = Number(formatUnits((totalSupplyRaw as bigint) || 0n, 6)).toLocaleString(undefined, { maximumFractionDigits: 0 });

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-zinc-400 mt-3 text-lg">
                        Welcome back, <span className="text-emerald-400 font-mono">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "DAO Member"}</span>
                    </p>
                </div>
                <RoleGuard allowedRoles={["dao_member", "admin"]}>
                    <Link href="/campaigns/create">
                        <Button
                            size="lg"
                            className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-8 py-6 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                        >
                            <Plus className="mr-2 w-5 h-5" />
                            Launch Campaign
                        </Button>
                    </Link>
                </RoleGuard>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass border-zinc-800/50 hover:border-emerald-500/30 transition-all group">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                            <TrendingUp className="w-3 h-3 text-emerald-500" /> Voting Power
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {formattedVP}
                        </div>
                        <p className="text-[10px] font-bold text-zinc-600 mt-2 uppercase tracking-tighter">
                            vGTK Tokens
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass border-zinc-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                            <Award className="w-3 h-3 text-violet-500" /> Total DAO Stake
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white">
                            {formattedTotal}
                        </div>
                        <p className="text-[10px] font-bold text-zinc-600 mt-2 uppercase tracking-tighter">
                            Circulating Supply
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass border-zinc-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                            <Plus className="w-3 h-3 text-blue-500" /> My Proposals
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white">3</div>
                        <p className="text-blue-400 text-[10px] font-bold mt-2 uppercase tracking-tighter">
                            1 pending approval
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass border-zinc-800/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                            <Vote className="w-3 h-3 text-amber-500" /> Participation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white">12</div>
                        <p className="text-zinc-600 text-[10px] font-bold mt-2 uppercase tracking-tighter">
                            Votes Cast This Season
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                <Link href="/campaigns/create">
                    <Card className="glass border-zinc-800/50 hover:border-emerald-500/50 transition-all h-full cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[100px] rounded-full group-hover:bg-emerald-500/10 transition-all" />
                        <CardContent className="p-12 flex flex-col items-center justify-center text-center relative z-10">
                            <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                <Plus className="w-12 h-12 text-emerald-400" />
                            </div>
                            <h3 className="text-3xl font-bold mb-4">
                                Create Campaign
                            </h3>
                            <p className="text-zinc-400 text-lg max-w-xs mx-auto leading-relaxed">
                                Pitch your vision and secure decentralized funding from the community.
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/governance">
                    <Card className="glass border-zinc-800/50 hover:border-violet-500/50 transition-all h-full cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 blur-[100px] rounded-full group-hover:bg-violet-500/10 transition-all" />
                        <CardContent className="p-12 flex flex-col items-center justify-center text-center relative z-10">
                            <div className="w-24 h-24 bg-violet-500/10 rounded-[2.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                <Vote className="w-12 h-12 text-violet-400" />
                            </div>
                            <h3 className="text-3xl font-bold mb-4">
                                DAO Governance
                            </h3>
                            <p className="text-zinc-400 text-lg max-w-xs mx-auto leading-relaxed">
                                Use your voting power to shape the future of active projects and releases.
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
            <div className="pt-8">
                <MakeDaoMember />
            </div>
        </div>
    );
}
