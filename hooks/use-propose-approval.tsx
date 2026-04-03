"use client";

import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { encodeFunctionData, decodeEventLog } from "viem";
import { ABIS, CONTRACT_ADDRESSES } from "@/contracts/config";
import { sepolia } from "viem/chains";
import { useState, useEffect } from "react";

export function useProposeApproval(campaignAddress: `0x${string}`) {
    const { address } = useAccount();
    const [isSyncing, setIsSyncing] = useState(false);

    const { writeContract, data: hash, isPending: isWriting, isSuccess } = useWriteContract();

    const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
        hash,
    });

    const proposeApproval = async () => {
        if (!address) {
            alert("Please connect your wallet");
            return;
        }

        try {
            // 1. Encode calldata for campaign.approveAndGoLive()
            const approveCalldata = encodeFunctionData({
                abi: ABIS.Campaign,
                functionName: "approveAndGoLive",
                args: [],
            });

            // 2. Create Governor proposal
            writeContract({
                address: CONTRACT_ADDRESSES.DAOGovernor as `0x${string}`,
                abi: ABIS.DAOGovernor,
                functionName: "propose",
                args: [
                    [campaignAddress], // targets
                    [0n], // values (0 ETH)
                    [approveCalldata], // calldatas
                    `Approve Campaign: ${campaignAddress.slice(0, 8)}...`, // description
                ],
                chainId: sepolia.id,
            });

        } catch (error) {
            const err =
                error instanceof Error ? error : new Error(String(error));
            console.error("Failed to propose approval:", err);
            alert("Error creating proposal: " + err.message);
        }
    };

    useEffect(() => {
        if (isSuccess && receipt) {
            const syncProposal = async () => {
                setIsSyncing(true);
                try {
                    let proposalId = "";
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
                            continue;
                        }
                    }

                    if (proposalId) {
                        await fetch("/api/campaigns/propose-approval", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                campaignAddress,
                                proposalId,
                            }),
                        });
                        alert("Proposal created and synced! Proposal ID: " + proposalId);
                    }
                } catch (err) {
                    console.error("Failed to sync proposal:", err);
                } finally {
                    setIsSyncing(false);
                }
            };
            syncProposal();
        }
    }, [isSuccess, receipt, campaignAddress]);

    return { proposeApproval, isPending: isWriting || isConfirming || isSyncing };
}
