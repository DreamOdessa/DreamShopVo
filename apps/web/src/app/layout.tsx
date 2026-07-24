import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { getSiteUrl } from "../lib/env";
import { isStorefrontMaintenance } from "../lib/maintenance";

import "./globals.css";

const maintenanceEnabled = isStorefrontMaintenance();
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
      metadataBase: new URL(getSiteUrl()),
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
      description:
        "Натуральні фруктові чипси та смаколики DreamShop в Одесі.",
      icons,
      metadataBase: new URL(getSiteUrl()),
      openGraph: {
        description:
          "Натуральні фруктові чипси та смаколики DreamShop в Одесі.",
        locale: "uk_UA",
        siteName: "DreamShop",
        title: "DreamShop",
        type: "website",
      },
      robots: {
        follow: true,
        index: true,
      },
      title: "DreamShop",
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
      <body>{children}</body>
    </html>
  );
}
