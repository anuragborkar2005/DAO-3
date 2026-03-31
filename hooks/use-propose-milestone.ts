"use client";

import {
    useWriteContract,
    useWaitForTransactionReceipt,
    useConnection,
} from "wagmi";
import { sepolia } from "viem/chains";
import { ABIS } from "@/contracts/config";

export function useProposeMilestone(campaignAddress: `0x${string}`) {
    const { address } = useConnection();

    const {
        writeContract,
        data: hash,
        isPending: isWriting,
    } = useWriteContract();
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

    const proposeMilestone = async ({
        proofCid,
        amount,
    }: {
        proofCid: string;
        amount: string;
    }) => {
        if (!address) throw new Error("Wallet not connected");

        writeContract({
            address: campaignAddress,
            abi: ABIS.Campaign,
            functionName: "proposeMilestone",
            args: [proofCid, BigInt(amount)],
            chainId: sepolia.id,
        });
    };

    return {
        proposeMilestone,
        isPending: isWriting || isConfirming,
        txHash: hash,
    };
}
