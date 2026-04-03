"use client";

import { useState } from "react";
import { useVote } from "@/hooks/use-vote";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
    const [support, setSupport] = useState<0 | 1 | 2>(1); // 0=Against, 1=For, 2=Abstain
    const { vote, isPending } = useVote();

    const handleVote = async () => {
        await vote(proposalId, support);
        onVoteSuccess();
        onClose();
    };

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

                <div className="space-y-3 mb-8">
                    <button
                        onClick={() => setSupport(1)}
                        className={`w-full p-4 rounded-2xl border-2 transition ${support === 1 ? "border-emerald-500 bg-emerald-950" : "border-zinc-700 hover:border-zinc-600"}`}
                    >
                        ✅ For
                    </button>
                    <button
                        onClick={() => setSupport(0)}
                        className={`w-full p-4 rounded-2xl border-2 transition ${support === 0 ? "border-red-500 bg-red-950" : "border-zinc-700 hover:border-zinc-600"}`}
                    >
                        ❌ Against
                    </button>
                    <button
                        onClick={() => setSupport(2)}
                        className={`w-full p-4 rounded-2xl border-2 transition ${support === 2 ? "border-zinc-500 bg-zinc-800" : "border-zinc-700 hover:border-zinc-600"}`}
                    >
                        ⚪ Abstain
                    </button>
                </div>

                <Button
                    onClick={handleVote}
                    disabled={isPending}
                    className="w-full py-6 text-lg bg-white text-black hover:bg-zinc-200"
                >
                    {isPending ? "Voting on-chain..." : "Confirm Vote"}
                </Button>

                <p className="text-center text-xs text-zinc-500 mt-6">
                    Gas fees apply • Votes are final and recorded on Ethereum
                </p>
            </div>
        </div>
    );
}
