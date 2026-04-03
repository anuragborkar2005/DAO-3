"use client";

import { useQuery } from "@tanstack/react-query";

export function useProposals() {
    return useQuery({
        queryKey: ["governance-proposals"],
        queryFn: async () => {
            // In production: Combine on-chain governor.state() + MongoDB enriched data
            const res = await fetch("/api/governance/proposals");
            const data = await res.json();
            return data.proposals || [];
        },
        refetchInterval: 30000, // Poll every 30s
    });
}
