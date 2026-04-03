"use client";

import ProposalList from "@/components/governance/proposal-list";
import { useProposals } from "@/hooks/use-proposals";

export default function DashboardGovernancePage() {
    const { data: proposals = [], isLoading, refetch } = useProposals();

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold">Governance Activity</h2>
            <ProposalList
                proposals={proposals}
                isLoading={isLoading}
                refetch={refetch}
            />
        </div>
    );
}
