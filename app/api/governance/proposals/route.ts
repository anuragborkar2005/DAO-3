import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Proposal from "@/models/proposal";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { ABIS, CONTRACT_ADDRESSES } from "@/contracts/config";

const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
});

const PROPOSAL_STATES = [
    "pending",
    "active",
    "canceled",
    "defeated",
    "succeeded",
    "queued",
    "expired",
    "executed",
];

export async function GET() {
    try {
        await connectToDatabase();

        const proposals = await Proposal.find({})
            .sort({ createdAt: -1 })
            .limit(30);

        if (proposals.length === 0) {
            return NextResponse.json({ success: true, proposals: [] });
        }

        // Fetch real-time statuses and votes from blockchain
        const statusCalls = proposals.map((p) => ({
            address: CONTRACT_ADDRESSES.DAOGovernor as `0x${string}`,
            abi: ABIS.DAOGovernor,
            functionName: "state",
            args: [BigInt(p.proposalId)],
        }));

        const voteCalls = proposals.map((p) => ({
            address: CONTRACT_ADDRESSES.DAOGovernor as `0x${string}`,
            abi: ABIS.DAOGovernor,
            functionName: "proposalVotes",
            args: [BigInt(p.proposalId)],
        }));

        const [statusResults, voteResults] = await Promise.all([
            publicClient.multicall({ contracts: statusCalls }),
            publicClient.multicall({ contracts: voteCalls }),
        ]);

        // Enrich with real-time status and votes
        const enriched = proposals.map((p, index) => {
            const statusResult = statusResults[index];
            const voteResult = voteResults[index];

            let blockchainStatus = p.status;
            let votes = {
                for: p.votes?.for || "0",
                against: p.votes?.against || "0",
                abstain: p.votes?.abstain || "0",
            };

            if (statusResult.status === "success") {
                blockchainStatus =
                    PROPOSAL_STATES[statusResult.result as number] || p.status;
            }

            if (voteResult.status === "success") {
                const [against, forVotes, abstain] = voteResult.result as [
                    bigint,
                    bigint,
                    bigint,
                ];
                votes = {
                    against: against.toString(),
                    for: forVotes.toString(),
                    abstain: abstain.toString(),
                };
            }

            return {
                ...p.toObject(),
                status: blockchainStatus.toLowerCase(),
                votes,
                votesFor: votes.for,
                votesAgainst: votes.against,
                votesAbstain: votes.abstain,
                isCampaignApproval:
                    p.isCampaignApproval ||
                    p.description.toLowerCase().includes("approve"),
            };
        });

        return NextResponse.json({
            success: true,
            proposals: enriched,
        });
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error("Fetch proposals error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
