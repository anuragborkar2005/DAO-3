import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Campaign from "@/models/campaign";

export async function GET(request: NextRequest) {
    try {
        const address = request.headers.get("x-wallet-address"); // Passed from middleware or client

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

        return NextResponse.json({
            success: true,
            campaigns: myCampaigns,
        });
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
