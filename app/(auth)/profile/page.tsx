"use client";

import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
    const { address } = useAccount();

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold">My Profile</h1>

            <Card className="glass">
                <CardHeader>
                    <CardTitle>Wallet Address</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-mono text-lg break-all">{address}</p>
                </CardContent>
            </Card>

            <Card className="glass">
                <CardHeader>
                    <CardTitle>My Contributions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-zinc-400">
                        Your donated campaigns and voting history will appear
                        here.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
