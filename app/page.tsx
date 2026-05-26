"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Sparkles, Star, Copy, Check, ExternalLink, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

const REVIEW_URL = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://pastel-beauty-app.vercel.app"}/review`;
const HERO_VIDEO = "https://www.pastel-beauty.com/wp-content/uploads/2025/04/pastelbeautyweb.mp4";

interface Review {
  id: string;
  name: string | null;
  rating: number;
  review: string;
  created_at: string;
}

export default function LandingPage() {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [topReviews, setTopReviews] = useState<Review[]>([]);

  useEffect(() => {
    setMounted(true);

    const fetchTopReviews = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("reviews")
        .select("id, name, rating, review, created_at")
        .gte("rating", 4)
        .order("rating", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(20);

      if (data) {
        const seen = new Set<string>();
        const unique = data.filter((r) => {
          const key = r.name?.toLowerCase().trim();
          if (!key) return true;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setTopReviews(unique.slice(0, 5));
      }
    };

    fetchTopReviews();
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(REVIEW_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Announcement bar */}
      <div className="bg-primary py-2 text-center text-xs font-medium tracking-widest text-primary-foreground uppercase">
        Paraben-Free &nbsp;·&nbsp; Non-Toxic &nbsp;·&nbsp; Vegan &nbsp;·&nbsp; Cruelty-Free &nbsp;·&nbsp; Vitamin E Rich
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-[#F9DDE5] bg-white/95 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-serif text-xl font-bold text-foreground">Pastel Beauty</span>
          </div>
          <nav className="hidden items-center gap-6 sm:flex">
            <a
              href="https://www.pastel-beauty.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-[#C02A60]"
            >
              Pastel Beauty
            </a>
            <a
              href="https://www.pastel-beauty.com/bisou-beauty/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-[#9B59D0]"
            >
              Bisou Beauty
            </a>
            <a href="/review" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Reviews
            </a>
            <Button
              asChild
              size="sm"
              className="rounded-full bg-primary px-5 text-xs text-primary-foreground hover:bg-primary/90"
            >
              <a href="/review">Leave a Review</a>
            </Button>
          </nav>
          {/* Mobile CTA */}
          <Button
            asChild
            size="sm"
            className="rounded-full bg-primary px-4 text-xs text-primary-foreground hover:bg-primary/90 sm:hidden"
          >
            <a href="/review">Review</a>
          </Button>
        </div>
      </header>

      {/* ── Hero Video Section ── */}
      <section className="relative min-h-[88vh] overflow-hidden bg-[#FDECEF]">
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>

        {/* Layered gradient overlay: subtle brand tint top + darker bottom for text */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#C02A60]/30 via-black/20 to-black/55" />

        {/* Content */}
        <div className="relative z-10 flex min-h-[88vh] flex-col items-center justify-center px-4 py-24 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 shadow backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 text-white" fill="currentColor" />
            <span className="text-xs font-semibold uppercase tracking-widest text-white">
              Premium Beauty Experience
            </span>
          </div>

          <h1
            className="mb-5 font-serif text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.35)" }}
          >
            Welcome to
            <br />
            <span className="text-[#F9DDE5]">Pastel Beauty</span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-base text-white/80 md:text-lg">
            A Nepali beauty brand rooted in self-expression, confidence, and clean beauty —
            inspired by Himalayan origins and global artistry.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white px-10 py-6 text-base font-semibold text-[#C02A60] shadow-lg transition-all hover:scale-105 hover:bg-white/90 hover:shadow-xl"
            >
              <a href="https://www.pastel-beauty.com/" target="_blank" rel="noopener noreferrer">
                Visit Our Shop
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              className="rounded-full border-2 border-white bg-white/10 px-10 py-6 text-base font-semibold text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20"
            >
              <a href="/review">Leave a Review</a>
            </Button>
          </div>
        </div>

        {/* Bottom fade into white */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Trust badges — white section with gentle gradient */}
      <section
        className="border-b border-[#F9DDE5] px-4 py-7"
        style={{
          background:
            "linear-gradient(135deg, #ffffff 0%, #FDECEF 40%, #f3e8f7 70%, #ffffff 100%)",
        }}
      >
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-medium text-muted-foreground">
          {[
            "🌿 Clean Ingredients",
            "🐰 Cruelty-Free",
            "🌱 Vegan Formula",
            "✨ Vitamin E Rich",
          ].map((badge) => (
            <span key={badge} className="whitespace-nowrap">
              {badge}
            </span>
          ))}
        </div>
      </section>

     {/* QR Code Section */}
<section className="bg-[#FDECEF] px-4 py-20 md:py-28">
  <div className="mx-auto max-w-4xl">
    <div className="mb-10 text-center">
      <h2 className="mb-3 font-serif text-3xl font-bold text-foreground md:text-4xl">
        Scan to Leave a Review
      </h2>

      <p className="text-muted-foreground">
        Share your Pastel Beauty experience with our community
      </p>
    </div>

    <Card className="mx-auto max-w-md overflow-hidden rounded-3xl border-0 bg-white shadow-2xl">
      <CardContent className="p-8 md:p-12">
        <div className="mb-8 flex justify-center">
          <div className="rounded-2xl bg-[#FDECEF] p-6">
            {mounted ? (
              <QRCodeSVG
                key={Date.now()}
                value="https://v0-pastel-beauty-app.vercel.app/review"
                size={220}
                bgColor="#FDECEF"
                fgColor="#D9778E"
                level="H"
                includeMargin={true}
              />
            ) : (
              <div className="h-[220px] w-[220px] animate-pulse rounded-xl bg-[#F9DDE5]" />
            )}
          </div>
        </div>

        <div className="text-center">
          <p className="mb-3 text-sm text-muted-foreground">
            Or copy the link to share
          </p>

          <div className="flex items-center gap-2 rounded-xl bg-[#FDECEF] p-3">
            <code className="flex-1 truncate text-xs text-foreground">
              https://v0-pastel-beauty-app.vercel.app/review
            </code>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(
                  "https://v0-pastel-beauty-app.vercel.app/review"
                );
              }}
              className="shrink-0 text-primary hover:bg-primary/10"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</section>
      {/* Customer Reviews Section — white with rose-to-purple gradient */}
      {topReviews.length > 0 && (
        <section
          className="px-4 py-20 md:py-28"
          style={{
            background:
              "linear-gradient(160deg, #ffffff 0%, #FDECEF 30%, #f3e8f7 65%, #ffffff 100%)",
          }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-1.5 shadow-sm">
                <Star className="h-3.5 w-3.5 text-primary" fill="currentColor" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Happy Customers
                </span>
              </div>
              <h2 className="mb-3 font-serif text-3xl font-bold text-foreground md:text-4xl">
                What Our Customers Say
              </h2>
              <p className="text-muted-foreground">Real experiences from our beautiful community</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {topReviews.map((r) => (
                <Card
                  key={r.id}
                  className="group relative overflow-hidden rounded-2xl border border-[#F9DDE5] bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="mb-4 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < r.rating ? "fill-primary text-primary" : "fill-[#F9DDE5] text-[#F9DDE5]"
                          }`}
                        />
                      ))}
                    </div>

                    <Quote className="mb-3 h-7 w-7 text-primary/20" />

                    <p className="mb-6 flex-1 text-sm leading-relaxed text-foreground line-clamp-5">
                      {r.review}
                    </p>

                    <div className="flex items-center gap-3 border-t border-[#F9DDE5] pt-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FDECEF]">
                        <span className="font-serif text-sm font-bold text-primary">
                          {r.name ? r.name.charAt(0).toUpperCase() : "A"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{r.name || "Anonymous"}</p>
                        <p className="text-xs text-muted-foreground">Verified Customer</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button
                asChild
                variant="outline"
                className="rounded-full border-2 border-primary px-8 py-5 font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <a href="/review">Share Your Experience</a>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-[#F9DDE5] bg-[#FDECEF] px-4 py-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-serif text-lg font-bold text-foreground">Pastel Beauty</span>
          </div>
          <div className="mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <a
              href="https://www.pastel-beauty.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-[#C02A60]"
            >
              Pastel Beauty
            </a>
            <span className="text-[#F9DDE5]">|</span>
            <a
              href="https://www.pastel-beauty.com/bisou-beauty/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-[#9B59D0]"
            >
              Bisou Beauty
            </a>
            <span className="text-[#F9DDE5]">|</span>
            <a href="/review" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              Leave a Review
            </a>
            <span className="text-[#F9DDE5]">|</span>
            <a
              href="/admin/login"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Admin Portal
            </a>
          </div>
          <p className="text-xs text-muted-foreground">&copy; 2026 Pastel Beauty. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
