"use client";

import { ReactNode, useEffect } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEventListener } from "@/hooks/use-event-listener";
import ConnectButton from "@/components/wallet/connect-button";
import ChainSwitcher from "@/components/wallet/chain-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Toaster } from "@/components/ui/sonner";

interface Props {
    children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
    const { address, isConnected } = useAccount();
    const router = useRouter();
    const pathname = usePathname();

    // Start real-time event listeners once inside protected area
    useEventListener();

    // Client-side protection (middleware already redirects, this is extra safety)
    useEffect(() => {
        if (!isConnected && address === undefined) {
            router.replace("/");
        }
    }, [isConnected, address, router]);

    // Show loading/connect screen if somehow not connected
    if (!isConnected) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-6">FYDAO</h1>
                    <p className="text-zinc-400 mb-8">
                        Please connect your wallet to continue
                    </p>
                    <ConnectButton />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Protected Header */}
            <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="text-2xl font-bold tracking-tighter text-emerald-400"
                        >
                            FYDAO
                        </Link>

                        {/* Navigation */}
                        <nav className="flex items-center gap-6 text-sm">
                            <a
                                href="/dashboard"
                                className={`hover:text-white transition ${pathname.startsWith("/dashboard") ? "text-white font-medium" : "text-zinc-400"}`}
                            >
                                Dashboard
                            </a>
                            <Link
                                href="/campaigns"
                                className={`hover:text-white transition ${pathname.startsWith("/campaigns") ? "text-white font-medium" : "text-zinc-400"}`}
                            >
                                Campaigns
                            </Link>
                            <Link
                                href="/governance"
                                className={`hover:text-white transition ${pathname.startsWith("/governance") ? "text-white font-medium" : "text-zinc-400"}`}
                            >
                                Governance
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <ChainSwitcher />
                        <ThemeToggle />

                        {/* Connected wallet info */}
                        <ConnectButton />
                    </div>
                </div>
            </header>

            {/* Main Protected Content */}
            <main className="max-w-7xl mx-auto px-8 py-10">{children}</main>

            {/* Toast notifications */}
            <Toaster />
        </div>
    );
}
