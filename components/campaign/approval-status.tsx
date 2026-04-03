"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Users,
} from "lucide-react";
import { Button } from "@/components/ui/button"; // Shadcn Button (add if not present)
import { useProposeApproval } from "@/hooks/use-propose-approval";

interface Campaign {
    onChainAddress: string;
    creator: string;
    status: "created" | "pending_approval" | "live" | "rejected" | "completed";
    isLive: boolean;
    approvalProposalId?: string;
    metadata?: {
        title: string;
    };
}

interface Props {
    campaign: Campaign;
}

export default function ApprovalStatus({ campaign }: Props) {
    const { address } = useAccount();
    const [timeLeft, setTimeLeft] = useState<string>("");
    const isCreator = address?.toLowerCase() === campaign.creator.toLowerCase();

    const { proposeApproval, isPending: isProposing } = useProposeApproval(
        campaign.onChainAddress as `0x${string}`,
    );

    // Calculate time left for voting (mock for now - enhance with real governor data later)
    useEffect(() => {
        if (
            campaign.status === "pending_approval" &&
            campaign.approvalProposalId
        ) {
            // In production: Fetch proposal deadline from Governor contract
            const mockDeadline = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
            const interval = setInterval(() => {
                const remaining = Math.max(
                    0,
                    Math.floor((mockDeadline - Date.now()) / 1000),
                );
                const days = Math.floor(remaining / 86400);
                const hours = Math.floor((remaining % 86400) / 3600);
                setTimeLeft(`${days}d ${hours}h remaining`);
            }, 60000);
            return () => clearInterval(interval);
        }
    }, [campaign.status, campaign.approvalProposalId]);

    const getStatusDisplay = () => {
        switch (campaign.status) {
            case "live":
                return {
                    icon: <CheckCircle className="w-8 h-8 text-emerald-500" />,
                    label: "LIVE & FUNDING",
                    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500",
                    description:
                        "This campaign is approved by the DAO and accepting donations.",
                };
            case "pending_approval":
                return {
                    icon: <Clock className="w-8 h-8 text-amber-500" />,
                    label: "PENDING DAO APPROVAL",
                    color: "bg-amber-500/10 text-amber-400 border-amber-500",
                    description:
                        "Waiting for FYDAO Governor vote. Quorum: 4% • Voting Period: 7 days",
                };
            case "rejected":
                return {
                    icon: <XCircle className="w-8 h-8 text-red-500" />,
                    label: "REJECTED BY DAO",
                    color: "bg-red-500/10 text-red-400 border-red-500",
                    description: "The DAO did not approve this campaign.",
                };
            case "completed":
                return {
                    icon: <CheckCircle className="w-8 h-8 text-emerald-500" />,
                    label: "COMPLETED",
                    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500",
                    description:
                        "All milestones released. Campaign successfully completed.",
                };
            default:
                return {
                    icon: <AlertTriangle className="w-8 h-8 text-zinc-500" />,
                    label: "DRAFT",
                    color: "bg-zinc-500/10 text-zinc-400 border-zinc-500",
                    description:
                        "Campaign created. Ready to submit for DAO review.",
                };
        }
    };

    const status = getStatusDisplay();

    return (
        <div className={`border rounded-2xl p-6 ${status.color}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    {status.icon}
                    <div>
                        <div className="font-semibold text-xl tracking-tight">
                            {status.label}
                        </div>
                        <p className="text-sm mt-1 opacity-90">
                            {status.description}
                        </p>
                    </div>
                </div>

                {campaign.status === "pending_approval" && timeLeft && (
                    <div className="text-right text-sm">
                        <div className="flex items-center gap-1 justify-end text-amber-400">
                            <Clock className="w-4 h-4" />
                            {timeLeft}
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
                {/* Creator can propose approval if not already proposed */}
                {isCreator && campaign.status === "created" && (
                    <Button
                        onClick={proposeApproval}
                        disabled={isProposing}
                        className="flex-1 bg-violet-600 hover:bg-violet-700"
                    >
                        {isProposing
                            ? "Creating Proposal..."
                            : "Propose to DAO for Approval"}
                    </Button>
                )}

                {/* Show proposal link when pending */}
                {campaign.status === "pending_approval" &&
                    campaign.approvalProposalId && (
                        <Button
                            variant="outline"
                            className="flex-1 border-amber-500 text-amber-400 hover:bg-amber-950"
                            onClick={() =>
                                window.open(
                                    `/governance/${campaign.approvalProposalId}`,
                                    "_blank",
                                )
                            }
                        >
                            <Users className="w-4 h-4 mr-2" />
                            View DAO Proposal
                        </Button>
                    )}

                {/* Live status actions */}
                {campaign.status === "live" && (
                    <div className="flex-1 text-center text-emerald-400 text-sm font-medium py-2 border border-emerald-500/30 rounded-xl">
                        ✅ Approved by FYDAO Governance
                    </div>
                )}
            </div>

            {/* Progress Indicator for Pending Approval */}
            {campaign.status === "pending_approval" && (
                <div className="mt-6 pt-6 border-t border-amber-500/30">
                    <div className="flex justify-between text-xs text-zinc-400 mb-2">
                        <span>DAO Review Progress</span>
                        <span>4% Quorum Required</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full w-[35%] bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full" />
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2">
                        Proposal ID:{" "}
                        <span className="font-mono">
                            {campaign.approvalProposalId?.slice(0, 10)}...
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
}
