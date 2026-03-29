// app/api/campaigns/[address]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Campaign from "@/models/campaign";

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } },
) {
  await connectToDatabase();
  const campaign = await Campaign.findOne({ onChainAddress: params.address });

  // TODO: Add on-chain read using wagmi/viem in future phase
  return NextResponse.json({ success: true, data: campaign });
}
