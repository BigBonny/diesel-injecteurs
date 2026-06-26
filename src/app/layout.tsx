import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./CartContext";
import EmailCapturePopup from "@/components/EmailCapturePopup";
import CookieConsent from "@/components/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Injection Diesel - Pièces Auto & Turbo de Qualité",
  description: "Achetez des pièces auto et turbos de qualité au meilleur prix. Commande rapide et livraison rapide.",
  icons: {
    icon: [
      { url: "/images/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/images/favicon.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
  openGraph: {
    title: "Injection Diesel - Pièces Auto & Turbo de Qualité",
    description: "Turbos et injecteurs neufs et reconditionnés OEM. Garantie 2 ans, livraison 24-48h.",
    url: "https://diesel-turbo-injection.com",
    siteName: "Injection Diesel",
    images: [
      {
        url: "https://diesel-turbo-injection.com/images/favicon.png",
        width: 512,
        height: 512,
        alt: "Injection Diesel Logo",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Injection Diesel - Pièces Auto & Turbo de Qualité",
    description: "Turbos et injecteurs neufs et reconditionnés OEM. Garantie 2 ans, livraison 24-48h.",
    images: ["https://diesel-turbo-injection.com/images/favicon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://diesel-turbo-injection.com",
  },
  verification: {
    google: "i0kVhsF46nK9jJXAmH2IkztE4PPMcjuDRZp2bJW17pI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="google-site-verification" content="i0kVhsF46nK9jJXAmH2IkztE4PPMcjuDRZp2bJW17pI" />
        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),
                  dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KV6FGZ7L');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KV6FGZ7L"
            height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
        </noscript>
        <CartProvider>
          {children}
          <EmailCapturePopup />
          <CookieConsent />
        </CartProvider>
      </body>
    </html>
  );
}
