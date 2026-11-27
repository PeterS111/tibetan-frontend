// app/shop/page.tsx
"use client";


import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  X,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Truck,
  Tag,
  BookOpen,
  FileText,
  Layers,
  Coffee,
  Star,
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { SiteFooter } from "@/app/components/ui/SiteFooter";
import { Reveal } from "@/app/components/ui/Reveal";

type FilterCategory = "all" | "books" | "ebooks" | "cards" | "mugs";

interface ProductVariant {
  sku: string;
  sizeLabel: string;
  price: number;
  images: string[];
}

interface ShopDisplayProduct {
  cardId: string;
  name: string;
  tibetan: string;
  category: Exclude<FilterCategory, "all">;
  categoryLabel: string;
  badge: string;
  rating: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  ukOnly?: boolean;
  isDigital?: boolean;
  variants: ProductVariant[];
}

const DISPLAY_PRODUCTS: ShopDisplayProduct[] = [
  {
    cardId: "first-650-print-card",
    name: "My First 650 Tibetan Words",
    tibetan: "ངའི་ཆེས་ཐོག་མའི་བོད་ཀྱི་ཚིག་གསར་༦༥༠།",
    category: "books",
    categoryLabel: "Books",
    badge: "BESTSELLER",
    rating: "5.0",
    shortDesc:
      "Designed vocabulary guide by Loplao to help learners acquire foundational Tibetan terms.",
    fullDesc:
      "The full-colour printed paperback edition of 'My First 650 Tibetan Words' by Loplao. Organises 650 essential Tibetan words into visual word families with crisp Tibetan script, phonetic pronunciation, English meanings, and practical example sentences. Ships across the UK and internationally.",
    features: [
      "137 pages",
      "Audio companion",
      "Example sentences",
      "Vocabulary glossary",
    ],
    variants: [
      {
        sku: "first-650-print",
        sizeLabel: "Print Paperback",
        price: 15.0,
        images: ["/shop/book_print.png", "/shop/book_pdf.png"],
      },
    ],
  },
  {
    cardId: "playing-cards-card",
    name: "Tibetan Language Playing Cards",
    tibetan: "བོད་ཀྱི་ཏག་སེ།",
    category: "cards",
    categoryLabel: "Playing Cards",
    badge: "NEW",
    rating: "5.0",
    shortDesc:
      "A beautifully designed deck of 54 playing cards featuring Tibetan script characters, vocabulary and cultural motifs.",
    fullDesc:
      "Learn Tibetan numbers, court figures, vocabulary, and cultural motifs while playing your favourite card games. Presented in a collector's black-and-gold embossed box with bespoke Tibetan court card and Joker illustrations. Available for UK and international shipping.",
    features: [
      "54 cards",
      "Tibetan words on every card",
      "Cultural illustrations",
      "Vocabulary words",
    ],
    variants: [
      {
        sku: "playing-cards",
        sizeLabel: "Standard Deck",
        price: 10.0,
        images: [
          "/shop/cards1.png",
          "/shop/cards2.png",
          "/shop/cards4.png",
          "/shop/cards3.png",
        ],
      },
    ],
  },
  {
    cardId: "first-650-ebook-card",
    name: "My First 650 Tibetan Words — E-book",
    tibetan: "ངའི་ཆེས་ཐོག་མའི་བོད་ཀྱི་ཚིག་གསར་༦༥༠། (འཕྲུལ་དེབ།)",
    category: "ebooks",
    categoryLabel: "E-books",
    badge: "DIGITAL",
    rating: "5.0",
    isDigital: true,
    shortDesc:
      "Designed vocabulary guide by Loplao to help learners acquire foundational Tibetan terms. Digital edition.",
    fullDesc:
      "A thoughtfully illustrated digital vocabulary guide created by Tenzin Choephel & Kunga Jampa at Loplao. Organises 650 foundational Tibetan words into visual word-webs with Tibetan script, clear phonetic pronunciation, English meanings, and example sentences. Digital edition — zero shipping fees anywhere in the world.",
    features: [
      "137 pages",
      "PDF format",
      "Instant download",
      "Example sentences",
      "Vocabulary glossary",
    ],
    variants: [
      {
        sku: "first-650-ebook",
        sizeLabel: "Digital PDF",
        price: 10.0,
        images: ["/shop/book_pdf.png", "/shop/book_print.png"],
      },
    ],
  },
  {
    cardId: "proverbs-mug-card",
    name: "Tibetan Proverbs Mug",
    tibetan: "གཏམ་དཔེ་ཇ་ཕོར།",
    category: "mugs",
    categoryLabel: "Mugs",
    badge: "NEW",
    rating: "5.0",
    ukOnly: true,
    shortDesc:
      "Timeless Tibetan sayings with English translations and phonetics — a small way to keep the language alive over a cup of tea.",
    fullDesc:
      "Our Tibetan Proverbs Mug is more than just something to drink from — it is a daily way to keep the Tibetan language alive at your desk. Features classic Tibetan sayings (gtam dpe) in crisp Uchen script alongside phonetic pronunciation and English meaning, finished with a traditional red base trim. Delivered exclusively within the UK.",
    features: [
      "Tibetan proverbs",
      "English translations",
      "Phonetics guide",
      "Red base trim",
    ],
    variants: [
      {
        sku: "proverbs-mug-11oz",
        sizeLabel: "11oz",
        price: 8.0,
        images: [
          "/shop/proverbs_mug2.png",
          "/shop/proverbs_mug1.png",
          "/shop/proverbs_mug3.png",
          "/shop/proverbs_mug4.png",
        ],
      },
      {
        sku: "proverbs-mug-15oz",
        sizeLabel: "15oz",
        price: 10.0,
        images: [
          "/shop/proverbs_mug1.png",
          "/shop/proverbs_mug2.png",
          "/shop/proverbs_mug4.png",
          "/shop/proverbs_mug3.png",
        ],
      },
    ],
  },
  {
    cardId: "grammar-mug-card",
    name: "Tibetan Grammar Mug",
    tibetan: "བརྡ་སྤྲོད་ཇ་ཕོར།",
    category: "mugs",
    categoryLabel: "Mugs",
    badge: "NEW",
    rating: "5.0",
    ukOnly: true,
    shortDesc:
      "A noun-case declension cheat sheet in Tibetan script and transliteration, framed by a traditional key-pattern border.",
    fullDesc:
      "Keep essential Tibetan grammar right at your fingertips! Features Noun Cases / Declensions, an Ordinary vs. Honorific verb reference table, and full Past/Present/Future/Imperative verb conjugation examples with phonetics, framed by a traditional Tibetan key-pattern border. Delivered exclusively within the UK.",
    features: [
      "Noun cases table",
      "Tibetan + transliteration",
      "Traditional border",
      "Reference as you sip",
    ],
    variants: [
      {
        sku: "grammar-mug-11oz",
        sizeLabel: "11oz",
        price: 8.0,
        images: [
          "/shop/grammar_mug2.png",
          "/shop/grammar_mug1.png",
          "/shop/grammar_mug3.png",
          "/shop/grammar_mug4.png",
        ],
      },
      {
        sku: "grammar-mug-15oz",
        sizeLabel: "15oz",
        price: 10.0,
        images: [
          "/shop/grammar_mug1.png",
          "/shop/grammar_mug2.png",
          "/shop/grammar_mug4.png",
          "/shop/grammar_mug3.png",
        ],
      },
    ],
  },
];

interface FlatSkuMeta {
  id: string;
  name: string;
  price: number;
  image: string;
  ukOnly?: boolean;
  isDigital?: boolean;
}

const SKU_LOOKUP: Record<string, FlatSkuMeta> = {};
for (const prod of DISPLAY_PRODUCTS) {
  for (const v of prod.variants) {
    SKU_LOOKUP[v.sku] = {
      id: v.sku,
      name:
        prod.variants.length > 1
          ? `${prod.name} (${v.sizeLabel})`
          : prod.name,
      price: v.price,
      image: v.images[0],
      ukOnly: prod.ukOnly,
      isDigital: prod.isDigital,
    };
  }
}

interface CartItem {
  id: string;
  quantity: number;
}

const CART_STORAGE_KEY = "loplao_shop_cart_v1";

export default function ShopPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");

  // Per-card variant selection index (e.g. 0 = 11oz, 1 = 15oz)
  const [selectedVariantByCard, setSelectedVariantByCard] = useState<
    Record<string, number>
  >({});

  // Product Quick-View / Gallery Modal
  const [modalProduct, setModalProduct] = useState<ShopDisplayProduct | null>(
    null
  );
  const [modalVariantIdx, setModalVariantIdx] = useState(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [modalQty, setModalQty] = useState(1);

  // Checkout & Banner States
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderKind, setOrderKind] = useState<"physical" | "ebook" | "mixed">("physical");
  const [orderedItemSummary, setOrderedItemSummary] = useState<string[]>([]);
  const successBannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Pre-warm Render backend TLS connection so clicking Checkout responds faster
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wakeup`).catch(() => {});

    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) setCart(JSON.parse(saved));
    } catch {}

    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") {
      const sessionId = params.get("session_id");
      if (sessionId) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/verify-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        }).catch(() => {});
      }
      const kindParam = params.get("kind");
      if (kindParam === "ebook" || kindParam === "mixed" || kindParam === "physical") {
        setOrderKind(kindParam);
      }
      try {
        const savedSummary = sessionStorage.getItem("loplao_last_shop_order");
        if (savedSummary) {
          setOrderedItemSummary(JSON.parse(savedSummary));
          sessionStorage.removeItem("loplao_last_shop_order");
        }
      } catch {}

      setOrderSuccess(true);
      setCart([]);
      localStorage.removeItem(CART_STORAGE_KEY);
      window.history.replaceState({}, "", "/shop");

      setTimeout(() => {
        successBannerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } else if (params.get("canceled") === "1") {
      setIsCartOpen(true);
      window.history.replaceState({}, "", "/shop");
    }
  }, []);

  const saveCart = (next: CartItem[]) => {
    setCart(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
    }
  };

  const addToCart = (skuId: string, qty = 1) => {
    setCheckoutError(null);
    const existing = cart.find((c) => c.id === skuId);
    const next = existing
      ? cart.map((c) =>
          c.id === skuId
            ? { ...c, quantity: Math.min(c.quantity + qty, 50) }
            : c
        )
      : [...cart, { id: skuId, quantity: qty }];
    saveCart(next);
    setIsCartOpen(true);
  };

  const updateQty = (skuId: string, delta: number) => {
    const next = cart
      .map((c) =>
        c.id === skuId ? { ...c, quantity: c.quantity + delta } : c
      )
      .filter((c) => c.quantity > 0);
    saveCart(next);
  };

  const removeItem = (skuId: string) => {
    saveCart(cart.filter((c) => c.id !== skuId));
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const detailedCart = useMemo(() => {
    return cart
      .map((c) => {
        const meta = SKU_LOOKUP[c.id];
        return meta ? { ...meta, quantity: c.quantity } : null;
      })
      .filter(Boolean) as (FlatSkuMeta & { quantity: number })[];
  }, [cart]);

  const subtotal = detailedCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartHasMug = detailedCart.some((item) => item.ukOnly);
  const cartHasPhysical = detailedCart.some((item) => !item.isDigital);
  const deliveryFee = cartHasPhysical ? 5.5 : 0;
  const estimatedTotal = subtotal + deliveryFee;

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return DISPLAY_PRODUCTS;
    return DISPLAY_PRODUCTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const openQuickView = (product: ShopDisplayProduct) => {
    const currentVarIdx = selectedVariantByCard[product.cardId] ?? 0;
    setModalProduct(product);
    setModalVariantIdx(currentVarIdx);
    setActiveImageIdx(0);
    setModalQty(1);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckoutError(null);
    setIsCheckingOut(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/shop/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart,
            origin:
              typeof window !== "undefined" ? window.location.origin : undefined,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to start checkout.");
      if (data.checkout_url) {
        try {
          sessionStorage.setItem(
            "loplao_last_shop_order",
            JSON.stringify(detailedCart.map((i) => `${i.quantity}× ${i.name}`))
          );
        } catch {}
        window.location.href = data.checkout_url;
      }
    } catch (err: any) {
      setCheckoutError(err.message);
      setIsCheckingOut(false);
    }
  };

  const filterTabs: {
    id: FilterCategory;
    label: string;
    icon?: React.ReactNode;
  }[] = [
    { id: "all", label: "All" },
    { id: "books", label: "Books", icon: <BookOpen size={13} /> },
    { id: "ebooks", label: "E-books", icon: <FileText size={13} /> },
    { id: "cards", label: "Playing Cards", icon: <Layers size={13} /> },
    { id: "mugs", label: "Mugs", icon: <Coffee size={13} /> },
  ];

  const activeModalVariant = modalProduct
    ? modalProduct.variants[modalVariantIdx] || modalProduct.variants[0]
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-sans selection:bg-brand-light selection:text-brand-dark overflow-x-hidden">
      {/* ====================================================================
          1. FIXED TOP NAVIGATION BAR (WITH LIVE CART DRAWER BUTTON)
      ==================================================================== */}
      <nav className="fixed top-0 left-0 right-0 w-full z-40 bg-ink/95 backdrop-blur-md border-b border-white/10 text-white">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 group">
            <img
              src="/icon_t.png"
              onError={(e) => {
                e.currentTarget.src = "/icon.png";
              }}
              alt="Loplao Logo"
              className="w-10 h-10 object-contain brightness-0 invert opacity-95 group-hover:opacity-100 transition-opacity"
            />
            <div className="flex flex-col justify-center">
              <span className="font-tibetan text-base leading-none text-brand tracking-wide pb-1">
                སློབ་སླའོ།
              </span>
              <span className="w-full h-[1px] bg-white/30 my-0.5" />
              <span className="font-serif font-medium text-lg leading-none text-white pt-0.5">
                Loplao
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium text-white/75">
            <Link href="/#levels" className="hover:text-white transition-colors">
              Curriculum
            </Link>
            <Link href="/courses" className="hover:text-white transition-colors">
              Live Courses
            </Link>
            <Link
              href="/shop"
              className="text-brand font-semibold transition-colors"
            >
              Shop
            </Link>
            <Link href="/oxford-visitorship" className="hover:text-white transition-colors">
              Visitorship
            </Link>
            <Link href="/#faq" className="hover:text-white transition-colors">
              FAQ
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/support" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open shopping cart"
              className="relative px-3.5 py-2 rounded-lg border border-white/25 hover:border-brand hover:bg-white/5 text-white flex items-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingBag size={17} className="text-brand" />
              <span className="text-xs font-bold">{totalItemsCount}</span>
            </button>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="hidden sm:inline-block px-4 py-2 text-xs sm:text-sm font-medium text-white border border-white/30 hover:border-white hover:bg-white/10 rounded-lg transition-all cursor-pointer">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 text-xs sm:text-sm font-bold bg-brand hover:bg-brand-dark text-ink rounded-lg transition-all shadow-sm cursor-pointer">
                  Sign up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard">
                <button className="px-4 py-2 text-xs sm:text-sm font-bold bg-brand hover:bg-brand-dark text-ink rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
                  App <ArrowRight size={14} strokeWidth={2.5} />
                </button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* ====================================================================
          2. SHOP HERO BANNER
      ==================================================================== */}
      <header className="relative bg-ink text-white pt-32 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/about_classroom-JsxUlfTo.jpg"
            onError={(e) => {
              e.currentTarget.src = "/05_five_prefixes.jpg";
            }}
            alt="Loplao Learning Materials"
            className="w-full h-full object-cover object-center opacity-20 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/65" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
        </div>

        <Reveal className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-3">
            Tibetan Language Materials
          </div>

          <h1 className="font-serif font-normal text-4xl sm:text-5xl md:text-[56px] leading-[1.1] text-white mb-4 flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
            <span>The Shop</span>
            <span className="font-tibetan text-3xl sm:text-4xl md:text-[44px] text-brand leading-normal">
              ཚོང་ཁང་།
            </span>
          </h1>

          <p className="text-sm sm:text-base text-white/80 max-w-xl leading-relaxed">
            Beautifully crafted books, vocabulary cards, and mugs to enrich your
            Tibetan language journey.
          </p>
        </Reveal>

        {/* Subtle 5-Element Tibetan Accent Strip */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] grid grid-cols-5 z-10">
          <div className="bg-[#1E4E8C]" />
          <div className="bg-[#FAF6EC]" />
          <div className="bg-brand" />
          <div className="bg-[#1E7A46]" />
          <div className="bg-[#9E2A2B]" />
        </div>
      </header>

      {/* ====================================================================
          3. WHITE CATEGORY FILTER BAR
      ==================================================================== */}
      <div className="bg-surface border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-medium text-ink-muted mr-1">
            Filter by:
          </span>
          {filterTabs.map((tab) => {
            const active = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  active
                    ? "bg-ink text-white font-semibold shadow-2xs"
                    : "bg-surface border border-border-subtle text-ink-light hover:border-ink hover:text-ink"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ====================================================================
          4. PRODUCT GRID
      ==================================================================== */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 pb-20">
        <link rel="preconnect" href="https://checkout.stripe.com" />

        {orderSuccess && (
          <div
            ref={successBannerRef}
            className="mb-10 bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex items-start gap-4 text-emerald-900 shadow-xs animate-in fade-in duration-300"
          >
            <CheckCircle2
              size={26}
              className="text-emerald-600 shrink-0 mt-0.5"
            />
            <div>
              <h2 className="font-serif font-normal text-2xl text-emerald-950 mb-1">
                ཐུགས་རྗེ་ཆེ། — Thank you for your order!
              </h2>
              {orderedItemSummary.length > 0 && (
                <div className="flex flex-wrap gap-1.5 my-2">
                  {orderedItemSummary.map((label) => (
                    <span
                      key={label}
                      className="bg-white/80 border border-emerald-200 text-emerald-900 text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-sm text-emerald-800 leading-relaxed">
                {orderKind === "ebook" ? (
                  <>
                    Your payment has been confirmed and a receipt has been sent
                    to your email. We will deliver your digital copy of{" "}
                    <strong>My First 650 Tibetan Words (PDF)</strong> straight
                    to your inbox.
                  </>
                ) : orderKind === "mixed" ? (
                  <>
                    Your payment has been confirmed and a receipt has been sent
                    to your email. Your physical items are now being prepared
                    for dispatch, and your digital copy of{" "}
                    <strong>My First 650 Tibetan Words (PDF)</strong> will be
                    delivered straight to your inbox.
                  </>
                ) : (
                  <>
                    Your payment has been confirmed and a receipt has been sent
                    to your email. Our team has received your delivery details
                    and is preparing your order for dispatch.
                  </>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Product Count + Subtle Shipping Note */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div className="text-xs text-ink-muted">
            Showing {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </div>

          {(activeCategory === "all" || activeCategory === "mugs") && (
            <div className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
              <Truck size={13} className="text-brand-dark shrink-0" />
              <span>
                Individual mugs ship within the UK · Books &amp; playing cards
                ship worldwide (
                <Link
                  href="/support"
                  className="underline decoration-brand underline-offset-2 hover:text-ink"
                >
                  50+ bulk mugs worldwide
                </Link>
                )
              </span>
            </div>
          )}
        </div>

        {/* 3-Column Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProducts.map((product, idx) => {
            const varIdx = selectedVariantByCard[product.cardId] ?? 0;
            const currentVariant =
              product.variants[varIdx] || product.variants[0];
            const hasSizes = product.variants.length > 1;

            return (
              <Reveal
                key={`${activeCategory}-${product.cardId}`}
                delay={(idx % 3) * 90}
                className="h-full flex"
              >
                <div className="w-full group bg-surface border border-border-subtle hover:border-brand rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col">
                {/* Product Image + Badges */}
                <button
                  type="button"
                  onClick={() => openQuickView(product)}
                  className="relative aspect-[4/3] w-full bg-white overflow-hidden cursor-pointer border-b border-border-subtle/60"
                >
                  <img
                    src={currentVariant.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top-Left Gold Badge */}
                  <span className="absolute top-3 left-3 bg-brand text-ink text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-2xs">
                    {product.badge}
                  </span>

                  {/* Top-Right White Category Pill */}
                  <span className="absolute top-3 right-3 bg-surface/95 text-ink-light text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-border-subtle shadow-2xs">
                    {product.categoryLabel}
                  </span>
                </button>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  {/* Tibetan Script Subtitle */}
                  <div className="font-tibetan text-[15px] text-brand-dark leading-relaxed mb-1">
                    {product.tibetan}
                  </div>

                  {/* Product Title */}
                  <button
                    type="button"
                    onClick={() => openQuickView(product)}
                    className="text-left cursor-pointer"
                  >
                    <h2 className="font-serif font-normal text-xl text-ink group-hover:text-brand-dark transition-colors mb-2 leading-snug">
                      {product.name}
                    </h2>
                  </button>

                  {/* Short Description */}
                  <p className="text-xs text-ink-light leading-relaxed mb-4">
                    {product.shortDesc}
                  </p>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {product.features.map((feat) => (
                      <span
                        key={feat}
                        className="bg-[#EEF4FA] text-ink-light text-[10px] font-medium px-2.5 py-1 rounded-md"
                      >
                        {feat}
                      </span>
                    ))}
                    {product.ukOnly && (
                      <span className="bg-brand-light/70 text-brand-dark text-[10px] font-semibold px-2.5 py-1 rounded-md">
                        UK delivery
                      </span>
                    )}
                  </div>

                  {/* 5-Star Rating */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <div
                      className="flex items-center gap-0.5 text-brand"
                      aria-label={`${product.rating} out of 5 stars`}
                    >
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className="fill-brand text-brand"
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-ink-muted font-medium">
                      ({product.rating})
                    </span>
                  </div>

                  {/* Size Selector (for Mugs: 11oz / 15oz) */}
                  {hasSizes && (
                    <div className="mb-4">
                      <div className="text-[9px] font-bold uppercase tracking-widest text-ink-muted mb-1.5">
                        Size
                      </div>
                      <div className="flex items-center gap-2">
                        {product.variants.map((v, idx) => {
                          const isSelected = varIdx === idx;
                          return (
                            <button
                              key={v.sku}
                              type="button"
                              onClick={() =>
                                setSelectedVariantByCard((prev) => ({
                                  ...prev,
                                  [product.cardId]: idx,
                                }))
                              }
                              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-ink text-white shadow-2xs"
                                  : "bg-surface border border-border-subtle text-ink-light hover:border-ink"
                              }`}
                            >
                              {v.sizeLabel}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Bottom Price + Add to Cart Row */}
                  <div className="mt-auto pt-4 border-t border-border-subtle flex items-center justify-between gap-3">
                    <span className="font-serif text-xl text-ink">
                      £{currentVariant.price.toFixed(2)}
                    </span>

                    <button
                      type="button"
                      onClick={() => addToCart(currentVariant.sku, 1)}
                      className="bg-ink hover:bg-ink-light text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <ShoppingCart size={13} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </main>

      {/* ====================================================================
          5. DARK NAVY TRUST BAND ABOVE SHARED SITE FOOTER
      ==================================================================== */}
      <section className="bg-ink text-white py-14 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <Reveal delay={0} className="flex flex-col items-center">
            <BookOpen size={24} className="text-brand mb-3" strokeWidth={1.75} />
            <h3 className="font-serif font-normal text-lg text-white mb-1">
              Authentic Materials
            </h3>
            <p className="text-xs text-white/65 leading-relaxed max-w-[230px]">
              Created by Tibetan language experts and artists.
            </p>
          </Reveal>

          <Reveal delay={100} className="flex flex-col items-center">
            <Tag size={24} className="text-brand mb-3" strokeWidth={1.75} />
            <h3 className="font-serif font-normal text-lg text-white mb-1">
              Fair Pricing
            </h3>
            <p className="text-xs text-white/65 leading-relaxed max-w-[230px]">
              Quality materials at accessible prices
            </p>
          </Reveal>

          <Reveal delay={200} className="flex flex-col items-center">
            <ShoppingCart
              size={24}
              className="text-brand mb-3"
              strokeWidth={1.75}
            />
            <h3 className="font-serif font-normal text-lg text-white mb-1">
              Easy Checkout
            </h3>
            <p className="text-xs text-white/65 leading-relaxed max-w-[230px]">
              Secure payment and fast delivery
            </p>
          </Reveal>
        </div>
      </section>

      {/* Subtle 5-Element Tibetan Divider Above Footer */}
      <div className="h-[3px] w-full grid grid-cols-5">
        <div className="bg-[#1E4E8C]" />
        <div className="bg-[#FAF6EC]" />
        <div className="bg-brand" />
        <div className="bg-[#1E7A46]" />
        <div className="bg-[#9E2A2B]" />
      </div>

      {/* ====================================================================
          6. PRODUCT QUICK-VIEW & MULTI-PHOTO GALLERY MODAL
      ==================================================================== */}
      {modalProduct && activeModalVariant && (
        <div
          className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setModalProduct(null)}
        >
          <div
            className="bg-paper border border-border-strong rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalProduct(null)}
              aria-label="Close product details"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface border border-border-subtle flex items-center justify-center text-ink-muted hover:text-ink cursor-pointer z-10"
            >
              <X size={18} />
            </button>

            {/* Left: Main Photo + Thumbnails */}
            <div className="md:col-span-6">
              <div className="aspect-square rounded-2xl bg-white border border-border-subtle overflow-hidden mb-3">
                <img
                  src={
                    activeModalVariant.images[activeImageIdx] ||
                    activeModalVariant.images[0]
                  }
                  alt={modalProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {activeModalVariant.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {activeModalVariant.images.map((imgUrl, idx) => (
                    <button
                      key={imgUrl}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-white ${
                        activeImageIdx === idx
                          ? "border-brand scale-[1.02]"
                          : "border-border-subtle opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info + Size + Quantity + Add to Cart */}
            <div className="md:col-span-6 flex flex-col justify-center">
              <span className="inline-block w-fit bg-brand-light text-brand-dark border border-brand/30 text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full mb-2">
                {modalProduct.badge}
              </span>

              <div className="font-tibetan text-xl text-brand-dark mb-1">
                {modalProduct.tibetan}
              </div>

              <h2 className="font-serif font-normal text-2xl sm:text-3xl text-ink mb-2">
                {modalProduct.name}
              </h2>

              <div className="font-serif text-2xl text-ink mb-4">
                £{activeModalVariant.price.toFixed(2)}
              </div>

              <p className="text-sm text-ink-light leading-relaxed mb-5">
                {modalProduct.fullDesc}
              </p>

              {/* Modal Size Toggle for Mugs */}
              {modalProduct.variants.length > 1 && (
                <div className="mb-5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-2">
                    Size
                  </div>
                  <div className="flex items-center gap-2">
                    {modalProduct.variants.map((v, idx) => (
                      <button
                        key={v.sku}
                        type="button"
                        onClick={() => {
                          setModalVariantIdx(idx);
                          setActiveImageIdx(0);
                          setSelectedVariantByCard((prev) => ({
                            ...prev,
                            [modalProduct.cardId]: idx,
                          }));
                        }}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          modalVariantIdx === idx
                            ? "bg-ink text-white"
                            : "bg-surface border border-border-strong text-ink-light hover:border-ink"
                        }`}
                      >
                        {v.sizeLabel} — £{v.price.toFixed(2)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-2">
                  Quantity
                </div>
                <div className="inline-flex items-center border border-border-strong rounded-full bg-surface px-2 py-1 gap-4">
                  <button
                    type="button"
                    onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-full hover:bg-paper flex items-center justify-center text-ink cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold text-ink min-w-[20px] text-center">
                    {modalQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setModalQty((q) => Math.min(50, q + 1))}
                    className="w-7 h-7 rounded-full hover:bg-paper flex items-center justify-center text-ink cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  addToCart(activeModalVariant.sku, modalQty);
                  setModalProduct(null);
                }}
                className="w-full bg-ink hover:bg-ink-light text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart size={15} />
                <span>
                  Add to Cart — £{(activeModalVariant.price * modalQty).toFixed(2)}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          7. SLIDE-OUT RIGHT SHOPPING CART DRAWER
      ==================================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-ink/50 backdrop-blur-xs"
            onClick={() => setIsCartOpen(false)}
          />
          <aside className="relative z-10 w-full max-w-md bg-surface h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between">
              <div className="font-serif text-xl text-ink">
                Cart{" "}
                <span className="text-sm font-sans text-ink-muted">
                  ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-ink-muted hover:text-ink cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              {detailedCart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <ShoppingBag
                    size={40}
                    className="text-border-strong mb-4"
                    strokeWidth={1.5}
                  />
                  <p className="font-serif text-xl text-ink mb-1">
                    Your cart is empty
                  </p>
                  <p className="text-xs text-ink-muted mb-6">
                    Explore our Tibetan books, playing cards, and study mugs.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="bg-brand hover:bg-brand-dark text-ink font-bold text-xs px-6 py-3 rounded-full cursor-pointer"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                detailedCart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-5 border-b border-border-subtle"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover border border-border-subtle bg-white shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-base text-ink leading-snug">
                          {item.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove item"
                          className="text-ink-muted hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className="text-xs text-ink-muted mb-3">
                        £{item.price.toFixed(2)} each
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center border border-border-strong rounded-lg px-2 py-1 gap-3 bg-paper/60">
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, -1)}
                            className="text-ink-light hover:text-ink cursor-pointer"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="text-xs font-bold text-ink min-w-[16px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, 1)}
                            className="text-ink-light hover:text-ink cursor-pointer"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <div className="font-bold text-sm text-ink">
                          £{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {detailedCart.length > 0 && (
              <div className="p-6 border-t border-border-subtle bg-paper/70 space-y-4">
                {cartHasMug && (
                  <div className="flex items-start gap-2 text-[11px] text-amber-900 bg-brand-light/70 border border-brand/30 rounded-xl px-3.5 py-2.5">
                    <Truck
                      size={14}
                      className="shrink-0 mt-0.5 text-brand-dark"
                    />
                    <span>
                      Cart includes a mug — shipping address at checkout will be
                      restricted to the{" "}
                      <strong>United Kingdom (£5.50)</strong>.
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-ink-muted">
                  <Tag size={13} className="text-brand-dark" />
                  <span>Promo codes can be entered on the checkout screen.</span>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-border-subtle text-sm">
                  <div className="flex items-center justify-between text-ink-light">
                    <span>Subtotal</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>
                  {cartHasPhysical && (
                    <div className="flex items-center justify-between text-ink-light">
                      <span>Delivery (UK)</span>
                      <span>£{deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1.5 border-t border-border-subtle/70">
                    <span className="font-serif text-lg text-ink">Total</span>
                    <span className="font-serif text-2xl text-ink">
                      £{estimatedTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
                {!cartHasMug && cartHasPhysical && (
                  <p className="text-[11px] text-ink-muted">
                    International shipping (£9.95) can also be selected at checkout.
                  </p>
                )}

                {checkoutError && (
                  <div className="flex items-start gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-ink hover:bg-ink-light text-white font-bold py-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Redirecting
                      to checkout...
                    </>
                  ) : (
                    "Checkout"
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-ink-muted pt-1">
                  <Lock size={12} />
                  <span>
                    Secure Checkout · Apple Pay, PayPal, Google Pay &amp; Card
                  </span>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* ====================================================================
          8. SHARED SITE FOOTER (UNCHANGED)
      ==================================================================== */}
      <SiteFooter />
    </div>
  );
}