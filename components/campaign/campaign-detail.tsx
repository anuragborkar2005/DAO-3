"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCampaign } from "@/hooks/use-campaign";
import EscrowProgressBar from "../escrow/escrow-progress-bar";
import DonateSection from "./donate-section";
import MilestoneProposalSection from "./milestone-proposal-section";
import ApprovalStatus from "./approval-status";

interface Props {
    campaignAddress: `0x${string}`;
}

export default function CampaignDetail({ campaignAddress }: Props) {
    const { data: campaign, isLoading, refetch } = useCampaign(campaignAddress);

    if (isLoading || !campaign)
        return <div className="text-center py-20">Loading campaign...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
                <ApprovalStatus campaign={campaign} />

                <Card className="glass border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-3xl">
                            {campaign.metadata?.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none">
                        <p className="text-lg text-zinc-300">
                            {campaign.metadata?.description}
                        </p>
                    </CardContent>
                </Card>

                <EscrowProgressBar
                    raised={Number(campaign.raisedAmount || 0)}
                    target={Number(campaign.targetAmount || 0)}
                />

                {/* Milestones Timeline - Use Tabs or Accordion for polish */}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
                <DonateSection
                    campaignAddress={campaignAddress}
                    campaign={campaign}
                    refetch={refetch}
                />

                {campaign.isLive && (
                    <MilestoneProposalSection
                        campaignAddress={campaignAddress}
                        refetch={refetch}
                    />
                )}
            </div>
        </div>
    );
}
