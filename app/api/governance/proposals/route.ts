import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Proposal from "@/models/proposal";

export async function GET() {
    try {
        await connectToDatabase();

        const proposals = await Proposal.find({})
            .sort({ createdAt: -1 })
            .limit(30);

        // Enrich with type
        const enriched = proposals.map((p) => ({
            ...p.toObject(),
            isCampaignApproval:
                p.isCampaignApproval ||
                p.description.toLowerCase().includes("approve"),
        }));

        return NextResponse.json({
            success: true,
            proposals: enriched,
        });
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
