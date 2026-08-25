import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

/* Figtree: geometric and round without tipping into a novelty rounded face.
   Their own old site loaded Poppins, so a friendly geometric sans is where the
   brand already lived. */
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
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
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-MY" className={`${figtree.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
