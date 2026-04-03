import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import ContextProvider from "@/context";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "DAO Crowdfunding App",
    description:
        "Governance-powered crowdfunding with escrow and AI verification",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const headersObj = await headers();
    const cookies = headersObj.get("cookie");

    return (
        <html lang="en" suppressHydrationWarning className="dark">
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={false}
                    disableTransitionOnChange
                >
                    <ContextProvider cookies={cookies}>
                        {children}
                    </ContextProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
