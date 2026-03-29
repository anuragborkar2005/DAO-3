import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { proofCid, milestoneDescription } = await request.json();
    const gatewayUrl = `https://bronze-changing-silverfish-206.mypinata.cloud/ipfs/${proofCid.replace("ipfs://", "")}`;

    // TODO: Call AI (Grok/OpenAI) with prompt: "Analyze this proof for milestone completion..."
    // For now, mock response
    const aiResult = {
      verdict: "positive",
      confidence: 85,
      summary: "Proof appears legitimate and matches milestone description.",
      reportCid: "ipfs://QmMockAIReport...",
    };

    return NextResponse.json({ success: true, aiResult });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
