"use client";

import { useState } from "react";
import { useDonate } from "@/hooks/use-donate";
import { Button } from "@/components/ui/button";
import { ICampaign } from "@/types";

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
    const [amount, setAmount] = useState("");
    const { donate, isPending } = useDonate(campaignAddress);

    const handleDonate = async () => {
        if (!amount) return;
        await donate(amount);
        refetch(); // Refresh raised amount
        setAmount("");
    };

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
                    className="w-full p-4 bg-zinc-800 rounded-xl text-lg"
                />

                <Button
                    onClick={handleDonate}
                    disabled={isPending || !campaign.isLive}
                    className="w-full py-6 text-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-700"
                >
                    {isPending ? "Processing Donation..." : "Donate Now"}
                </Button>

                {!campaign.isLive && (
                    <p className="text-center text-sm text-amber-400">
                        Campaign must be live to accept donations
                    </p>
                )}
            </div>
        </div>
    );
}
