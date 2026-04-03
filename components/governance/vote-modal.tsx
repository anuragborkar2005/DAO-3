"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, ArrowRight } from "lucide-react";
import { useVoteWithDelegation } from "@/hooks/use-vote-with-delegation";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    proposalId: string;
    description: string;
    onVoteSuccess: () => void;
}

export default function VoteModal({
    isOpen,
    onClose,
    proposalId,
    description,
    onVoteSuccess,
}: Props) {
    const [support, setSupport] = useState<0 | 1 | 2>(1);
    const { castVote, delegateVotingPower, isVoting, canVote, isDelegating, isVoteSuccess } =
        useVoteWithDelegation();

    useEffect(() => {
        if (isVoteSuccess) {
            onVoteSuccess();
            onClose();
        }
    }, [isVoteSuccess, onVoteSuccess, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-zinc-900 rounded-3xl w-full max-w-md p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-zinc-400 hover:text-white"
                >
                    <X size={24} />
                </button>

                <h3 className="text-2xl font-semibold mb-6">Cast Your Vote</h3>
                <p className="text-zinc-400 mb-8 line-clamp-3">{description}</p>

                {!canVote && (
                    <Alert className="mb-8 border-amber-500 bg-amber-950">
                        <AlertDescription className="text-amber-300">
                            You must delegate your voting power before you can
                            cast votes.
                            <Button
                                variant="link"
                                onClick={() => delegateVotingPower()}
                                disabled={isDelegating}
                                className="text-amber-400 underline mt-3 block"
                            >
                                {isDelegating
                                    ? "Delegating..."
                                    : "Delegate My Voting Power Now →"}
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="space-y-3 mb-8">
                    <button
                        onClick={() => setSupport(1)}
                        disabled={!canVote}
                        className={`w-full p-4 rounded-2xl border-2 transition-all ${support === 1 ? "border-emerald-500 bg-emerald-950" : "border-zinc-700 hover:border-zinc-600"}`}
                    >
                        ✅ For
                    </button>
                    <button
                        onClick={() => setSupport(0)}
                        disabled={!canVote}
                        className={`w-full p-4 rounded-2xl border-2 transition-all ${support === 0 ? "border-red-500 bg-red-950" : "border-zinc-700 hover:border-zinc-600"}`}
                    >
                        ❌ Against
                    </button>
                </div>

                <Button
                    onClick={() => castVote(proposalId, support)}
                    disabled={isVoting || !canVote}
                    className="w-full py-6 text-lg font-semibold"
                >
                    {isVoting ? "Casting Vote on-chain..." : "Confirm Vote"}
                </Button>

                <p className="text-center text-xs text-zinc-500 mt-6">
                    You are a DAO Member only after delegating your tokens
                </p>
            </div>
        </div>
    );
}
