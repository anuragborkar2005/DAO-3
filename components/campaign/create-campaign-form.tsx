"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateCampaign } from "@/hooks/use-create-campaign";
import ConnectButton from "../wallet/connect-button";
import { uploadJsonToPinataAction } from "@/app/actions/pinata";
import { CONTRACT_ADDRESSES } from "@/contracts/config";

const schema = z.object({
    title: z.string().min(5),
    description: z.string().min(20),
    targetAmount: z.string().min(1),
    category: z.string(),
});

type FormData = z.infer<typeof schema>;

export default function CreateCampaignForm() {
    const { address } = useAccount();
    const { createCampaign, isPending } = useCreateCampaign();
    const [isUploading, setIsUploading] = useState(false);

    const { register, handleSubmit } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            setIsUploading(true);

            const metadata = {
                title: data.title,
                description: data.description,
                targetAmount: data.targetAmount,
                category: data.category,
            };

            const uploadResult = await uploadJsonToPinataAction(metadata);

            console.log("Uploaded to IPFS:", uploadResult.cid);

            await createCampaign({
                metadataURI: uploadResult.cid,
                targetAmount: data.targetAmount,
                trustScore: 92,
            });
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Card className="glass max-w-2xl mx-auto">
            <CardContent className="p-8">
                {!address ? (
                    <ConnectButton />
                ) : (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div>
                            <Label>Campaign Title</Label>
                            <Input
                                {...register("title")}
                                placeholder="School for 200 children"
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Textarea {...register("description")} rows={6} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Target (USDC)</Label>
                                <Input
                                    {...register("targetAmount")}
                                    type="text"
                                />
                            </div>
                            <div>
                                <Label>Category</Label>
                                <Input
                                    {...register("category")}
                                    placeholder="Education"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full"
                            disabled={isPending || isUploading}
                        >
                            {isUploading || isPending
                                ? "Creating on-chain..."
                                : "Create Campaign & Submit to DAO"}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
