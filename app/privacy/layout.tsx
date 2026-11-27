// app/privacy/layout.tsx
import type { Metadata } from "next";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, SITE_URL } from "@/app/lib/seo";

const TITLE = "Privacy Policy";
const DESCRIPTION =
  "Privacy Policy for Loplao (Learn Tibetan UK): how we collect, use, and safeguard your account details and Tibetan learning progress.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: `${TITLE} | Loplao`,
    description: DESCRIPTION,
    url: `${SITE_URL}/privacy`,
  },
};

const PRIVACY_JSON_LD = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Privacy Policy", path: "/privacy" },
]);

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={PRIVACY_JSON_LD} />
      {children}
    </>
  );
}
