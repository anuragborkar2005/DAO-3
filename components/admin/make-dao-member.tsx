"use client";

import { useState } from "react";
import { useAdminActions } from "@/hooks/use-admin-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RoleGuard from "../auth/role-guard";

export default function MakeDaoMember() {
    const [targetAddress, setTargetAddress] = useState("");
    const [amount, setAmount] = useState("1000");
    const { makeDaoMember, isPending, isAdmin } = useAdminActions();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetAddress) return;

        try {
            await makeDaoMember(targetAddress as `0x${string}`, amount);
            alert(`Successfully granted ${amount} tokens to ${targetAddress}`);
            setTargetAddress("");
        } catch (error) {
            const err =
                error instanceof Error ? error : new Error(String(error));
            alert("Error: " + err.message);
        }
    };

    return (
        <RoleGuard allowedRoles={["admin"]}>
            <Card className="glass max-w-lg">
                <CardHeader>
                    <CardTitle className="text-xl">
                        🔑 Make DAO Member
                    </CardTitle>
                    <p className="text-sm text-zinc-400">
                        Grant voting power to any address
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label>Target Wallet Address</Label>
                            <Input
                                value={targetAddress}
                                onChange={(e) =>
                                    setTargetAddress(e.target.value)
                                }
                                placeholder="0x1234..."
                                className="font-mono"
                            />
                        </div>

                        <div>
                            <Label>Token Amount</Label>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="1000"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isPending || !targetAddress}
                            className="w-full bg-violet-600 hover:bg-violet-700"
                        >
                            {isPending
                                ? "Granting DAO Membership..."
                                : "Make DAO Member"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </RoleGuard>
    );
}
