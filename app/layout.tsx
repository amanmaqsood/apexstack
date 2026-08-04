import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Builder Jobs at ApexStack | Hiring AI Talent",
  description:
    "Join Razorpay as an AI Builder and work on cutting-edge AI products, automation, and fintech innovation.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "AI Builder Jobs at Razorpay | Hiring AI Talent",
    description: "Hiring the most obsessed AI Builders to solve the toughest problems.",
    type: "website",
    images: ["/og-v2.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Builder Jobs at Razorpay | Hiring AI Talent",
    description: "Hiring the most obsessed AI Builders to solve the toughest problems.",
    images: ["/og-v2.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
