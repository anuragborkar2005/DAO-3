"use client";

import { useWriteContract, useAccount } from "wagmi";
import { sepolia } from "viem/chains";
import { useUserRole } from "./use-user-role";
import { ABIS, CONTRACT_ADDRESSES } from "@/contracts/config";

export function useVoteWithDelegation() {
    const { address } = useAccount();
    const { canVote } = useUserRole();

    const { writeContract: delegateWrite, isPending: isDelegating } =
        useWriteContract();
    const { writeContract: voteWrite, isPending: isVoting } =
        useWriteContract();

    const delegateVotingPower = async (toAddress?: `0x${string}`) => {
        const target = toAddress || address;

        delegateWrite({
            address: CONTRACT_ADDRESSES.GovernanceToken as `0x${string}`,
            abi: ABIS.GovernanceToken,
            functionName: "delegate",
            args: [target],
            chainId: sepolia.id,
        });
    };

    const castVote = async (proposalId: string, support: 0 | 1 | 2) => {
        if (!canVote) {
            throw new Error(
                "You must delegate your voting power before casting a vote",
            );
        }

        voteWrite({
            address: CONTRACT_ADDRESSES.DAOGovernor as `0x${string}`,
            abi: ABIS.DAOGovernor,
            functionName: "castVote",
            args: [BigInt(proposalId), support],
            chainId: sepolia.id,
        });
    };

    return {
        delegateVotingPower,
        castVote,
        isDelegating,
        isVoting,
        canVote,
    };
}
