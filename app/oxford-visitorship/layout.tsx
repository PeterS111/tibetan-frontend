// app/oxford-visitorship/layout.tsx
import type { Metadata } from "next";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, ORG_ID, SITE_URL } from "@/app/lib/seo";

const TITLE = "The Oxford Visitorship";
const DESCRIPTION =
  "Each year Loplao and SINI invite a traditionally trained Tibetan Buddhist scholar to Oxford, in collaboration with Oxford Tibetan and Himalayan Studies.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/oxford-visitorship" },
  openGraph: {
    title: `${TITLE} | Loplao`,
    description: DESCRIPTION,
    url: `${SITE_URL}/oxford-visitorship`,
    images: [{ url: "/oxford-visitorship-hero.jpg", alt: "The Oxford Tibetan Buddhist Visitorship" }],
  },
  twitter: {
    title: `${TITLE} | Loplao`,
    description: DESCRIPTION,
    images: ["/oxford-visitorship-hero.jpg"],
  },
};

const VISITORSHIP_JSON_LD = [
  buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Oxford Visitorship", path: "/oxford-visitorship" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    name: "The 2027 Oxford Tibetan Buddhist Visitorship",
    description:
      "Two-month academic residency at the Oxford Buddha Vihara in collaboration with Oxford Tibetan and Himalayan Studies and the Sarnath International Nyingma Institute (SINI).",
    startDate: "2027-04-23",
    endDate: "2027-06-19",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    url: `${SITE_URL}/oxford-visitorship`,
    image: [`${SITE_URL}/oxford-visitorship-hero.jpg`],
    location: {
      "@type": "Place",
      name: "Oxford Buddha Vihara & University of Oxford",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Oxford",
        addressRegion: "Oxfordshire",
        addressCountry: "GB",
      },
    },
    organizer: [
      { "@id": ORG_ID },
      {
        "@type": "Organization",
        name: "Sarnath International Nyingma Institute (SINI)",
      },
    ],
  },
];

export default function OxfordVisitorshipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={VISITORSHIP_JSON_LD} />
      {children}
    </>
  );
}
