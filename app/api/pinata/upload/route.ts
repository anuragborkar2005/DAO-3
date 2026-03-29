// app/api/pinata/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { uploadToPinata, uploadJsonToPinata } from "@/lib/pinata";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const isJson = formData.get("isJson") === "true";
    const metadataStr = formData.get("metadata") as string;

    let result;
    if (isJson && metadataStr) {
      const metadata = JSON.parse(metadataStr);
      result = await uploadJsonToPinata(metadata, "campaign-metadata.json");
    } else if (file) {
      const extraMeta = metadataStr ? JSON.parse(metadataStr) : {};
      result = await uploadToPinata(file, extraMeta);
    } else {
      return NextResponse.json(
        { error: "No file or metadata provided" },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
