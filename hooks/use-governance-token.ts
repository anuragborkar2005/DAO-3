"use client";

import { useReadContract, useAccount, useBlockNumber } from "wagmi";
import { ABIS, CONTRACT_ADDRESSES } from "@/contracts/config";

export function useGovernanceToken() {
    const { address } = useAccount();
    const { data: blockNumber } = useBlockNumber();

    // Total Supply
    const { data: totalSupplyRaw } = useReadContract({
        address: CONTRACT_ADDRESSES.GovernanceToken as `0x${string}`,
        abi: ABIS.GovernanceToken,
        functionName: "totalSupply",
    });

    // User's Balance
    const { data: balanceRaw } = useReadContract({
        address: CONTRACT_ADDRESSES.GovernanceToken as `0x${string}`,
        abi: ABIS.GovernanceToken,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
    });

    // User's Voting Power (getVotes)
    const { data: votingPowerRaw } = useReadContract({
        address: CONTRACT_ADDRESSES.GovernanceToken as `0x${string}`,
        abi: ABIS.GovernanceToken,
        functionName: "getVotes",
        args: address ? [address] : undefined,
    });

    // User's Delegate
    const { data: delegatesRaw } = useReadContract({
        address: CONTRACT_ADDRESSES.GovernanceToken as `0x${string}`,
        abi: ABIS.GovernanceToken,
        functionName: "delegates",
        args: address ? [address] : undefined,
    });

    // Quorum (from Governor contract)
    const { data: quorumRaw } = useReadContract({
        address: CONTRACT_ADDRESSES.DAOGovernor as `0x${string}`,
        abi: ABIS.DAOGovernor || [], // Add Governor ABI if needed
        functionName: "quorum",
        args: blockNumber ? [blockNumber - 1n] : undefined, // Past block number
    });

    const totalSupply = totalSupplyRaw
        ? (Number(totalSupplyRaw) / 1e6).toLocaleString()
        : "0";

    const balance = balanceRaw
        ? (Number(balanceRaw) / 1e6).toLocaleString()
        : "0";

    const votingPower = votingPowerRaw
        ? (Number(votingPowerRaw) / 1e6).toLocaleString()
        : "0";

    const quorum = quorumRaw
        ? Math.round((Number(quorumRaw) / Number(totalSupplyRaw || 1)) * 100)
        : 4; // fallback to 4% as per your contract

    return {
        totalSupply,
        balance,
        votingPower,
        delegates: delegatesRaw as string | undefined,
        quorum,
        totalSupplyRaw,
        balanceRaw,
        votingPowerRaw,
        isLoading: !totalSupplyRaw && address,
    };
}
