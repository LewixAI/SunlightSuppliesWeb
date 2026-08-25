import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sunlightrack.com"),
  title: {
    default:
      "Sunlight Supplies | Pallet racking and display fixtures, Johor Bahru",
    template: "%s | Sunlight Supplies",
  },
  description:
    "Heavy duty pallet racking, storage systems and retail display fixtures. Free site measurement and AutoCAD layout. Three counters in Johor Bahru since 2014.",
  keywords: [
    "racking system Johor Bahru",
    "pallet racking Malaysia",
    "heavy duty racking JB",
    "gondola rack Johor",
    "warehouse storage system",
  ],
  openGraph: {
    type: "website",
    locale: "en_MY",
    siteName: "Sunlight Supplies Sdn Bhd",
    title: "Racking, from the site survey up.",
    description:
      "Heavy duty pallet racking and retail display fixtures, measured, drawn and installed across Johor since 2014.",
  },
  icons: { icon: "/brand/favicon.png" },
};

export const viewport: Viewport = {
  themeColor: "#0b0c0d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-MY"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
