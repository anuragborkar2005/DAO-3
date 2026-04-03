"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { keccak256, toHex } from "viem";
import { ABIS, CONTRACT_ADDRESSES } from "@/contracts/config";

export function useExecute() {
    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

    const execute = async (
        targets: string[],
        values: string[],
        calldatas: string[],
        description: string
    ) => {
        const descriptionHash = keccak256(toHex(description));

        writeContract({
            address: CONTRACT_ADDRESSES.DAOGovernor as `0x${string}`,
            abi: ABIS.DAOGovernor,
            functionName: "execute",
            args: [
                targets,
                values.map((v) => BigInt(v)),
                calldatas,
                descriptionHash,
            ],
        });
    };

    return { execute, isPending: isPending || isConfirming };
}
