import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Campaign from "@/models/campaign";
import Milestone from "@/models/milestone";

export async function GET(request: NextRequest) {
    try {
        const address =
            request.headers.get("x-wallet-address") ||
            request.nextUrl.searchParams.get("address");

        if (!address) {
            return NextResponse.json(
                { error: "Wallet address required" },
                { status: 401 },
            );
        }

        await connectToDatabase();

        const myCampaigns = await Campaign.find({
            creator: address.toLowerCase(),
        }).sort({ createdAt: -1 });

        // Enrich with milestones
        const enriched = await Promise.all(
            myCampaigns.map(async (c) => {
                const milestones = await Milestone.find({
                    campaignAddress: c.onChainAddress.toLowerCase(),
                }).sort({ milestoneId: 1 });
                return {
                    ...c.toObject(),
                    milestones,
                };
            }),
        );

        return NextResponse.json({
            success: true,
            campaigns: enriched,
        });
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
