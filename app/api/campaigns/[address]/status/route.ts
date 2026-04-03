import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Campaign from "@/models/campaign";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ address: string }> },
) {
    try {
        await connectToDatabase();

        const { address } = await params;

        if (!address) {
            return NextResponse.json(
                { error: "Address missing" },
                { status: 400 },
            );
        }

        const campaign = await Campaign.findOne({
            onChainAddress: address.toLowerCase(),
        });

        if (!campaign) {
            return NextResponse.json(
                { error: "Campaign not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            data: campaign,
        });
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
