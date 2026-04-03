"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { sepolia } from "viem/chains";
import { ABIS, CONTRACT_ADDRESSES } from "@/contracts/config";

export function useVote() {
    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

    const vote = async (proposalId: string, support: 0 | 1 | 2) => {
        writeContract({
            address: CONTRACT_ADDRESSES.DAOGovernor as `0x${string}`,
            abi: ABIS.DAOGovernor,
            functionName: "castVote",
            args: [BigInt(proposalId), support],
        });
    };

    return { vote, isPending: isPending || isConfirming };
}
