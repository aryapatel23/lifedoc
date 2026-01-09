import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/ReduxProvider";
import VoiceAssistant from "@/components/VoiceAssistant";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LifeDoc - Your Health Documentation",
  description: "Create, organize, and share your medical records",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          {children}
          <VoiceAssistant />
        </ReduxProvider>
      </body>
    </html>
  );
}
