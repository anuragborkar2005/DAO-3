"use client";

import { useProposals } from "@/hooks/use-proposals";
import ProposalList from "@/components/governance/proposal-list";
import GovernanceStats from "@/components/governance/governance-stats";

export default function GovernancePage() {
    const { data: proposals = [], isLoading, refetch } = useProposals();

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        FYDAO Governance
                    </h1>
                    <p className="text-zinc-400 mt-2">
                        Vote on campaign approvals and milestone releases
                    </p>
                </div>
                <GovernanceStats />
            </div>

            <ProposalList
                proposals={proposals}
                isLoading={isLoading}
                refetch={refetch}
            />
        </div>
    );
}
