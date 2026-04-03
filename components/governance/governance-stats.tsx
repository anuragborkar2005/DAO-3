"use client";

import { useGovernanceToken } from "@/hooks/use-governance-token";

export default function GovernanceStats() {
    const { totalSupply, quorum, votingPower } = useGovernanceToken();

    return (
        <div className="grid grid-cols-3 gap-6 text-center">
            <div className="bg-zinc-900 rounded-2xl p-6">
                <div className="text-emerald-400 text-3xl font-semibold">
                    {votingPower}
                </div>
                <div className="text-sm text-zinc-400 mt-1">
                    Your Voting Power
                </div>
            </div>
            <div className="bg-zinc-900 rounded-2xl p-6">
                <div className="text-3xl font-semibold">{quorum}%</div>
                <div className="text-sm text-zinc-400 mt-1">
                    Quorum Required
                </div>
            </div>
            <div className="bg-zinc-900 rounded-2xl p-6">
                <div className="text-3xl font-semibold">{totalSupply}</div>
                <div className="text-sm text-zinc-400 mt-1">
                    Total FYDAO Tokens
                </div>
            </div>
        </div>
    );
}
