"use client";

import { useQuery } from "@tanstack/react-query";

export function useCampaign(campaignAddress: string) {
    return useQuery({
        queryKey: ["campaign", campaignAddress],
        queryFn: async () => {
            const res = await fetch(`/api/campaigns/${campaignAddress}/status`);
            if (!res.ok) throw new Error("Failed to fetch campaign");
            const data = await res.json();
            return data.data;
        },
        refetchInterval: 15000, // Refresh every 15 seconds
        enabled: !!campaignAddress,
    });
}
