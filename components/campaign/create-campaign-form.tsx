// components/campaign/CreateCampaignForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useConnection, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { uploadJsonToPinata } from "@/lib/pinata";
import { useCreateCampaign } from "@/hooks/use-create-campaign";
import ConnectButton from "../wallet/connect-button";

const formSchema = z.object({
  title: z.string().min(5, "Title too short"),
  description: z.string().min(20, "Description too short"),
  targetAmount: z.string().min(1, "Target amount required"),
  category: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateCampaignForm() {
  const { address } = useConnection();
  const [isUploading, setIsUploading] = useState(false);
  const [metadataCid, setMetadataCid] = useState<string | null>(null);

  const { createCampaign, isPending, isSuccess, campaignAddress } =
    useCreateCampaign();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (!address) return;

    setIsUploading(true);

    try {
      // 1. Upload rich metadata to Pinata
      const metadata = {
        title: data.title,
        description: data.description,
        targetAmount: data.targetAmount,
        category: data.category,
        creator: address,
        createdAt: new Date().toISOString(),
        // Add images/files later via separate uploads
      };

      const uploadResult = await uploadJsonToPinata(
        metadata,
        `campaign-${Date.now()}.json`,
      );
      setMetadataCid(uploadResult.cid);

      // 2. Call smart contract
      await createCampaign({
        creator: address,
        metadataURI: uploadResult.cid, // ipfs://Qm...
      });

      // On success → we can auto-create approval proposal in next step
    } catch (error) {
      console.error("Campaign creation failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-zinc-900 rounded-2xl">
      <h2 className="text-3xl font-bold mb-8">Create New Campaign</h2>

      {!address ? (
        <ConnectButton />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm mb-2">Campaign Title</label>
            <input
              {...register("title")}
              className="w-full p-4 bg-zinc-800 rounded-xl"
              placeholder="Help build school in rural area"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-2">Description</label>
            <textarea
              {...register("description")}
              rows={6}
              className="w-full p-4 bg-zinc-800 rounded-xl"
              placeholder="Detailed goals, impact..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Target Amount (USDC)</label>
              <input
                {...register("targetAmount")}
                type="text"
                className="w-full p-4 bg-zinc-800 rounded-xl"
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Category</label>
              <select
                {...register("category")}
                className="w-full p-4 bg-zinc-800 rounded-xl"
              >
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Environment">Environment</option>
                <option value="Community">Community</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || isUploading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-700 rounded-xl font-semibold text-lg transition"
          >
            {isUploading
              ? "Uploading to Pinata..."
              : isPending
                ? "Creating Campaign on-chain..."
                : "Create Campaign & Submit to DAO"}
          </button>

          {isSuccess && campaignAddress && (
            <div className="p-4 bg-emerald-950 border border-emerald-500 rounded-xl">
              Campaign created successfully!
              <br />
              Address:{" "}
              <span className="font-mono text-sm">{campaignAddress}</span>
              <br />
              Metadata CID: {metadataCid}
              {/* Next: Button to propose approval */}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
