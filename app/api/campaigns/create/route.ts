import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Campaign from "@/models/campaign";

export async function POST(request: NextRequest) {
    try {
        const {
            onChainAddress,
            creator,
            metadataCid,
            targetAmount = "0",
            factoryTxHash,
        } = await request.json();

        if (!onChainAddress || !creator || !metadataCid) {
            return NextResponse.json(
                {
                    error: "Missing required fields: onChainAddress, creator, metadataCid",
                },
                { status: 400 },
            );
        }

        await connectToDatabase();

        const campaign = await Campaign.findOneAndUpdate(
            { onChainAddress: onChainAddress.toLowerCase() },
            {
                onChainAddress: onChainAddress.toLowerCase(),
                creator: creator.toLowerCase(),
                metadataCid,
                targetAmount,
                factoryTxHash,
                status: "created",
                isLive: false,
                raisedAmount: "0",
                $setOnInsert: { createdAt: new Date() },
            },
            {
                upsert: true,
                new: true,
            },
        );

        return NextResponse.json({
            success: true,
            campaign,
            message: "Campaign saved/updated successfully",
        });
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error("MongoDB create campaign error:", error);
        return NextResponse.json(
            {
                error: err.message,
            },
            { status: 500 },
        );
    }
}
