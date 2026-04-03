"use client";

import { useGovernanceToken } from "@/hooks/use-governance-token";
import { useVoteWithDelegation } from "@/hooks/use-vote-with-delegation";
import { Button } from "@/components/ui/button";
import React from "react";

export default function GovernanceStats() {
    const { totalSupply, quorum, votingPower, balanceRaw, votingPowerRaw } =
        useGovernanceToken();
    const { delegateVotingPower, isDelegating } = useVoteWithDelegation();

    const needsDelegation =
        Boolean(balanceRaw) &&
        (balanceRaw as bigint) > 0n &&
        (!votingPowerRaw || (votingPowerRaw as bigint) === 0n);

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                {/* Voting Power */}
                <div className="bg-zinc-900 rounded-2xl p-6 relative">
                    <div className="text-emerald-400 text-3xl font-semibold">
                        {String(votingPower ?? "0")}
                    </div>
                    <div className="text-sm text-zinc-400 mt-1">
                        Your Voting Power
                    </div>
                </div>

                {/* Quorum */}
                <div className="bg-zinc-900 rounded-2xl p-6">
                    <div className="text-3xl font-semibold">
                        {String(quorum ?? "0")}%
                    </div>
                    <div className="text-sm text-zinc-400 mt-1">
                        Quorum Required
                    </div>
                </div>

                {/* Total Supply */}
                <div className="bg-zinc-900 rounded-2xl p-6">
                    <div className="text-3xl font-semibold">
                        {String(totalSupply ?? "0")}
                    </div>
                    <div className="text-sm text-zinc-400 mt-1">
                        Total FYDAO Tokens
                    </div>
                </div>
            </div>

            {/* Delegation Alert */}
            {needsDelegation && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="text-sm text-emerald-400 pr-4">
                        You have tokens but haven&apos;t activated your voting
                        power. Delegate to yourself to start voting.
                    </div>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => delegateVotingPower?.()}
                        disabled={isDelegating}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white border-none whitespace-nowrap"
                    >
                        {isDelegating
                            ? "Delegating..."
                            : "Activate Voting Power"}
                    </Button>
                </div>
            )}
        </div>
    );
}
