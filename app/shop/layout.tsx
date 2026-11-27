// app/shop/layout.tsx
import type { Metadata } from "next";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, ORG_ID, SITE_URL } from "@/app/lib/seo";

const TITLE = "Tibetan Learning Shop";
const DESCRIPTION =
  "Shop authentic Tibetan learning materials created by Loplao: My First 650 Tibetan Words (print & PDF), Tibetan Language Playing Cards, Proverbs Mugs, and Grammar Mugs.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/shop" },
  openGraph: {
    title: `${TITLE} | Loplao`,
    description: DESCRIPTION,
    url: `${SITE_URL}/shop`,
    images: [{ url: "/shop/book_print.png", alt: "My First 650 Tibetan Words by Loplao" }],
  },
  twitter: {
    title: `${TITLE} | Loplao`,
    description: DESCRIPTION,
    images: ["/shop/book_print.png"],
  },
};

const SHOP_JSON_LD = [
  buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Loplao Tibetan Language Learning Materials",
    url: `${SITE_URL}/shop`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Product",
          name: "My First 650 Tibetan Words (Print Paperback)",
          description:
            "Full-colour 137-page paperback vocabulary guide by Loplao organising 650 foundational Tibetan words with script, phonetics, English meanings, and example sentences.",
          sku: "first-650-print",
          image: [`${SITE_URL}/shop/book_print.png`],
          brand: { "@type": "Brand", name: "Loplao" },
          offers: {
            "@type": "Offer",
            price: "15.00",
            priceCurrency: "GBP",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/shop`,
            seller: { "@id": ORG_ID },
          },
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Product",
          name: "Tibetan Language Playing Cards",
          description:
            "Deck of 54 bespoke playing cards featuring Tibetan script characters, vocabulary words, and cultural illustrations.",
          sku: "playing-cards",
          image: [`${SITE_URL}/shop/cards1.png`, `${SITE_URL}/shop/cards2.png`],
          brand: { "@type": "Brand", name: "Loplao" },
          offers: {
            "@type": "Offer",
            price: "10.00",
            priceCurrency: "GBP",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/shop`,
            seller: { "@id": ORG_ID },
          },
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Product",
          name: "My First 650 Tibetan Words — E-book (Digital PDF)",
          description:
            "Illustrated 137-page digital PDF vocabulary guide by Loplao covering 650 essential Tibetan words with phonetics, meanings, and example sentences.",
          sku: "first-650-ebook",
          image: [`${SITE_URL}/shop/book_pdf.png`],
          brand: { "@type": "Brand", name: "Loplao" },
          offers: {
            "@type": "Offer",
            price: "10.00",
            priceCurrency: "GBP",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/shop`,
            seller: { "@id": ORG_ID },
          },
        },
      },
      {
        "@type": "ListItem",
        position: 4,
        item: {
          "@type": "Product",
          name: "Tibetan Proverbs Mug",
          description:
            "Ceramic study mug featuring classic Tibetan proverbs in Uchen script with phonetic pronunciation and English translations (11oz and 15oz, UK delivery).",
          sku: "proverbs-mug-11oz",
          image: [`${SITE_URL}/shop/proverbs_mug2.png`, `${SITE_URL}/shop/proverbs_mug1.png`],
          brand: { "@type": "Brand", name: "Loplao" },
          offers: {
            "@type": "AggregateOffer",
            lowPrice: "8.00",
            highPrice: "10.00",
            priceCurrency: "GBP",
            offerCount: 2,
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/shop`,
            seller: { "@id": ORG_ID },
          },
        },
      },
      {
        "@type": "ListItem",
        position: 5,
        item: {
          "@type": "Product",
          name: "Tibetan Grammar Mug",
          description:
            "Tibetan noun-case declension and verb conjugation cheat-sheet mug in Tibetan script and transliteration (11oz and 15oz, UK delivery).",
          sku: "grammar-mug-11oz",
          image: [`${SITE_URL}/shop/grammar_mug2.png`, `${SITE_URL}/shop/grammar_mug1.png`],
          brand: { "@type": "Brand", name: "Loplao" },
          offers: {
            "@type": "AggregateOffer",
            lowPrice: "8.00",
            highPrice: "10.00",
            priceCurrency: "GBP",
            offerCount: 2,
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/shop`,
            seller: { "@id": ORG_ID },
          },
        },
      },
    ],
  },
];

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={SHOP_JSON_LD} />
      {children}
    </>
  );
}
