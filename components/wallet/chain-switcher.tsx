"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { Button } from "@/components/ui/button";
import { sepolia } from "viem/chains";
import { ChevronDown } from "lucide-react";
import { localchain } from "@/config";

export default function ChainSwitcher() {
    const { chain } = useAccount();
    const { switchChain } = useSwitchChain();

    const chains = [sepolia, localchain];

    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-2xl border-zinc-700">
                {chain?.name || "Select Chain"}
                <ChevronDown className="ml-2 w-4 h-4" />
            </Button>
            <div className="hidden md:flex gap-1">
                {chains.map((c) => (
                    <Button
                        key={c.id}
                        variant={chain?.id === c.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => switchChain({ chainId: c.id })}
                        className="rounded-2xl"
                    >
                        {c.name}
                    </Button>
                ))}
            </div>
        </div>
    );
}
