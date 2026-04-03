import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Campaign from "@/models/campaign";
import Proposal from "@/models/proposal";
import Milestone from "@/models/milestone";

export async function POST(request: NextRequest) {
    try {
        const { eventName, log } = await request.json();

        if (!log) {
            return NextResponse.json(
                { error: "No log data provided" },
                { status: 400 },
            );
        }

        await connectToDatabase();

        switch (eventName) {
            case "CampaignCreated": {
                const { campaign, creator, metadataURI } = log.args || {};

                if (!campaign) {
                    console.warn("CampaignCreated: missing campaign address");
                    break;
                }

                await Campaign.findOneAndUpdate(
                    { onChainAddress: campaign.toLowerCase() },
                    {
                        onChainAddress: campaign.toLowerCase(),
                        creator: creator?.toLowerCase(),
                        metadataCid: metadataURI,
                        status: "created",
                        isLive: false,
                        factoryTxHash: log.transactionHash, // Changed rawLog to log
                    },
                    { upsert: true, new: true },
                );
                break;
            }

            case "ProposalCreated": {
                const {
                    proposalId,
                    proposer,
                    targets,
                    values,
                    calldatas,
                    description,
                } = log.args || {};

                if (!proposalId) {
                    console.warn("ProposalCreated: missing proposalId");
                    break;
                }

                const proposalIdStr = proposalId.toString();

                const isCampaignApproval =
                    (targets &&
                        Array.isArray(targets) &&
                        targets.some((t: string) =>
                            t?.toLowerCase().includes("approveandgolive"),
                        )) ||
                    (description &&
                        description.toLowerCase().includes("approve"));

                await Proposal.findOneAndUpdate(
                    { proposalId: proposalIdStr },
                    {
                        proposalId: proposalIdStr,
                        description: description || "",
                        targets: targets || [],
                        values: values || [],
                        calldatas: calldatas || [],
                        proposer: proposer?.toLowerCase(),
                        isCampaignApproval,
                        campaignAddress:
                            isCampaignApproval && targets?.[0]
                                ? targets[0].toLowerCase()
                                : undefined,
                        status: "pending",
                    },
                    { upsert: true },
                );

                if (isCampaignApproval && targets?.[0]) {
                    await Campaign.findOneAndUpdate(
                        { onChainAddress: targets[0].toLowerCase() },
                        {
                            status: "pending_approval",
                            approvalProposalId: proposalIdStr,
                        },
                    );
                }
                break;
            }

            case "VoteCast": {
                const { proposalId, support, weight } = log.args || {};

                if (!proposalId) break;

                const proposalIdStr = proposalId.toString();

                const voteWeight = weight ? BigInt(weight) : 0n;

                await Proposal.findOneAndUpdate(
                    { proposalId: proposalIdStr },
                    {
                        $inc: {
                            votesFor:
                                support === 1n || support === 1
                                    ? voteWeight
                                    : 0n,
                            votesAgainst:
                                support === 0n || support === 0
                                    ? voteWeight
                                    : 0n,
                        },
                    },
                );
                break;
            }

            case "ProposalExecuted": {
                const proposalId = log.args?.proposalId;
                if (proposalId) {
                    await Proposal.findOneAndUpdate(
                        { proposalId: proposalId.toString() },
                        { status: "executed" },
                    );
                }
                break;
            }

            case "MilestoneProposed": {
                const { campaign, milestoneId, proofCid, amount } =
                    log.args || {};

                if (!campaign || milestoneId === undefined) break;

                await Milestone.findOneAndUpdate(
                    {
                        campaignAddress: campaign.toLowerCase(),
                        milestoneId: Number(milestoneId),
                    },
                    {
                        campaignAddress: campaign.toLowerCase(),
                        milestoneId: Number(milestoneId),
                        proofCid,
                        amount: amount?.toString(),
                        status: "proposed",
                    },
                    { upsert: true },
                );
                break;
            }

            default:
                console.log(`Unhandled event: ${eventName}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error("Event sync error:", err);
        return NextResponse.json(
            { error: err.message, details: err.stack?.split("\n")[0] },
            { status: 500 },
        );
    }
}
