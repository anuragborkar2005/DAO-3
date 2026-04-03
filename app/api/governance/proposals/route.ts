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

        // Fetch real-time statuses from blockchain
        const statusCalls = proposals.map((p) => ({
            address: CONTRACT_ADDRESSES.DAOGovernor as `0x${string}`,
            abi: ABIS.DAOGovernor,
            functionName: "state",
            args: [BigInt(p.proposalId)],
        }));

        const results = await publicClient.multicall({
            contracts: statusCalls,
        });

        // Enrich with real-time status and type
        const enriched = proposals.map((p, index) => {
            const result = results[index];
            let blockchainStatus = p.status;

            if (result.status === "success") {
                blockchainStatus =
                    PROPOSAL_STATES[result.result as number] || p.status;
            }

            return {
                ...p.toObject(),
                status: blockchainStatus.toLowerCase(),
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
