"use client";

import { useReadContract, useConnection } from "wagmi";
import { sepolia } from "viem/chains";
import { ABIS, CONTRACT_ADDRESSES } from "@/contracts/config";

export function useGovernanceToken() {
    const { address } = useConnection();

    // Total Supply
    const { data: totalSupplyRaw } = useReadContract({
        address: CONTRACT_ADDRESSES.GovernanceToken as `0x${string}`,
        abi: ABIS.GovernanceToken,
        functionName: "totalSupply",
    });

    // User's Voting Power (getVotes)
    const { data: votingPowerRaw } = useReadContract({
        address: CONTRACT_ADDRESSES.GovernanceToken as `0x${string}`,
        abi: ABIS.GovernanceToken,
        functionName: "getVotes",
        args: address ? [address] : undefined,
    });

    // Quorum (from Governor contract)
    const { data: quorumRaw } = useReadContract({
        address: CONTRACT_ADDRESSES.DAOGovernor as `0x${string}`,
        abi: ABIS.DAOGovernor || [], // Add Governor ABI if needed
        functionName: "quorum",
        args: [BigInt(Math.floor(Date.now() / 1000))], // Current timestamp
    });

    const totalSupply = totalSupplyRaw
        ? (Number(totalSupplyRaw) / 1e18).toLocaleString()
        : "0";

    const votingPower = votingPowerRaw
        ? (Number(votingPowerRaw) / 1e18).toLocaleString()
        : "0";

    const quorum = quorumRaw
        ? Math.round((Number(quorumRaw) / Number(totalSupplyRaw || 1)) * 100)
        : 4; // fallback to 4% as per your contract

    return {
        totalSupply,
        votingPower,
        quorum,
        // Raw values for advanced usage
        totalSupplyRaw,
        votingPowerRaw,
        isLoading: !totalSupplyRaw && address, // Show loading only when connected
    };
}
