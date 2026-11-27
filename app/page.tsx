// app/page.tsx
import type { Metadata } from "next";
import { LandingRouter } from "./components/home/LandingRouter";
import { JsonLd } from "./components/seo/JsonLd";
import { ORG_ID, SITE_URL, WEBSITE_ID } from "./lib/seo";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: "Loplao — Learn Tibetan Language & Culture Online",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORG_ID },
      inLanguage: "en-GB",
    },
    {
      "@type": "Course",
      name: "Loplao Free Online Tibetan Course (Beginner 1 & Beginner 2)",
      description:
        "Learn Tibetan script from the 30 consonants and four vowels to everyday Tibetan conversation with native speaker audio, spaced repetition, and mastery checks.",
      url: `${SITE_URL}/#levels`,
      inLanguage: ["en", "bo"],
      isAccessibleForFree: true,
      provider: { "@id": ORG_ID },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "GBP",
        availability: "https://schema.org/InStock",
        url: SITE_URL,
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Do I need an account to start?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. You create a free account with an email address, and both published levels open in full straight after — no card and no fee.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need to read Tibetan already?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Level 1 begins with the script itself — the 30 consonants and four vowels — and each step ends with a mastery check before you move on.",
          },
        },
        {
          "@type": "Question",
          name: "Which levels are open?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Two of six. Beginner 1 covers the script and its sounds; Beginner 2 covers greetings, numbers and days, introductions and daily routine. Pre-Intermediate to Advanced are still being written.",
          },
        },
        {
          "@type": "Question",
          name: "Is there audio?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Every word, dialogue and drill in the published lessons can be played aloud, and any consonant can be heard by tapping it.",
          },
        },
        {
          "@type": "Question",
          name: "What do I need to learn on?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A phone, tablet or laptop with a browser — the lessons reflow to fit the screen. The App Store and Google Play listings are still to come.",
          },
        },
        {
          "@type": "Question",
          name: "How do I get in touch?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Email us at: loplao.academy@gmail.com",
          },
        },
      ],
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={HOME_JSON_LD} />
      <LandingRouter />
    </>
  );
}
