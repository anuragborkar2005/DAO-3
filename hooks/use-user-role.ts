"use client";

import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { useGovernanceToken } from "./use-governance-token";

const ADMIN_ADDRESSES = [
    "0x3dEc9ada98b5f15779b29034311a29F7a893a590".toLowerCase(),
];

export function useUserRole() {
    const { address } = useAccount();
    const { votingPower } = useGovernanceToken();

    const { data: delegationData } = useQuery({
        queryKey: ["delegation-status", address],
        queryFn: async () => {
            if (!address) return { hasDelegated: false };
            const res = await fetch(`/api/user/delegation?address=${address}`);
            return res.json();
        },
        enabled: !!address,
    });

    const vp = parseFloat(votingPower || "0");
    const hasVotingPower = vp > 0;
    const hasDelegated = delegationData?.hasDelegated || false;

    const roles: string[] = ["donor"];

    if (hasVotingPower) {
        roles.push("dao_member_potential");
    }

    if (hasVotingPower && hasDelegated) {
        roles.push("dao_member");
    }

    if (ADMIN_ADDRESSES.includes(address?.toLowerCase() || "")) {
        roles.push("admin");
    }

    const isCreator = false;

    const canVote = hasVotingPower && hasDelegated;

    const hasRole = (role: string) => roles.includes(role);

    return {
        roles,
        hasRole,
        canVote,
        isAdmin: hasRole("admin"),
        isDaoMember: hasRole("dao_member"),
        isCreator,
        hasVotingPower,
        hasDelegated,
        address,
        votingPower,
    };
}
