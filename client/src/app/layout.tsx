import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/store/ReduxProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SpeechInput from "@/app/Components/SpeechInput";

export const metadata: Metadata = {
  title: "LifeDoc - Your Health Documentation",
  description: "Create, organize, and share your medical records",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReduxProvider>
          {children}
        </ReduxProvider>
        <LanguageSwitcher />
        <SpeechInput />
      </body>
    </html>
  );
}
