"use client";

import { useAppKit } from "@reown/appkit/react";
import { Button } from "../ui/button";

export default function ConnectButton() {
  const { open } = useAppKit();

  return (
    <Button
      onClick={() => open()}
      className="px-6 py-3  text-white rounded-xl font-medium transition"
    >
      Connect Wallet
    </Button>
  );
}
