"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "../ui/dropdown-menu";
import { useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ConnectButton() {
    const { open } = useAppKit();
    const { isConnected, address } = useAppKitAccount();
    const { disconnect } = useDisconnect();
    const router = useRouter();

    useEffect(() => {
        if (isConnected && address) {
            document.cookie = `wallet-connected=true; path=/; max-age=86400`;
        }
    }, [isConnected, address]);

    if (!isConnected) {
        return (
            <Button
                onClick={() => open()}
                variant="default"
                className="px-6 py-3 rounded-xl font-medium transition"
            >
                Connect Wallet
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="default"
                    className="px-6 py-3 rounded-xl font-medium transition"
                >
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem
                    onClick={() => {
                        router.push("/profile");
                        console.log("Clicked");
                    }}
                >
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => disconnect()}>
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
