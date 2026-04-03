"use client";

import { useWriteContract, useAccount } from "wagmi";
import { sepolia } from "viem/chains";
import { ABIS, CONTRACT_ADDRESSES } from "@/contracts/config";
import { useUserRole } from "./use-user-role";

export function useAdminActions() {
    const { address } = useAccount();
    const { isAdmin } = useUserRole();

    const { writeContract, isPending } = useWriteContract();

    const makeDaoMember = async (
        targetAddress: `0x${string}`,
        amount: string,
    ) => {
        if (!isAdmin) throw new Error("Only admin can perform this action");
        if (!address) throw new Error("Wallet not connected");

        // Mint tokens to target address (assuming your GovernanceToken has mint function)
        writeContract({
            address: CONTRACT_ADDRESSES.GovernanceToken as `0x${string}`,
            abi: ABIS.GovernanceToken,
            functionName: "mint",
            args: [targetAddress, BigInt(amount) * BigInt(10 ** 6)],
            chainId: sepolia.id,
        });

        await fetch("/api/admin/make-dao-member", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-wallet-address": address,
            },
            body: JSON.stringify({ targetAddress, amount }),
        });
    };

    return {
        makeDaoMember,
        isPending,
        isAdmin,
    };
}
