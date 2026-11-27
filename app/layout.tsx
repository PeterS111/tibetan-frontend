import type { Metadata, Viewport } from "next";
import { Merriweather, Inter, Jomolhari } from "next/font/google";
import "./globals.css";
import ClerkClientProvider from "./ClerkClientProvider";
import { JsonLd } from "./components/seo/JsonLd";
import { ORG_ID, SITE_NAME, SITE_URL, WEBSITE_ID } from "./lib/seo";

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jomolhari = Jomolhari({
  weight: "400",
  variable: "--font-tibetan",
  subsets: ["tibetan"],
});

const DEFAULT_TITLE = "Loplao — Learn Tibetan Language & Culture Online";
const DEFAULT_DESCRIPTION =
  "Learn Tibetan script, audio, and conversation with Loplao — an Oxford CIC offering free online lessons, live Tibetan courses, books, and cultural programmes.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Loplao",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "Loplao",
    "Learn Tibetan",
    "Learn Tibetan UK",
    "Tibetan language course",
    "Learn Tibetan online",
    "Tibetan alphabet",
    "Tibetan script",
    "Oxford Tibetan",
    "Oxford Visitorship",
    "Tibetan books",
    "Classical Tibetan",
  ],
  authors: [{ name: "Loplao", url: SITE_URL }],
  creator: "Loplao",
  publisher: "Loplao CIC",
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icons/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/icons/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Loplao — Learn Tibetan Language & Culture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#0E2C4D",
};

const GLOBAL_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": ORG_ID,
      name: "Loplao",
      legalName: "Loplao CIC",
      alternateName: ["Learn Tibetan UK", "སློབ་སླའོ།", "EasyTibetan"],
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icons/icon-512.png`,
        width: 512,
        height: 512,
      },
      image: `${SITE_URL}/og-image.jpg`,
      description: DEFAULT_DESCRIPTION,
      foundingDate: "2019",
      founder: {
        "@type": "Person",
        name: "Tenzin Choephel Ju",
      },
      email: "loplao.academy@gmail.com",
      telephone: "+447856149455",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Oxford",
        addressRegion: "Oxfordshire",
        addressCountry: "GB",
      },
      identifier: {
        "@type": "PropertyValue",
        name: "UK Companies House CIC Registration Number",
        value: "14581119",
      },
      sameAs: [
        "https://www.instagram.com/easytibetan/",
        "https://www.facebook.com/TibEasy",
      ],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: "Loplao",
      alternateName: ["Learn Tibetan UK", "Loplao — Learn Tibetan"],
      inLanguage: "en-GB",
      publisher: { "@id": ORG_ID },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${merriweather.variable} ${inter.variable} ${jomolhari.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col font-sans bg-paper text-ink selection:bg-brand-light w-full max-w-[100vw] overflow-x-hidden">
        <JsonLd data={GLOBAL_JSON_LD} />
        <ClerkClientProvider>{children}</ClerkClientProvider>
      </body>
    </html>
  );
}
