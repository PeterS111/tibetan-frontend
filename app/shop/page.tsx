// app/shop/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingBag,
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
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";

interface ShopProduct {
  id: string;
  name: string;
  tibetan?: string;
  price: number;
  category: "mugs" | "books" | "cards";
  badge?: string;
  ukOnly?: boolean;
  isDigital?: boolean;
  images: string[];
  shortDesc: string;
  fullDesc: string;
}

const PRODUCTS: ShopProduct[] = [
  {
    id: "proverbs-mug-11oz",
    name: "Proverbs Mug (11oz)",
    tibetan: "གཏམ་དཔེ་ཇ་ཕོར།",
    price: 8.0,
    category: "mugs",
    ukOnly: true,
    images: [
      "/shop/proverbs_mug2.png",
      "/shop/proverbs_mug1.png",
      "/shop/proverbs_mug3.png",
      "/shop/proverbs_mug4.png",
    ],
    shortDesc:
      "Classic 11oz ceramic mug printed with traditional Tibetan proverbs, phonetics, and English translations.",
    fullDesc:
      "Our Tibetan Proverbs Mug is more than just something to drink from — it is a daily way to keep the Tibetan language alive at your desk. Features classic Tibetan sayings (gtam dpe) in crisp Uchen script alongside phonetic pronunciation and English meaning. Delivered exclusively within the UK.",
  },
  {
    id: "proverbs-mug-15oz",
    name: "Proverbs Mug (15oz)",
    tibetan: "གཏམ་དཔེ་ཇ་ཕོར།",
    price: 10.0,
    category: "mugs",
    ukOnly: true,
    images: [
      "/shop/proverbs_mug1.png",
      "/shop/proverbs_mug2.png",
      "/shop/proverbs_mug4.png",
      "/shop/proverbs_mug3.png",
    ],
    shortDesc:
      "Large 15oz ceramic mug featuring traditional Tibetan proverbs in Tibetan script, phonetics, and English.",
    fullDesc:
      "A generous 15oz edition of our Tibetan Proverbs Mug — ideal for long study sessions with butter tea or coffee. Printed all around with authentic Tibetan proverbs, clear phonetic guides, and English translations. Delivered exclusively within the UK.",
  },
  {
    id: "grammar-mug-11oz",
    name: "Grammar Mug (11oz)",
    tibetan: "བརྡ་སྤྲོད་ཇ་ཕོར།",
    price: 8.0,
    category: "mugs",
    ukOnly: true,
    images: [
      "/shop/grammar_mug2.png",
      "/shop/grammar_mug1.png",
      "/shop/grammar_mug3.png",
      "/shop/grammar_mug4.png",
    ],
    shortDesc:
      "11oz study mug featuring Tibetan noun cases, ordinary vs. honorific verbs, and verb conjugations.",
    fullDesc:
      "Keep essential Tibetan grammar right at your fingertips! Features Noun Cases / Declensions, an Ordinary vs. Honorific verb reference table, and full Past/Present/Future/Imperative verb conjugation examples with phonetics. Delivered exclusively within the UK.",
  },
  {
    id: "grammar-mug-15oz",
    name: "Grammar Mug (15oz)",
    tibetan: "བརྡ་སྤྲོད་ཇ་ཕོར།",
    price: 10.0,
    category: "mugs",
    ukOnly: true,
    images: [
      "/shop/grammar_mug1.png",
      "/shop/grammar_mug2.png",
      "/shop/grammar_mug4.png",
      "/shop/grammar_mug3.png",
    ],
    shortDesc:
      "Large 15oz reference mug with Tibetan declensions, honorific verbs, and tense conjugation tables.",
    fullDesc:
      "The larger 15oz scholar's edition of our Tibetan Grammar Mug. Includes comprehensive tables for Tibetan noun cases, everyday ordinary & honorific verbs, and complete verb tense conjugations. Delivered exclusively within the UK.",
  },
  {
    id: "first-650-ebook",
    name: "My First 650 Tibetan Words (E-book)",
    tibetan: "ངའི་ཆེས་ཐོག་མའི་ཚིག་གསར།",
    price: 10.0,
    category: "books",
    badge: "Best Seller",
    isDigital: true,
    images: ["/shop/book_pdf.png", "/shop/book_print.png"],
    shortDesc:
      "Illustrated digital vocabulary guide designed by Loplao to help learners acquire 650 foundational Tibetan words.",
    fullDesc:
      "A thoughtfully illustrated digital vocabulary book created by Tenzin Choephel & Kunga Jampa at Loplao. Organises 650 essential Tibetan words into visual word-webs with Tibetan script, clear phonetic pronunciation, English meanings, and example sentences. Digital edition — zero shipping fees anywhere in the world.",
  },
  {
    id: "playing-cards",
    name: "Tibetan Language Playing Cards",
    tibetan: "བོད་ཀྱི་ཏག་སེ།",
    price: 10.0,
    category: "cards",
    badge: "Most Popular",
    images: [
      "/shop/cards1.png",
      "/shop/cards2.png",
      "/shop/cards4.png",
      "/shop/cards3.png",
    ],
    shortDesc:
      "Custom-illustrated deck of 54 playing cards featuring traditional Tibetan artwork and script.",
    fullDesc:
      "Learn Tibetan numbers, court figures, and cultural motifs while playing your favourite card games. Presented in a collector's black-and-gold embossed box with bespoke Tibetan court card and Joker illustrations. Available for UK and international shipping.",
  },
  {
    id: "first-650-print",
    name: "My First 650 Tibetan Words (Print Book)",
    tibetan: "ངའི་ཆེས་ཐོག་མའི་ཚིག་གསར།",
    price: 15.0,
    category: "books",
    badge: "New",
    images: ["/shop/book_print.png", "/shop/book_pdf.png"],
    shortDesc:
      "Full-colour printed paperback edition of Loplao's visual guide to 650 foundational Tibetan words.",
    fullDesc:
      "The physical full-colour print edition of 'My First 650 Tibetan Words' by Loplao. Features visual word families, Tibetan script, phonetic transcriptions, and practical example sentences to build a strong vocabulary foundation. Ships across the UK and internationally.",
  },
];

interface CartItem {
  id: string;
  quantity: number;
}

const CART_STORAGE_KEY = "loplao_shop_cart_v1";

export default function ShopPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<
    "all" | "mugs" | "books" | "cards"
  >("all");
  const [sortBy, setSortBy] = useState<"recommended" | "price-asc" | "price-desc">(
    "recommended"
  );

  // Product Quick-View / Gallery Modal
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [modalQty, setModalQty] = useState(1);

  // Checkout & Banner States
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Load Cart & Check URL Return Params
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) setCart(JSON.parse(saved));
    } catch {}

    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") {
      setOrderSuccess(true);
      setCart([]);
      localStorage.removeItem(CART_STORAGE_KEY);
    } else if (params.get("canceled") === "1") {
      setIsCartOpen(true);
    }
  }, []);

  const saveCart = (next: CartItem[]) => {
    setCart(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
    }
  };

  const addToCart = (productId: string, qty = 1) => {
    setCheckoutError(null);
    const existing = cart.find((c) => c.id === productId);
    const next = existing
      ? cart.map((c) =>
          c.id === productId
            ? { ...c, quantity: Math.min(c.quantity + qty, 50) }
            : c
        )
      : [...cart, { id: productId, quantity: qty }];
    saveCart(next);
    setIsCartOpen(true);
  };

  const updateQty = (productId: string, delta: number) => {
    const next = cart
      .map((c) =>
        c.id === productId ? { ...c, quantity: c.quantity + delta } : c
      )
      .filter((c) => c.quantity > 0);
    saveCart(next);
  };

  const removeItem = (productId: string) => {
    saveCart(cart.filter((c) => c.id !== productId));
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const detailedCart = useMemo(() => {
    return cart
      .map((c) => {
        const product = PRODUCTS.find((p) => p.id === c.id);
        return product ? { ...product, quantity: c.quantity } : null;
      })
      .filter(Boolean) as (ShopProduct & { quantity: number })[];
  }, [cart]);

  const subtotal = detailedCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartHasMug = detailedCart.some((item) => item.ukOnly);

  const filteredProducts = useMemo(() => {
    const list =
      activeCategory === "all"
        ? [...PRODUCTS]
        : PRODUCTS.filter((p) => p.category === activeCategory);

    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [activeCategory, sortBy]);

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
        window.location.href = data.checkout_url;
      }
    } catch (err: any) {
      setCheckoutError(err.message);
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-brand-light selection:text-brand-dark overflow-x-hidden">
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

          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-white/75">
            <Link href="/" className="hover:text-white transition-colors">
              Home
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
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/support" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Cart Trigger Button */}
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
          2. SHOP HERO BANNER + UK MUG DELIVERY NOTICE
      ==================================================================== */}
      <header className="relative bg-ink text-white pt-32 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        <img
          src="/motif_mandala_gold.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-20 -top-16 w-80 h-80 object-contain opacity-[0.06]"
        />

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <img
              src="/motif_pecha_gold.png"
              alt=""
              className="w-5 h-5 object-contain"
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
              Loplao Learning Store
            </span>
          </div>

          <h1 className="font-serif font-normal text-4xl sm:text-5xl md:text-6xl text-white mb-5">
            Tibetan Books &amp; Learning Materials
          </h1>

          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
            Thoughtfully crafted vocabulary books, traditional playing cards, and
            study mugs designed by Loplao to bring Tibetan into everyday life.
          </p>

          {/* Shipping Notice Pill Box */}
          <div className="max-w-2xl mx-auto bg-white/10 border border-brand/40 rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-brand-light leading-relaxed flex items-start sm:items-center justify-center gap-3 text-left sm:text-center">
            <Truck size={18} className="text-brand shrink-0 mt-0.5 sm:mt-0" />
            <span>
              Our individual mugs are currently available for delivery{" "}
              <strong className="text-white">exclusively within the UK</strong>.
              For international retail partners, bespoke bulk orders of 50 mugs
              or more can be arranged worldwide via{" "}
              <Link
                href="/support"
                className="underline text-brand hover:text-white"
              >
                our contact page
              </Link>
              .
            </span>
          </div>
        </div>
      </header>

      {/* ====================================================================
          3. FILTER BAR & PRODUCT GRID
      ==================================================================== */}
      <main className="max-w-6xl mx-auto px-6 py-14 pb-24">
        {/* Order Success Confirmation Banner */}
        {orderSuccess && (
          <div className="mb-10 bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex items-start gap-4 text-emerald-900 shadow-xs">
            <CheckCircle2
              size={26}
              className="text-emerald-600 shrink-0 mt-0.5"
            />
            <div>
              <h2 className="font-serif font-normal text-2xl text-emerald-950 mb-1">
                ཐུགས་རྗེ་ཆེ། — Thank you for your order!
              </h2>
              <p className="text-sm text-emerald-800 leading-relaxed">
                Your payment has been confirmed and a receipt has been sent to
                your email. If your order included the{" "}
                <strong>650 Tibetan Words E-book</strong>, we will deliver your
                digital copy straight to your inbox.
              </p>
            </div>
          </div>
        )}

        {/* Category Pills + Sort Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-border-subtle">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: `All Products (${PRODUCTS.length})` },
              { id: "books", label: "Language Books" },
              { id: "mugs", label: "Study Mugs (UK)" },
              { id: "cards", label: "Playing Cards" },
            ].map((tab) => {
              const active = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    active
                      ? "bg-ink text-white shadow-xs"
                      : "bg-surface border border-border-subtle text-ink-light hover:border-brand"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-ink-muted font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-surface border border-border-subtle rounded-xl px-3.5 py-2 text-xs font-bold text-ink outline-none focus:border-brand cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* 7-Item Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-surface border border-border-subtle hover:border-brand rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              {/* Clickable Image Container */}
              <button
                type="button"
                onClick={() => {
                  setSelectedProduct(product);
                  setActiveImageIdx(0);
                  setModalQty(1);
                }}
                className="relative aspect-square w-full bg-white overflow-hidden cursor-pointer"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.badge && (
                  <span className="absolute top-3.5 left-3.5 bg-ink text-brand text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                    {product.badge}
                  </span>
                )}
                {product.ukOnly && (
                  <span className="absolute bottom-3 right-3 bg-paper/95 text-ink text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-border-subtle">
                    UK Delivery Only
                  </span>
                )}
                {product.isDigital && (
                  <span className="absolute bottom-3 right-3 bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-200">
                    Instant Digital Edition
                  </span>
                )}
              </button>

              {/* Card Details */}
              <div className="p-6 flex-1 flex flex-col">
                {product.tibetan && (
                  <div className="font-tibetan text-lg text-brand-dark leading-normal mb-0.5">
                    {product.tibetan}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedProduct(product);
                    setActiveImageIdx(0);
                    setModalQty(1);
                  }}
                  className="text-left cursor-pointer"
                >
                  <h3 className="font-serif font-normal text-xl text-ink group-hover:text-brand-dark transition-colors mb-1.5">
                    {product.name}
                  </h3>
                </button>

                <p className="text-xs text-ink-light leading-relaxed mb-5 flex-1">
                  {product.shortDesc}
                </p>

                <div className="pt-4 border-t border-border-subtle flex items-center justify-between gap-3">
                  <span className="font-serif text-2xl text-ink">
                    £{product.price.toFixed(2)}
                  </span>

                  <button
                    type="button"
                    onClick={() => addToCart(product.id, 1)}
                    className="bg-brand hover:bg-brand-dark text-ink font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Plus size={14} strokeWidth={2.5} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ====================================================================
          4. PRODUCT QUICK-VIEW & MULTI-PHOTO GALLERY MODAL
      ==================================================================== */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-paper border border-border-strong rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close product details"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface border border-border-subtle flex items-center justify-center text-ink-muted hover:text-ink cursor-pointer z-10"
            >
              <X size={18} />
            </button>

            {/* Left: Main Photo + Thumbnails */}
            <div className="md:col-span-6">
              <div className="aspect-square rounded-2xl bg-white border border-border-subtle overflow-hidden mb-3">
                <img
                  src={selectedProduct.images[activeImageIdx]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {selectedProduct.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {selectedProduct.images.map((imgUrl, idx) => (
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

            {/* Right: Product Info + Quantity + Add to Cart */}
            <div className="md:col-span-6 flex flex-col justify-center">
              {selectedProduct.badge && (
                <span className="inline-block w-fit bg-brand-light text-brand-dark border border-brand/30 text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full mb-2">
                  {selectedProduct.badge}
                </span>
              )}
              {selectedProduct.tibetan && (
                <div className="font-tibetan text-xl text-brand-dark mb-1">
                  {selectedProduct.tibetan}
                </div>
              )}
              <h2 className="font-serif font-normal text-2xl sm:text-3xl text-ink mb-2">
                {selectedProduct.name}
              </h2>
              <div className="font-serif text-2xl text-ink mb-4">
                £{selectedProduct.price.toFixed(2)}
              </div>

              <p className="text-sm text-ink-light leading-relaxed mb-6">
                {selectedProduct.fullDesc}
              </p>

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
                  addToCart(selectedProduct.id, modalQty);
                  setSelectedProduct(null);
                }}
                className="w-full bg-ink hover:bg-ink-light text-white font-bold py-3.5 rounded-full text-sm transition-all shadow-md cursor-pointer"
              >
                Add to Cart — £{(selectedProduct.price * modalQty).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          5. SLIDE-OUT RIGHT SHOPPING CART DRAWER
      ==================================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-ink/50 backdrop-blur-xs"
            onClick={() => setIsCartOpen(false)}
          />
          <aside className="relative z-10 w-full max-w-md bg-surface h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Cart Header */}
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

            {/* Cart Items List */}
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
                    Explore our Tibetan mugs, books, and playing cards.
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
                      src={item.images[0]}
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

            {/* Cart Footer */}
            {detailedCart.length > 0 && (
              <div className="p-6 border-t border-border-subtle bg-paper/70 space-y-4">
                {cartHasMug && (
                  <div className="flex items-start gap-2 text-[11px] text-amber-900 bg-brand-light/70 border border-brand/30 rounded-xl px-3.5 py-2.5">
                    <Truck size={14} className="shrink-0 mt-0.5 text-brand-dark" />
                    <span>
                      Cart includes a mug — shipping address at checkout will be
                      restricted to the <strong>United Kingdom (£5.50)</strong>.
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-ink-muted">
                  <Tag size={13} className="text-brand-dark" />
                  <span>Promo codes can be entered on the checkout screen.</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
                  <span className="font-serif text-lg text-ink">
                    Estimated subtotal
                  </span>
                  <span className="font-serif text-2xl text-ink">
                    £{subtotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted">
                  Delivery is calculated at checkout (£0 for E-books).
                </p>

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
                  className="w-full bg-ink hover:bg-ink-light text-white font-bold py-4 rounded-full text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
                  <span>Secure Checkout · Apple Pay, PayPal, Google Pay &amp; Card</span>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* ====================================================================
          6. FOOTER (CONSISTENT WITH LOPLAO WEBSITE)
      ==================================================================== */}
      <footer className="bg-[#091e36] text-white/70 py-14 border-t border-white/10 text-center">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
          <div className="mb-5">
            <img
              src="/symbol_pecha_gold.png"
              alt="Tibetan Pecha Scripture"
              className="w-20 h-20 object-contain mx-auto opacity-95"
            />
          </div>
          <div className="font-tibetan text-2xl sm:text-3xl text-white mb-1.5">
            ཤེས་རབ་ལྷ་མོས་དངོས་གྲུབ་སྩོལ།
          </div>
          <p className="font-serif italic text-xs sm:text-sm text-white/60 mb-8">
            &ldquo;May the goddess of wisdom bestow accomplishment.&rdquo;
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-white/70 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/courses" className="hover:text-white transition-colors">
              Live Courses
            </Link>
            <Link href="/shop" className="text-white font-bold">
              Shop
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/support" className="hover:text-white transition-colors">
              Contact
            </Link>
            <Link
              href="/donate"
              className="text-brand hover:text-brand-light font-bold transition-colors"
            >
              Donate
            </Link>
          </div>
          <div className="text-[11px] text-white/45">
            © {new Date().getFullYear()} Loplao · Learn Tibetan UK
          </div>
        </div>
      </footer>
    </div>
  );
}