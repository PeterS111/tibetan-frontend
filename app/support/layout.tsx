// app/support/layout.tsx
import type { Metadata } from "next";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, ORG_ID, SITE_URL } from "@/app/lib/seo";

const TITLE = "Contact Us";
const DESCRIPTION =
  "Contact Loplao for Tibetan course enquiries, 1-to-1 private lessons, shop orders, technical support, or collaborations. Our team typically responds within 24 hours.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/support" },
  openGraph: {
    title: `${TITLE} | Loplao`,
    description: DESCRIPTION,
    url: `${SITE_URL}/support`,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Contact Loplao" }],
  },
  twitter: {
    title: `${TITLE} | Loplao`,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

const SUPPORT_JSON_LD = [
  buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/support" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${SITE_URL}/support`,
    name: "Contact Loplao",
    description: DESCRIPTION,
    mainEntity: { "@id": ORG_ID },
  },
];

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={SUPPORT_JSON_LD} />
      {children}
    </>
  );
}
