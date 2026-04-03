"use client";

import { useParams } from "next/navigation";
import CampaignDetail from "@/components/campaign/campaign-detail";

export default function CampaignDetailPage() {
    const { campaignAddress } = useParams() as { campaignAddress: string };

    return (
        <div>
            <CampaignDetail
                campaignAddress={campaignAddress as `0x${string}`}
            />
        </div>
    );
}
