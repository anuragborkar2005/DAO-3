// hooks/useCreateCampaign.ts
"use client";

import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useConnection,
} from "wagmi";
import { ABIS, CONTRACT_ADDRESSES } from "@/contracts/config";
import { useState, useEffect } from "react";
import { sepolia } from "viem/chains";
import Campaign from "@/models/campaign"; // We'll call API to save

export function useCreateCampaign() {
  const { address } = useConnection();
  const [campaignAddress, setCampaignAddress] = useState<string | null>(null);

  const {
    writeContract,
    data: hash,
    isPending,
    isSuccess,
  } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const createCampaign = async ({
    creator,
    metadataURI,
  }: {
    creator: string;
    metadataURI: string;
  }) => {
    if (!address) throw new Error("Wallet not connected");

    writeContract({
      address: CONTRACT_ADDRESSES.CampaignFactory as `0x${string}`,
      abi: ABIS.CampaignFactory,
      functionName: "createCampaign",
      args: [creator as `0x${string}`, metadataURI],
      chainId: sepolia.id,
    });
  };

  // After tx confirmation → save to MongoDB + prepare approval
  useEffect(() => {
    if (isSuccess && hash) {
      // In real app: Listen to CampaignCreated event or use multicall to get latest campaign
      // For now, we can parse logs or call an API route to save
      console.log("Campaign created! Tx:", hash);
      // TODO: Call /api/campaigns/create to save onChainAddress + metadataCid to Mongo
      // Then trigger approval proposal creation
    }
  }, [isSuccess, hash]);

  return {
    createCampaign,
    isPending: isPending || isConfirming,
    isSuccess,
    campaignAddress,
    txHash: hash,
  };
}
