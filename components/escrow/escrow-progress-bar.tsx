"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
    raised: number;
    target: number;
}

export default function EscrowProgressBar({ raised, target }: Props) {
    const percent = Math.min(Math.round((raised / target) * 100), 100);

    return (
        <Card className="glass border-emerald-500/30">
            <CardContent className="p-6">
                <div className="flex justify-between text-sm mb-3">
                    <span className="text-zinc-400">Escrow Funded</span>
                    <span className="font-mono text-emerald-400">
                        {raised} / {target} USDC
                    </span>
                </div>
                <Progress value={percent} className="h-3" />
                <p className="text-xs text-zinc-400 mt-2 text-right">
                    {percent}% • DAO-controlled release
                </p>
            </CardContent>
        </Card>
    );
}
