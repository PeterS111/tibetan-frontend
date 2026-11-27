// app/donate/layout.tsx
import type { Metadata } from "next";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, ORG_ID, SITE_URL } from "@/app/lib/seo";

const TITLE = "Support & Donate";
const DESCRIPTION =
  "Support Loplao CIC to keep Tibetan language and culture alive through free online lessons, scholarships, learning materials, and Oxford academic exchange.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/donate" },
  openGraph: {
    title: `${TITLE} | Loplao`,
    description: DESCRIPTION,
    url: `${SITE_URL}/donate`,
    images: [{ url: "/fable-potala.jpg", alt: "Support Loplao — Preserve Tibetan Language & Culture" }],
  },
  twitter: {
    title: `${TITLE} | Loplao`,
    description: DESCRIPTION,
    images: ["/fable-potala.jpg"],
  },
};

const DONATE_JSON_LD = [
  buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Donate", path: "/donate" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${SITE_URL}/donate`,
    name: "Support & Donate to Loplao",
    description: DESCRIPTION,
    about: { "@id": ORG_ID },
  },
];

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={DONATE_JSON_LD} />
      {children}
    </>
  );
}
