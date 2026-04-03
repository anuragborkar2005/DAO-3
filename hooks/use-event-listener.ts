"use client";

import { useEffect } from "react";
import { useWatchContractEvent, useAccount } from "wagmi";
import { ABIS, CONTRACT_ADDRESSES } from "@/contracts/config";

// Helper to safely convert BigInt to string before sending to API
// eslint-disable-next-line
function safeSerializeLog(log: any) {
    return JSON.parse(
        JSON.stringify(log, (key, value) =>
            typeof value === "bigint" ? value.toString() : value,
        ),
    );
}

export function useEventListener() {
    const { address } = useAccount();

    // Campaign Created Event
    useWatchContractEvent({
        address: CONTRACT_ADDRESSES.CampaignFactory as `0x${string}`,
        abi: ABIS.CampaignFactory,
        eventName: "CampaignCreated",
        onLogs: async (logs) => {
            for (const log of logs) {
                try {
                    const safeLog = safeSerializeLog(log);

                    await fetch("/api/events/sync", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            eventName: "CampaignCreated",
                            log: safeLog,
                        }),
                    });
                } catch (err) {
                    console.error("Failed to sync CampaignCreated event:", err);
                }
            }
        },
    });

    // Proposal Created Event
    useWatchContractEvent({
        address: CONTRACT_ADDRESSES.DAOGovernor as `0x${string}`,
        abi: ABIS.DAOGovernor,
        eventName: "ProposalCreated",
        onLogs: async (logs) => {
            for (const log of logs) {
                try {
                    const safeLog = safeSerializeLog(log);

                    await fetch("/api/events/sync", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            eventName: "ProposalCreated",
                            log: safeLog,
                        }),
                    });
                } catch (err) {
                    console.error("Failed to sync ProposalCreated event:", err);
                }
            }
        },
    });

    // Optional: Add VoteCast event
    useWatchContractEvent({
        address: CONTRACT_ADDRESSES.DAOGovernor as `0x${string}`,
        abi: ABIS.DAOGovernor,
        eventName: "VoteCast",
        onLogs: async (logs) => {
            for (const log of logs) {
                try {
                    const safeLog = safeSerializeLog(log);
                    await fetch("/api/events/sync", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            eventName: "VoteCast",
                            log: safeLog,
                        }),
                    });
                } catch (err) {
                    console.error("Failed to sync VoteCast event:", err);
                }
            }
        },
    });

    useEffect(() => {
        if (address) {
            console.log(
                "✅ Real-time event listeners are now active for wallet:",
                address,
            );
        }
    }, [address]);

    return null;
}
