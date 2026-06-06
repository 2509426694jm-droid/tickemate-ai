import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "TickeMate AI — K-POP Concert Ticket Simulator",
  description: "Practice booking K-POP concert tickets with an AI guide. Master the 6-step process before the real sale day.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full animated-bg">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
