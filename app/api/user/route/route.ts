import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Campaign from "@/models/campaign";

export async function GET(request: NextRequest) {
    try {
        const address = request.nextUrl.searchParams.get("address");

        if (!address) {
            return NextResponse.json(
                { error: "Address required" },
                { status: 400 },
            );
        }

        await connectToDatabase();

        const campaignCount = await Campaign.countDocuments({
            creator: address.toLowerCase(),
        });

        return NextResponse.json({
            success: true,
            isCreator: campaignCount > 0,
            campaignCount,
        });
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
