// lib/pinata.ts
import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: "https://bronze-changing-silverfish-206.mypinata.cloud",
});

interface UploadResult {
  cid: string;
  gatewayUrl: string;
  id: string;
}

export async function uploadToPinata(
  input: File | Buffer,
  metadata: Record<string, string> = {},
): Promise<UploadResult> {
  try {
    let file: File;

    if (Buffer.isBuffer(input)) {
      const uint8Array = new Uint8Array(input);
      file = new File([uint8Array], metadata.name || "fydao-upload", {
        type: "application/octet-stream",
      });
    } else {
      file = input;
    }

    const upload = await pinata.upload.public.file(file, {
      metadata: {
        name: metadata.name || "fydao-upload",
        keyvalues: metadata,
      },
    });

    const cid = upload.cid;

    return {
      cid: `ipfs://${cid}`,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${cid}`,
      id: upload.id,
    };
  } catch (error) {
    console.error("Pinata upload error:", error);
    throw new Error("Failed to upload to Pinata");
  }
}

export async function uploadJsonToPinata(
  jsonData: unknown,
  name = "metadata.json",
): Promise<UploadResult> {
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
    type: "application/json",
  });

  const file = new File([blob], name, {
    type: "application/json",
  });

  // Pass only string values for metadata
  return uploadToPinata(file, { name });
}
