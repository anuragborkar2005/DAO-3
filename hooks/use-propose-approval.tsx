"use client";

import { useWriteContract, useAccount } from "wagmi";
import { encodeFunctionData } from "viem";
import { ABIS, CONTRACT_ADDRESSES } from "@/contracts/config";
import { sepolia } from "viem/chains";
import { useState } from "react";

export function useProposeApproval(campaignAddress: `0x${string}`) {
    const { address } = useAccount();
    const [isPending, setIsPending] = useState(false);

    const { writeContract } = useWriteContract();

    const proposeApproval = async () => {
        if (!address) {
            alert("Please connect your wallet");
            return;
        }

        setIsPending(true);

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

            // TODO: After tx success → update MongoDB with approvalProposalId
            // Use watchContractEvent or API route to sync proposalId

            alert("Approval proposal submitted to DAO Governor!");
        } catch (error) {
            const err =
                error instanceof Error ? error : new Error(String(error));
            console.error("Failed to propose approval:", err);
            alert("Error creating proposal: " + err.message);
        } finally {
            setIsPending(false);
        }
    };

    return { proposeApproval, isPending };
}
