import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Vocca',
    default: 'Vocca démos',
  },
  description: "Démonstration des cas d'usage Vocca - Agents conversationnels spécialisés pour le secteur médical",
  icons: {
    icon: "/favicon.webp",
    apple: "/favicon.webp",
  },
  openGraph: {
    title: 'Vocca démos',
    description: "Démonstration des cas d'usage Vocca - Agents conversationnels spécialisés pour le secteur médical",
    locale: 'fr_FR',
  },
  alternates: {
    languages: {
      'fr': '?lang=fr',
      'en': '?lang=en',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
