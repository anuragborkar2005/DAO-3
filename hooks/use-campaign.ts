"use client";

import { getIpfsUrl } from "@/utils/ipfs";
import { useQuery } from "@tanstack/react-query";

export function useCampaign(campaignAddress: string) {
    return useQuery({
        queryKey: ["campaign", campaignAddress],
        queryFn: async () => {
            const res = await fetch(`/api/campaigns/${campaignAddress}/status`);
            if (!res.ok) throw new Error("Failed to fetch campaign");
            const data = await res.json();
            const campaign = data.data;

            if (!campaign) return null;
            if (campaign.metadataCid) {
                try {
                    const metadataUrl = getIpfsUrl(campaign.metadataCid);
                    const metadataRes = await fetch(metadataUrl);
                    const metadata = await metadataRes.json();

                    campaign.metadata = metadata;
                } catch (err) {
                    console.warn("Failed to fetch metadata from IPFS:", err);
                    campaign.metadata = {
                        title: "Untitled Campaign",
                        description: "Metadata unavailable",
                        targetAmount: "0",
                        category: "Unkwon",
                    };
                }
            }

            return campaign;
        },
        refetchInterval: 15000, // Refresh every 15 seconds
        enabled: !!campaignAddress,
    });
}
