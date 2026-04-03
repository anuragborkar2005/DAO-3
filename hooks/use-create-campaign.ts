"use client";

import {
    useWriteContract,
    useWaitForTransactionReceipt,
    useAccount,
} from "wagmi";
import { useState, useEffect } from "react";
import { ABIS, CONTRACT_ADDRESSES } from "@/contracts/config";
import { decodeEventLog } from "viem";

export function useCreateCampaign() {
    const { address } = useAccount();

    const [deployedData, setDeployedData] = useState<{
        campaignAddress: string;
        escrowAddress: string;
    } | null>(null);

    const [currentMetadata, setCurrentMetadata] = useState<{
        metadataURI: string;
        targetAmount: string;
    } | null>(null);

    const [isSaving, setIsSaving] = useState(false);

    const {
        writeContract,
        data: hash,
        isPending: isWriting,
        isSuccess,
        error: writeError,
    } = useWriteContract();

    const {
        data: receipt,
        isLoading: isConfirming,
        error: receiptError,
    } = useWaitForTransactionReceipt({
        hash,
        confirmations: 2,
    });

    useEffect(() => {
        if (writeError) console.error("❌ Write Contract Error:", writeError);
        if (receiptError) console.error("❌ Receipt Error:", receiptError);
        if (hash) console.log("🔗 Transaction Hash:", hash);
    }, [writeError, receiptError, hash]);

    const createCampaign = async ({
        metadataURI,
        targetAmount,
        trustScore = 80,
    }: {
        metadataURI: string;
        targetAmount: string;
        trustScore?: number;
    }) => {
        if (!address) throw new Error("Wallet not connected");

        console.log("Creating campaign with metadataURI:", metadataURI);
        setCurrentMetadata({ metadataURI, targetAmount });

        writeContract({
            address: CONTRACT_ADDRESSES.CampaignFactory as `0x${string}`,
            abi: ABIS.CampaignFactory,
            functionName: "createCampaign",
            args: [
                CONTRACT_ADDRESSES.MockUSDC,
                metadataURI,
                BigInt(trustScore),
            ],
        });
    };

    // Sync to MongoDB when transaction is confirmed
    useEffect(() => {
        if (!isSuccess || !receipt || !hash || !currentMetadata) return;

        const syncToMongoDB = async () => {
            setIsSaving(true);
            console.log("⏳ Syncing campaign to MongoDB...");

            try {
                let campaignAddr = "";
                let escrowAddr = "";

                for (const log of receipt.logs) {
                    try {
                        const decoded = decodeEventLog({
                            abi: ABIS.CampaignFactory,
                            data: log.data,
                            topics: log.topics,
                        });

                        if (decoded.eventName === "CampaignCreated") {
                            //eslint-disable-next-line
                            const args = decoded.args as any;
                            campaignAddr = args.campaign || args[0] || "";
                            escrowAddr = args.escrow || args[1] || "";
                            console.log("✅ Decoded CampaignCreated:", {
                                campaignAddr,
                                escrowAddr,
                            });
                            break;
                        }
                    } catch (e) {
                        continue;
                    }
                }

                if (campaignAddr) {
                    const payload = {
                        onChainAddress: campaignAddr.toLowerCase(),
                        creator: address?.toLowerCase(),
                        metadataCid: currentMetadata.metadataURI,
                        targetAmount: currentMetadata.targetAmount,
                    };

                    const response = await fetch("/api/campaigns/create", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    });

                    const result = await response.json();

                    if (result.success) {
                        setDeployedData({
                            campaignAddress: campaignAddr,
                            escrowAddress: escrowAddr,
                        });
                        console.log(
                            "🎉 Campaign saved to MongoDB successfully!",
                        );
                    } else {
                        console.error("❌ MongoDB sync failed:", result);
                    }
                } else {
                    console.warn(
                        "⚠️ Could not find CampaignCreated event in logs. Saving with tx hash only.",
                    );
                    // Fallback: Save with transaction hash
                    await fetch("/api/campaigns/create", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            onChainAddress: "0xPENDING_" + hash.slice(2, 10),
                            escrowAddress: escrowAddr.toLowerCase(),
                            creator: address?.toLowerCase(),
                            metadataCid: currentMetadata.metadataURI,
                            targetAmount: currentMetadata.targetAmount,
                            factoryTxHash: hash,
                        }),
                    });
                }
            } catch (err) {
                console.error("🧨 Error during MongoDB sync:", err);
            } finally {
                setIsSaving(false);
            }
        };

        syncToMongoDB();
    }, [isSuccess, receipt, hash, address, currentMetadata]);

    return {
        createCampaign,
        isPending: isWriting || isConfirming || isSaving,
        isSuccess,
        deployedData,
        txHash: hash,
        isSaving,
    };
}
