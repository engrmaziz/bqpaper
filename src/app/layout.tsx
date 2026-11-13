import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bano Qabil • Essentials of AI Midterm Examination & AI Lab",
  description: "Official Bano Qabil Online Examination Platform with Instant AI Assessment & Marksheet. Powered by Bano Qabil AI Lab.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
      { url: "/bano-qabil.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png" },
      { url: "/bano-qabil.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f4f8f5] text-[#0d2317]">
        {children}
      </body>
    </html>
  );
}
