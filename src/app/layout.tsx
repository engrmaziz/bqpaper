import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bano Qabil • Essentials of AI Midterm Examination & AI Lab",
  description: "Official Bano Qabil Online Examination Platform with Instant AI Assessment & Marksheet. Powered by Bano Qabil AI Lab.",
  icons: {
    icon: "/bano-qabil.png",
    shortcut: "/bano-qabil.png",
    apple: "/bano-qabil.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f4f8f5] text-[#0d2317]">
        {children}
      </body>
    </html>
  );
}
