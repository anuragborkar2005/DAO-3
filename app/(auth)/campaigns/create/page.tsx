"use client";

import CreateCampaignForm from "@/components/campaign/create-campaign-form";

export default function CreateCampaignPage() {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-bold">Create New Campaign</h1>
                <p className="text-zinc-400 mt-3">
                    Submit your project for DAO review. Once approved, it will
                    go live with secure escrow.
                </p>
            </div>

            <CreateCampaignForm />
        </div>
    );
}
