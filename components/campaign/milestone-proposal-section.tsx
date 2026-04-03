"use client";

import { useState } from "react";
import { useProposeMilestone } from "@/hooks/use-propose-milestone";
import { uploadToPinata } from "@/lib/pinata";

interface Props {
    campaignAddress: `0x${string}`;
    refetch: () => void;
}

export default function MilestoneProposalSection({
    campaignAddress,
    refetch,
}: Props) {
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [amount, setAmount] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    //eslint-disable-next-line
    const [aiResult, setAiResult] = useState<any>(null);

    const { proposeMilestone, isPending } =
        useProposeMilestone(campaignAddress);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setProofFile(e.target.files[0]);
    };

    const analyzeWithAI = async () => {
        if (!proofFile) return;
        setIsAnalyzing(true);

        try {
            // 1. Upload proof to Pinata
            const uploadResult = await uploadToPinata(proofFile, {
                type: "milestone-proof",
            });
            const proofCid = uploadResult.cid;

            // 2. Call AI API
            const res = await fetch("/api/ai/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    proofCid,
                    milestoneDescription: "Verify milestone completion proof",
                }),
            });

            const data = await res.json();
            setAiResult({ ...data.aiResult, proofCid });
        } catch (err) {
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const submitMilestone = async () => {
        if (!aiResult?.proofCid || !amount) return;

        await proposeMilestone({
            proofCid: aiResult.proofCid,
            amount,
        });

        refetch();
        setProofFile(null);
        setAiResult(null);
        setAmount("");
    };

    return (
        <div className="bg-zinc-900 rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-6">
                Propose Milestone Release
            </h3>

            <input type="file" onChange={handleFileChange} className="mb-4" />

            <button
                onClick={analyzeWithAI}
                disabled={!proofFile || isAnalyzing}
                className="w-full py-3 bg-blue-600 rounded-xl mb-4"
            >
                {isAnalyzing
                    ? "AI Analyzing Proof..."
                    : "Analyze Proof with AI"}
            </button>

            {aiResult && (
                <div className="p-4 bg-zinc-800 rounded-xl mb-6">
                    <p>
                        AI Verdict:{" "}
                        <span className="font-bold">{aiResult.verdict}</span> (
                        {aiResult.confidence}%)
                    </p>
                    <p className="text-sm text-zinc-400 mt-2">
                        {aiResult.summary}
                    </p>
                </div>
            )}

            <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Release Amount (USDC)"
                className="w-full p-4 bg-zinc-800 rounded-xl mb-4"
            />

            <button
                onClick={submitMilestone}
                disabled={isPending || !aiResult}
                className="w-full py-4 bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 rounded-xl font-semibold"
            >
                Submit Milestone Proposal to DAO
            </button>
        </div>
    );
}
