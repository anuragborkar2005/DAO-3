"use client";

import {
    useWriteContract,
    useWaitForTransactionReceipt,
    useConnection,
} from "wagmi";
import { parseUnits } from "viem";
import { sepolia } from "viem/chains";
import { ABIS } from "@/contracts/config";

export function useDonate(campaignAddress: `0x${string}`) {
    const { address } = useConnection();

    const {
        writeContract,
        data: hash,
        isPending: isWriting,
    } = useWriteContract();
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

    const donate = async (amount: string) => {
        if (!address) throw new Error("Wallet not connected");

        writeContract({
            address: campaignAddress,
            abi: ABIS.Campaign,
            functionName: "donate",
            args: [parseUnits(amount, 18)],
            chainId: sepolia.id,
        });
    };

    return {
        donate,
        isPending: isWriting || isConfirming,
        txHash: hash,
    };
}
