import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import type { ReactNode } from "react";

import { getSiteUrl } from "../lib/env";
import { isStorefrontMaintenance } from "../lib/maintenance";

import "./globals.css";
import "./styles/foundation.css";
import "./styles/storefront.css";
import "./styles/account-auth.css";
import "./styles/admin.css";

const displayFont = Cormorant_Garamond({
  display: "swap",
  subsets: ["cyrillic", "latin"],
  variable: "--font-dream-display",
  weight: ["500", "600", "700"],
});
const textFont = Manrope({
  display: "swap",
  subsets: ["cyrillic", "latin"],
  variable: "--font-dream-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const maintenanceEnabled = isStorefrontMaintenance();
const siteUrl = getSiteUrl();
const webSiteJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  inLanguage: "uk-UA",
  name: "DreamShop",
  url: siteUrl,
});
const icons: Metadata["icons"] = {
  icon: [
    { url: "/favicon.ico" },
    { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
  ],
  apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
};

export const metadata: Metadata = maintenanceEnabled
  ? {
      description: "DreamShop тимчасово недоступний через технічні роботи.",
      icons,
      metadataBase: new URL(siteUrl),
      robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noarchive: true,
        },
      },
      title: "DreamShop - Технічні роботи",
    }
  : {
      alternates: {
        canonical: "/",
      },
      description:
        "Натуральні фруктові чипси та смаколики DreamShop в Одесі.",
      icons,
      metadataBase: new URL(siteUrl),
      openGraph: {
        description:
          "Натуральні фруктові чипси та смаколики DreamShop в Одесі.",
        images: [
          {
            alt: "DreamShop — натуральні фруктові чипси та смаколики",
            height: 630,
            url: "/opengraph-image",
            width: 1200,
          },
        ],
        locale: "uk_UA",
        siteName: "DreamShop",
        title: "DreamShop",
        type: "website",
        url: "/",
      },
      robots: {
        follow: true,
        index: true,
      },
      title: "DreamShop",
      twitter: {
        card: "summary_large_image",
        description:
          "Натуральні фруктові чипси та смаколики DreamShop в Одесі.",
        images: ["/opengraph-image"],
        title: "DreamShop",
      },
    };

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#dceff0",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="uk">
      <body className={`${displayFont.variable} ${textFont.variable}`}>
        {maintenanceEnabled ? null : (
          <script
            dangerouslySetInnerHTML={{ __html: webSiteJsonLd }}
            type="application/ld+json"
          />
        )}
        {children}
      </body>
    </html>
  );
}
