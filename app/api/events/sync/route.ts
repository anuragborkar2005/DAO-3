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
                    (calldatas &&
                        Array.isArray(calldatas) &&
                        calldatas.some((c: string) =>
                            c?.startsWith("0x3a4741bd"),
                        )) ||
                    (description &&
                        description.toLowerCase().includes("approve"));

                const isMilestoneRelease =
                    calldatas &&
                    Array.isArray(calldatas) &&
                    calldatas.some((c: string) => c?.startsWith("0x317debf5"));

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
                        isMilestoneRelease,
                        campaignAddress: targets?.[0]
                            ? targets[0].toLowerCase()
                            : undefined,
                        status: "pending",
                        votesFor: 0,
                        votesAgainst: 0,
                        createdAt: new Date(),
                    },
                    { upsert: true, new: true },
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

                const voteWeight = weight ? Number(weight) : 0;

                // For development: Fetch the document first to ensure fields are numbers
                const prop = await Proposal.findOne({
                    proposalId: proposalIdStr,
                });

                if (prop) {
                    const vf = Number(prop.votesFor || 0);
                    const va = Number(prop.votesAgainst || 0);

                    await Proposal.findOneAndUpdate(
                        { proposalId: proposalIdStr },
                        {
                            $set: {
                                votesFor:
                                    support === 1n || support === 1
                                        ? vf + voteWeight
                                        : vf,
                                votesAgainst:
                                    support === 0n || support === 0
                                        ? va + voteWeight
                                        : va,
                            },
                        },
                    );
                }
                break;
            }

            case "CampaignLive": {
                // The log address will be the campaign address
                const campaignAddr = log.address;
                if (!campaignAddr) break;

                await Campaign.findOneAndUpdate(
                    { onChainAddress: campaignAddr.toLowerCase() },
                    {
                        status: "live",
                        isLive: true,
                        approvedAt: new Date(),
                    },
                );
                break;
            }

            case "MilestoneReleased": {
                const { id, amount } = log.args || {};
                const escrowAddr = log.address;

                if (id === undefined || !escrowAddr) break;

                // Find the campaign that owns this escrow
                // We might need to store escrowAddress in Campaign model
                const campaign = await Campaign.findOne({
                    escrowAddress: escrowAddr.toLowerCase(),
                });

                await Milestone.findOneAndUpdate(
                    {
                        campaignAddress: campaign
                            ? campaign.onChainAddress.toLowerCase()
                            : undefined,
                        milestoneId: Number(id),
                    },
                    {
                        status: "released",
                        releasedAt: new Date(),
                        actualAmount: amount?.toString(),
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
