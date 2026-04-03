// components/ai/AiAnalysisBadge.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Props {
    analysis?: {
        verdict: string;
        confidence: number;
        details?: string;
    };
}

export default function AiAnalysisBadge({ analysis }: Props) {
    if (!analysis) return null;

    const color = analysis.verdict === "positive" ? "emerald" : "red";

    return (
        <div className="mt-4 p-4 bg-zinc-900/80 rounded-2xl border border-zinc-700">
            <div className="flex items-center justify-between">
                <Badge
                    variant="outline"
                    className={`border-${color}-500 text-${color}-400`}
                >
                    AI VERIFIED • {analysis.verdict.toUpperCase()}
                </Badge>
                <span className="text-xs text-zinc-400">
                    {analysis.confidence}% confident
                </span>
            </div>
            <Progress value={analysis.confidence} className="h-1.5 mt-3" />
            {analysis.details && (
                <p className="text-xs text-zinc-500 mt-3">{analysis.details}</p>
            )}
        </div>
    );
}
