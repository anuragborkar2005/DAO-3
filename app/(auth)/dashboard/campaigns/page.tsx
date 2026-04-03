"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MyVotesPage() {
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold">My Votes</h2>

            <Card className="glass">
                <CardHeader>
                    <CardTitle>Voting History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-zinc-400 py-12 text-center">
                        Your voting history on campaigns and milestones will
                        appear here.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
