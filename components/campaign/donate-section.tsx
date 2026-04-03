"use client";

import { useState, useEffect } from "react";
import { useDonate } from "@/hooks/use-donate";
import { Button } from "@/components/ui/button";
import { ICampaign } from "@/types";
import { useReadContract, useWriteContract, useAccount, useWaitForTransactionReceipt } from "wagmi";
import { ABIS, CONTRACT_ADDRESSES } from "@/contracts/config";
import { parseUnits } from "viem";

interface Props {
    campaignAddress: `0x${string}`;
    campaign: ICampaign;
    refetch: () => void;
}

export default function DonateSection({
    campaignAddress,
    campaign,
    refetch,
}: Props) {
    const { address } = useAccount();
    const [amount, setAmount] = useState("");
    const { donate, isPending: isDonating } = useDonate(campaignAddress);

    // 1. Check Allowance
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: CONTRACT_ADDRESSES.MockUSDC as `0x${string}`,
        abi: ABIS.MockUSDC,
        functionName: "allowance",
        args: address ? [address, campaignAddress] : undefined,
    });

    // 2. Approve Tool
    const { writeContract, data: approveHash, isPending: isApproving } = useWriteContract();
    const { isLoading: isConfirmingApprove, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });

    // Automatically refetch allowance when approval transaction succeeds
    useEffect(() => {
        if (isApproveSuccess) {
            refetchAllowance();
        }
    }, [isApproveSuccess, refetchAllowance]);

    const needsApproval = !allowance || (amount && allowance < parseUnits(amount, 6));

    const handleApprove = () => {
        if (!amount) return;
        writeContract({
            address: CONTRACT_ADDRESSES.MockUSDC as `0x${string}`,
            abi: ABIS.MockUSDC,
            functionName: "approve",
            args: [campaignAddress, parseUnits(amount, 6)],
        });
    };

    const handleDonate = async () => {
        if (!amount) return;
        try {
            await donate(amount);
            // Wait a small delay for chain to catch up before refetching
            setTimeout(() => {
                refetch(); // Refresh campaign data (raised amount)
                refetchAllowance();
            }, 2000);
            setAmount("");
        } catch (error) {
            console.error("Donation failed", error);
        }
    };

    const isPending = isDonating || isApproving || isConfirmingApprove;

    return (
        <div className="bg-zinc-900 rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-6">
                Support this Campaign
            </h3>

            <div className="space-y-4">
                <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount in USDC"
                    className="w-full p-4 bg-zinc-800 rounded-xl text-lg text-white"
                />

                {needsApproval ? (
                    <Button
                        onClick={handleApprove}
                        disabled={isPending || !campaign.isLive || !amount}
                        className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700"
                    >
                        {isPending ? "Approving USDC..." : "Approve USDC"}
                    </Button>
                ) : (
                    <Button
                        onClick={handleDonate}
                        disabled={isPending || !campaign.isLive || !amount}
                        className="w-full py-6 text-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-700"
                    >
                        {isPending ? "Processing Donation..." : "Donate Now"}
                    </Button>
                )}

                {!campaign.isLive && (
                    <p className="text-center text-sm text-amber-400">
                        Campaign must be live to accept donations
                    </p>
                )}
            </div>
        </div>
    );
}
