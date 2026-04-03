"use client";

import {
    useWriteContract,
    useWaitForTransactionReceipt,
    useConnection,
} from "wagmi";
import { encodeFunctionData } from "viem";
import { sepolia } from "viem/chains";
import { ABIS, CONTRACT_ADDRESSES } from "@/contracts/config";
import { useState } from "react";

export function useApproveCampaign(campaignAddress: `0x${string}`) {
    const { address } = useConnection();
    const [isSaving, setIsSaving] = useState(false);

    const {
        writeContract,
        data: hash,
        isPending: isWriting,
    } = useWriteContract();
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

    const proposeApproval = async (description?: string) => {
        if (!address) throw new Error("Wallet not connected");

        setIsSaving(true);

        try {
            // 1. Encode calldata for approveAndGoLive()
            const approveCalldata = encodeFunctionData({
                abi: ABIS.Campaign,
                functionName: "approveAndGoLive",
                args: [],
            });

            // 2. Create proposal on Governor
            writeContract({
                address: CONTRACT_ADDRESSES.DAOGovernor as `0x${string}`,
                abi: ABIS.DAOGovernor,
                functionName: "propose",
                args: [
                    [campaignAddress],
                    [0n],
                    [approveCalldata],
                    description ||
                        `Approve Campaign ${campaignAddress.slice(0, 10)}...`,
                ],
            });
        } catch (error) {
            console.error("Failed to propose approval:", error);
            throw error;
        } finally {
            setIsSaving(false);
        }
    };

    return {
        proposeApproval,
        isPending: isWriting || isConfirming || isSaving,
        txHash: hash,
    };
}
