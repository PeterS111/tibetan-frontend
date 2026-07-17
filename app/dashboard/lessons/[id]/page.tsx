"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { 
  ChevronRight, RefreshCcw, Play, Loader2, Info, 
  Layers, PenTool, Headphones, Shuffle, ArrowLeft, ArrowRight, CheckCircle2, X, PlusSquare, Volume2, XCircle
} from "lucide-react";

type ToneClass = 'HIGH_UNASPIRATED' | 'HIGH_ASPIRATED' | 'LOW_SEMI_ASPIRATED' | 'LOW_NASAL';

const TIBETAN_ALPHABET = [
  { letter: "ཀ", phonetic: "KA", wylie: "[ka]", tone: "HIGH_UNASPIRATED", gender: "Masculine", note: "A crisp, high 'k' sound with no breath." },
  { letter: "ཁ", phonetic: "KHA", wylie: "[kha]", tone: "HIGH_ASPIRATED", gender: "Neuter", note: "Like 'k' in 'kite', but with a strong puff of air." },
  { letter: "ག", phonetic: "GA", wylie: "[kha]", tone: "LOW_SEMI_ASPIRATED", gender: "Feminine", note: "Written 'ga'; pronounced as a low, soft 'kha'." },
  { letter: "ང", phonetic: "NGA", wylie: "[nga]", tone: "LOW_NASAL", gender: "Very Feminine", note: "Like 'ng' in 'sing', but at the start of the syllable." },
  { letter: "ཅ", phonetic: "CA", wylie: "[ca]", tone: "HIGH_UNASPIRATED", gender: "Masculine", note: "Like 'ch' in 'cheese', but sharp and unbreathed." },
  { letter: "ཆ", phonetic: "CHA", wylie: "[chha]", tone: "HIGH_ASPIRATED", gender: "Neuter", note: "Like 'ch' with a strong puff of air." },
  { letter: "ཇ", phonetic: "JA", wylie: "[chha]", tone: "LOW_SEMI_ASPIRATED", gender: "Feminine", note: "Written 'ja'; pronounced as a low, soft 'chha'." },
  { letter: "ཉ", phonetic: "NYA", wylie: "[nya]", tone: "LOW_NASAL", gender: "Very Feminine", note: "Like 'ny' in 'canyon', spoken low in the voice." },
  { letter: "ཏ", phonetic: "TA", wylie: "[ta]", tone: "HIGH_UNASPIRATED", gender: "Masculine", note: "A sharp 't' with the tongue touching the teeth." },
  { letter: "ཐ", phonetic: "THA", wylie: "[tha]", tone: "HIGH_ASPIRATED", gender: "Neuter", note: "A high 't' with a strong puff of air." },
  { letter: "ད", phonetic: "DA", wylie: "[tha]", tone: "LOW_SEMI_ASPIRATED", gender: "Feminine", note: "Written 'da'; pronounced as a low, soft 'tha'." },
  { letter: "ན", phonetic: "NA", wylie: "[na]", tone: "LOW_NASAL", gender: "Very Feminine", note: "A standard 'n' sound, spoken low in the voice." },
  { letter: "པ", phonetic: "PA", wylie: "[pa]", tone: "HIGH_UNASPIRATED", gender: "Masculine", note: "A crisp, high 'p' with no breath." },
  { letter: "ཕ", phonetic: "PHA", wylie: "[pha]", tone: "HIGH_ASPIRATED", gender: "Neuter", note: "A high 'p' with a strong puff of air." },
  { letter: "བ", phonetic: "BA", wylie: "[pha]", tone: "LOW_SEMI_ASPIRATED", gender: "Feminine", note: "Written 'ba'; pronounced as a low, soft 'pha'." },
  { letter: "མ", phonetic: "MA", wylie: "[ma]", tone: "LOW_NASAL", gender: "Very Feminine", note: "A standard 'm' sound, spoken low in the voice." },
  { letter: "ཙ", phonetic: "TSA", wylie: "[tsa]", tone: "HIGH_UNASPIRATED", gender: "Masculine", note: "Like 'ts' in 'cats', sharp and unbreathed." },
  { letter: "ཚ", phonetic: "TSHA", wylie: "[ts'ha]", tone: "HIGH_ASPIRATED", gender: "Neuter", note: "High 'ts' with a strong puff of air." },
  { letter: "ཛ", phonetic: "DZA", wylie: "[ts'ha]", tone: "LOW_SEMI_ASPIRATED", gender: "Feminine", note: "Written 'dza'; pronounced as a low, soft 'ts'ha'." },
  { letter: "ཝ", phonetic: "WA", wylie: "[wa]", tone: "LOW_SEMI_ASPIRATED", gender: "Feminine", note: "Like 'w' in 'water', spoken low." },
  { letter: "ཞ", phonetic: "ZHA", wylie: "[sha]", tone: "LOW_SEMI_ASPIRATED", gender: "Feminine", note: "Written 'zha'; pronounced as a low, soft 'sha'." },
  { letter: "ཟ", phonetic: "ZA", wylie: "[sa]", tone: "LOW_SEMI_ASPIRATED", gender: "Feminine", note: "Written 'za'; pronounced as a low, soft 'sa'." },
  { letter: "འ", phonetic: "'A", wylie: "[ah]", tone: "LOW_SEMI_ASPIRATED", gender: "Feminine", note: "The soft, low-toned glottal root." },
  { letter: "ཡ", phonetic: "YA", wylie: "[ya]", tone: "LOW_SEMI_ASPIRATED", gender: "Feminine", note: "Like 'y' in 'yellow', spoken low." },
  { letter: "ར", phonetic: "RA", wylie: "[ra]", tone: "LOW_SEMI_ASPIRATED", gender: "Sub-Feminine", note: "A lightly rolled or tapped 'r'." },
  { letter: "ལ", phonetic: "LA", wylie: "[la]", tone: "LOW_SEMI_ASPIRATED", gender: "Sub-Feminine", note: "A standard 'l' sound." },
  { letter: "ཤ", phonetic: "SHA", wylie: "[shha]", tone: "LOW_SEMI_ASPIRATED", gender: "Sub-Feminine", note: "Like 'sh' in 'shine', spoken high in the voice." },
  { letter: "ས", phonetic: "SA", wylie: "[s'ha]", tone: "LOW_SEMI_ASPIRATED", gender: "Sub-Feminine", note: "A standard 's' sound, spoken high in the voice." },
  { letter: