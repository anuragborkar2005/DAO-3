import { NextRequest, NextResponse } from "next/server";
import { uploadJsonToPinata } from "@/lib/pinata";

export async function POST(request: NextRequest) {
    try {
        const { proofCid, milestoneDescription } = await request.json();

        if (!proofCid) {
            return NextResponse.json(
                { error: "proofCid is required" },
                { status: 400 },
            );
        }

        const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${proofCid.replace("ipfs://", "")}`;

        // TODO: Replace with real Grok / OpenAI call
        // For now using mock response
        const aiResult = {
            verdict: "positive",
            confidence: 87,
            summary:
                "The uploaded proof documents and images appear legitimate and match the milestone requirements. Strong evidence of completion.",
            details:
                "Images show completed construction work. Documents are properly signed and dated.",
        };

        // Upload AI report back to Pinata
        const reportCid = await uploadJsonToPinata({
            ...aiResult,
            analyzedAt: new Date().toISOString(),
            proofCid,
        });

        return NextResponse.json({
            success: true,
            aiResult: {
                ...aiResult,
                reportCid: reportCid.cid,
            },
        });
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
