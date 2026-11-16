import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bano Qabil • Essentials of AI Midterm Examination Platform",
  description: "Official Bano Qabil Online Examination Platform with Instant AI Assessment & Marksheet. Instructor: Musharraf Aziz (Applied AI, Bano Qabil Kasur).",
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
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Noto+Nastaliq+Urdu:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f6faf7] text-[#0d2317] selection:bg-[#015b30]/15 selection:text-[#014223]">
        {children}
      </body>
    </html>
  );
}
