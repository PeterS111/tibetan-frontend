// app/about/layout.tsx
import type { Metadata } from "next";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, ORG_ID, SITE_URL } from "@/app/lib/seo";

const TITLE = "About Us";
const DESCRIPTION =
  "Founded at the University of Oxford in 2019, Loplao is a UK Community Interest Company promoting Tibetan language and culture worldwide through courses and digital tools.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `${TITLE} | Loplao`,
    description: DESCRIPTION,
    url: `${SITE_URL}/about`,
    images: [{ url: "/about_hero_monastery.jpg", alt: "About Loplao — Promoting Tibetan Language & Culture" }],
  },
  twitter: {
    title: `${TITLE} | Loplao`,
    description: DESCRIPTION,
    images: ["/about_hero_monastery.jpg"],
  },
};

const ABOUT_JSON_LD = [
  buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${SITE_URL}/about`,
    name: "About Loplao",
    description: DESCRIPTION,
    mainEntity: { "@id": ORG_ID },
    mentions: [
      {
        "@type": "Person",
        name: "Tenzin Choephel Ju",
        jobTitle: "Founder, Director & Teacher",
        worksFor: { "@id": ORG_ID },
      },
      {
        "@type": "Person",
        name: "Piotr Sawicki, PhD",
        jobTitle: "AI Specialist & Platform Architect",
        worksFor: { "@id": ORG_ID },
        sameAs: [
          "https://www.linkedin.com/in/piotr-sawicki-ai/",
          "https://www.kent.ac.uk/school-of-computing/people/3144",
        ],
      },
      {
        "@type": "Person",
        name: "Kunga Jampa",
        jobTitle: "Social Media Manager & Teacher",
        worksFor: { "@id": ORG_ID },
      },
    ],
  },
];

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={ABOUT_JSON_LD} />
      {children}
    </>
  );
}
