import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bano Qabil AI Lab • Midterm Exam & Instant Groq AI Assessment",
  description: "Automated AI examination and grading platform for Bano Qabil Essentials of AI (Weeks 1 to 6). Instant evaluation powered by Groq Llama 3.3 70B.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#050a14] text-[#e8eef7]">
        {children}
      </body>
    </html>
  );
}
