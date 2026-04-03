"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    PlusCircle,
    TrendingUp,
    Award,
    Users,
} from "lucide-react";

interface Props {
    children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
    const pathname = usePathname();

    const navItems = [
        { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
        {
            label: "My Campaigns",
            href: "/dashboard/campaigns",
            icon: TrendingUp,
        },
        { label: "My Votes", href: "/dashboard/votes", icon: Award },
        {
            label: "Governance Activity",
            href: "/dashboard/governance",
            icon: Users,
        },
    ];

    return (
        <div className="min-h-[calc(100vh-80px)]">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:w-72 flex-shrink-0">
                        <Card className="glass border-zinc-800 sticky top-24">
                            <CardContent className="p-6">
                                <nav className="space-y-1">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.href;
                                        const Icon = item.icon;

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                                                    isActive
                                                        ? "bg-emerald-600 text-white font-medium"
                                                        : "hover:bg-zinc-800 text-zinc-400 hover:text-white"
                                                }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span>{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">{children}</div>
                </div>
            </div>
        </div>
    );
}
