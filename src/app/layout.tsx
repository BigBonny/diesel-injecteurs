import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./CartContext";

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
    icon: "/images/favicon.png",
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
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
