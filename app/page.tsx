// app/page.tsx
import ConnectButton from "@/components/wallet/connect-button";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to FYDAO</h1>
        <p className="text-xl text-zinc-400 mb-8">
          AI-Assisted DAO Crowdfunding with Secure Escrow
        </p>
        <ConnectButton />
      </div>
    </main>
  );
}
