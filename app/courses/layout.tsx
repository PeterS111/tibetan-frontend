// app/courses/layout.tsx
import type { Metadata } from "next";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, ORG_ID, SITE_URL } from "@/app/lib/seo";

const TITLE = "Live Tibetan Courses";
const DESCRIPTION =
  "Join live Tibetan language courses on Zoom or in Oxford: Winter School, 2026 Intensive Summer School, 15-week Flexible Beginner lessons, and 1-to-1 private tuition.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/courses" },
  openGraph: {
    title: `${TITLE} | Loplao`,
    description: DESCRIPTION,
    url: `${SITE_URL}/courses`,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Loplao Live Tibetan Courses" }],
  },
  twitter: {
    title: `${TITLE} | Loplao`,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

const COURSES_JSON_LD = [
  buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Live Courses", path: "/courses" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Loplao Live Tibetan Language Courses",
    url: `${SITE_URL}/courses`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Course",
          name: "Tibetan Language Winter School (Online via Zoom)",
          description:
            "Long-term online Tibetan immersion from December to April for Beginner and Pre-Intermediate students with weekly core lessons and conversation labs.",
          url: `${SITE_URL}/courses?tab=winter`,
          provider: { "@id": ORG_ID },
          offers: {
            "@type": "Offer",
            price: "350",
            priceCurrency: "GBP",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/courses?tab=winter`,
          },
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Course",
          name: "2026 Intensive Tibetan Summer School (Zoom or Oxford)",
          description:
            "Two-week intensive Tibetan summer programme (27 July – 7 August 2026) for Beginner and Pre-Intermediate learners, available online via Zoom or in person in Oxford.",
          url: `${SITE_URL}/courses?tab=summer`,
          provider: { "@id": ORG_ID },
          offers: [
            {
              "@type": "Offer",
              name: "Online via Zoom",
              price: "350",
              priceCurrency: "GBP",
              availability: "https://schema.org/InStock",
              url: `${SITE_URL}/courses?tab=summer`,
            },
            {
              "@type": "Offer",
              name: "In Person in Oxford",
              price: "500",
              priceCurrency: "GBP",
              availability: "https://schema.org/InStock",
              url: `${SITE_URL}/courses?tab=summer`,
            },
          ],
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Course",
          name: "Flexible Online Tibetan Lessons (15-Week Beginner Cohort)",
          description:
            "15-week live Beginner cohort via Zoom scheduled around students' time zones, including weekly reading, grammar, and conversation sessions.",
          url: `${SITE_URL}/courses?tab=flexible`,
          provider: { "@id": ORG_ID },
          offers: {
            "@type": "Offer",
            price: "200",
            priceCurrency: "GBP",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/courses?tab=flexible`,
          },
        },
      },
      {
        "@type": "ListItem",
        position: 4,
        item: {
          "@type": "Course",
          name: "Private 1-to-1 Tibetan Classes & Text Consultation",
          description:
            "Personalised 1-to-1 Tibetan tuition on Zoom (free 30-min taster, 8-lesson and 10-lesson packages) plus specialist 60-minute Classical Tibetan text & research consultations.",
          url: `${SITE_URL}/courses?tab=private`,
          provider: { "@id": ORG_ID },
          offers: {
            "@type": "AggregateOffer",
            lowPrice: "0",
            highPrice: "275",
            priceCurrency: "GBP",
            offerCount: 4,
            url: `${SITE_URL}/courses?tab=private`,
          },
        },
      },
    ],
  },
];

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={COURSES_JSON_LD} />
      {children}
    </>
  );
}
