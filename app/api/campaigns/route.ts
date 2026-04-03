import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Campaign from "@/models/campaign";

export async function GET() {
    try {
        await connectToDatabase();

        const campaigns = await Campaign.find({})
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json({
            success: true,
            campaigns,
        });
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
