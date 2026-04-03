"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AiAnalysisBadge from "../ai/ai-analysis-badge";
import { IMilestone } from "@/types";

interface Props {
    milestones: IMilestone[];
}

export default function MilestoneTimeline({ milestones }: Props) {
    return (
        <Card className="glass">
            <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">
                    Milestone Timeline
                </h2>
                <div className="space-y-6">
                    {milestones.map((milestone) => (
                        <div key={milestone.milestoneId} className="flex gap-6">
                            <div className="w-10 h-10 rounded-2xl bg-zinc-800 flex items-center justify-center font-mono text-sm">
                                {milestone.milestoneId}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <p className="font-medium">
                                        Release {milestone.amount} USDC
                                    </p>
                                    <Badge variant="outline">
                                        {milestone.status}
                                    </Badge>
                                </div>
                                <AiAnalysisBadge
                                    analysis={milestone.aiAnalysis}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
