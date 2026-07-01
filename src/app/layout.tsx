import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./CartContext";
import EmailCapturePopup from "@/components/EmailCapturePopup";
import CookieConsent from "@/components/CookieConsent";
import StructuredData from "@/components/StructuredData";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e2a4a",
};

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
    template: "%s | Diesel Turbo Injection",
    default: "Diesel Turbo Injection - Turbo, Injecteur & Pompe Haute Pression",
  },
  description: "Spécialiste turbo, injecteur et pompe haute pression diesel reconditionnés. Échange standard, garantie 2 ans, livraison 24-48h, consigne remboursée.",
  keywords: ["turbo diesel", "injecteur diesel", "pompe haute pression", "échange standard", "turbo reconditionné", "injecteur Bosch", "pièces auto diesel", "CHRA", "consigne turbo"],
  authors: [{ name: "Diesel Turbo Injection" }],
  creator: "Diesel Turbo Injection",
  publisher: "Diesel Turbo Injection",
  metadataBase: new URL("https://diesel-turbo-injection.com"),
  icons: {
    icon: [
      { url: "/images/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/images/favicon.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
  openGraph: {
    title: "Diesel Turbo Injection - Turbo, Injecteur & Pompe Haute Pression",
    description: "Spécialiste turbo, injecteur et pompe haute pression diesel reconditionnés. Échange standard, garantie 2 ans, livraison 24-48h.",
    url: "/",
    siteName: "Diesel Turbo Injection",
    images: [
      {
        url: "/assets/logo.png",
        width: 1200,
        height: 630,
        alt: "Diesel Turbo Injection - Spécialiste pièces diesel",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diesel Turbo Injection - Turbo, Injecteur & Pompe Haute Pression",
    description: "Spécialiste turbo, injecteur et pompe haute pression diesel reconditionnés. Garantie 2 ans, livraison 24-48h.",
    images: ["/assets/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "vh77uDdWINwPZPCELbGTpoN6y66H8pReMusX8KxN3aA",
  },
  category: "automotive",
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
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <StructuredData />
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
