"use client";

import {
    useWriteContract,
    useWaitForTransactionReceipt,
    useAccount,
} from "wagmi";
import { ABIS, CONTRACT_ADDRESSES } from "@/contracts/config";
import { useState, useEffect } from "react";
import { encodeFunctionData, decodeEventLog } from "viem";

export function useProposeMilestone(campaignAddress: `0x${string}`) {
    const { address } = useAccount();
    const [isSyncing, setIsSyncing] = useState(false);
    const [currentStep, setCurrentStep] = useState<
        "idle" | "proposing-on-chain" | "creating-dao-proposal" | "syncing"
    >("idle");

    const {
        writeContract,
        data: hash,
        isPending: isWriting,
        isSuccess,
    } = useWriteContract();

    const { data: receipt, isLoading: isConfirming } =
        useWaitForTransactionReceipt({ hash });

    const [milestoneData, setMilestoneData] = useState<{
        proofCid: string;
        amount: string;
        aiResult?: any;
    } | null>(null);

    const proposeMilestone = async ({
        proofCid,
        amount,
        aiResult,
    }: {
        proofCid: string;
        amount: string;
        aiResult?: any;
    }) => {
        if (!address) throw new Error("Wallet not connected");

        setMilestoneData({ proofCid, amount, aiResult });
        setCurrentStep("proposing-on-chain");

        // Scale amount by 10^6 for USDC
        const scaledAmount = BigInt(Math.floor(parseFloat(amount) * 1_000_000));

        writeContract({
            address: campaignAddress,
            abi: ABIS.Campaign,
            functionName: "proposeMilestone",
            args: [proofCid, scaledAmount],
        });
    };

    // Effect to handle the transition from on-chain proposal to DAO proposal
    useEffect(() => {
        if (!isSuccess || !receipt || !milestoneData || currentStep !== "proposing-on-chain") return;

        const initiateDAOProposal = async () => {
            try {
                let milestoneId: bigint | null = null;

                // 1. Extract milestoneId from events
                for (const log of receipt.logs) {
                    try {
                        const decoded = decodeEventLog({
                            abi: ABIS.Campaign,
                            data: log.data,
                            topics: log.topics,
                        });

                        if (decoded.eventName === "MilestoneProposed") {
                            //eslint-disable-next-line
                            const args = decoded.args as any;
                            milestoneId = BigInt(args.id || args[0]);
                            break;
                        }
                    } catch (e) {
                        //eslint-disable-line
                        continue;
                    }
                }

                if (milestoneId === null) {
                    console.error("Could not find MilestoneProposed event");
                    return;
                }

                console.log("On-chain milestone proposed. ID:", milestoneId.toString());
                setCurrentStep("creating-dao-proposal");

                // 2. Encode calldata for Campaign.releaseMilestone(id)
                const releaseCalldata = encodeFunctionData({
                    abi: ABIS.Campaign,
                    functionName: "releaseMilestone",
                    args: [milestoneId],
                });

                // 3. Create DAO Proposal
                writeContract({
                    address: CONTRACT_ADDRESSES.DAOGovernor as `0x${string}`,
                    abi: ABIS.DAOGovernor,
                    functionName: "propose",
                    args: [
                        [campaignAddress],
                        [0n],
                        [releaseCalldata],
                        `Release Milestone ${milestoneId} for Campaign ${campaignAddress}: ${milestoneData.amount} USDC. Proof: ${milestoneData.proofCid}`,
                    ],
                });
            } catch (err) {
                console.error("Failed to initiate DAO proposal:", err);
            }
        };

        initiateDAOProposal();
    }, [isSuccess, receipt, milestoneData, campaignAddress, writeContract, currentStep]);

    // Effect to handle syncing to MongoDB after DAO proposal is created
    useEffect(() => {
        if (!isSuccess || !receipt || !milestoneData || currentStep !== "creating-dao-proposal") return;

        const syncToMongoDB = async () => {
            setIsSyncing(true);
            setCurrentStep("syncing");

            try {
                let proposalId = "";

                // Find ProposalCreated event (from Governor)
                for (const log of receipt.logs) {
                    try {
                        const decoded = decodeEventLog({
                            abi: ABIS.DAOGovernor,
                            data: log.data,
                            topics: log.topics,
                        });

                        if (decoded.eventName === "ProposalCreated") {
                            //eslint-disable-next-line
                            const args = decoded.args as any;
                            proposalId = (args.proposalId || args[0]).toString();
                            break;
                        }
                    } catch (e) {
                        //eslint-disable-line
                        continue;
                    }
                }

                // We also need to get the milestoneId again from the first tx if we don't have it
                // But we can probably just use a local state or fetch it from the API later if needed.
                // For now, let's assume we have it or can infer it.

                if (proposalId) {
                    await fetch("/api/campaigns/propose-milestone", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            campaignAddress,
                            proofCid: milestoneData.proofCid,
                            amount: milestoneData.amount,
                            proposalId,
                            aiResult: milestoneData.aiResult,
                        }),
                    });
                    console.log("Milestone proposal synced to MongoDB");
                }
            } catch (err) {
                console.error("Failed to sync milestone proposal:", err);
            } finally {
                setIsSyncing(false);
                setCurrentStep("idle");
                setMilestoneData(null);
            }
        };

        syncToMongoDB();
    }, [isSuccess, receipt, milestoneData, campaignAddress, currentStep]);

    return {
        proposeMilestone,
        isPending: isWriting || isConfirming || isSyncing,
        currentStep,
        txHash: hash,
    };
}
