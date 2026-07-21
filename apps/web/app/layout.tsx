import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Providers } from "./providers";
import { THEME_BOOTSTRAP } from "@/lib/theme/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: "UKIL.ai — Law Firm Console",
  description: "Internal operations platform for Bangladeshi law firms",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-cream font-sans text-text-primary antialiased">
        <Script
          id="ukil-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
