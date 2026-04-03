"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVote } from "@/hooks/use-vote";

export default function ProposalDetailPage() {
    const { proposalId } = useParams() as { proposalId: string };
    const { vote, isPending } = useVote();

    // In real app, fetch proposal details from API or contract
    const proposal = {
        proposalId,
        description: "Approve Campaign for Community School Construction",
        status: "active",
    };

    const handleVote = (support: 0 | 1 | 2) => {
        vote(proposalId, support);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Card className="glass">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Proposal #{proposalId.slice(0, 8)}...
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div>
                        <h3 className="font-semibold mb-3">Description</h3>
                        <p className="text-zinc-300 leading-relaxed">
                            {proposal.description}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            onClick={() => handleVote(1)}
                            disabled={isPending}
                            className="flex-1 bg-emerald-600"
                        >
                            Vote For
                        </Button>
                        <Button
                            onClick={() => handleVote(0)}
                            disabled={isPending}
                            variant="destructive"
                            className="flex-1"
                        >
                            Vote Against
                        </Button>
                        <Button
                            onClick={() => handleVote(2)}
                            disabled={isPending}
                            variant="outline"
                            className="flex-1"
                        >
                            Abstain
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
