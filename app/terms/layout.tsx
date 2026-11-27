// app/terms/layout.tsx
import type { Metadata } from "next";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, SITE_URL } from "@/app/lib/seo";

const TITLE = "Terms of Service";
const DESCRIPTION =
  "Terms of Service governing educational use of the Loplao (Learn Tibetan UK) online learning platform, courses, and resources.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
  openGraph: {
    title: `${TITLE} | Loplao`,
    description: DESCRIPTION,
    url: `${SITE_URL}/terms`,
  },
};

const TERMS_JSON_LD = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Terms of Service", path: "/terms" },
]);

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={TERMS_JSON_LD} />
      {children}
    </>
  );
}
