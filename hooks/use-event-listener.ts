"use client";

import { useEffect } from "react";
import { useWatchContractEvent, useConnection } from "wagmi";
import { ABIS, CONTRACT_ADDRESSES } from "@/contracts/config";

export function useEventListener() {
    const { address } = useConnection();

    // Campaign Created
    useWatchContractEvent({
        address: CONTRACT_ADDRESSES.CampaignFactory as `0x${string}`,
        abi: ABIS.CampaignFactory,
        eventName: "CampaignCreated",
        onLogs: async (logs) => {
            for (const log of logs) {
                await fetch("/api/events/sync", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ eventName: "CampaignCreated", log }),
                });
            }
        },
    });

    // Proposal Created
    useWatchContractEvent({
        address: CONTRACT_ADDRESSES.DAOGovernor as `0x${string}`,
        abi: ABIS.DAOGovernor,
        eventName: "ProposalCreated",
        onLogs: async (logs) => {
            for (const log of logs) {
                await fetch("/api/events/sync", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ eventName: "ProposalCreated", log }),
                });
            }
        },
    });

    useEffect(() => {
        if (address) {
            console.log("✅ Real-time event listeners active for:", address);
        }
    }, [address]);

    return null;
}
