"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Sparkles, Heart, Star, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PASTEL_BEAUTY_URL = "https://v0-pastel-beauty-app.vercel.app/review";
const PASTEL_SHOP_BEAUTY_URL = "https://www.pastel-beauty.com/";

export default function LandingPage() {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(PASTEL_BEAUTY_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 text-primary/20">
          <Sparkles className="h-16 w-16" />
        </div>
        <div className="absolute bottom-20 right-10 text-primary/20">
          <Heart className="h-12 w-12" />
        </div>
        
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
            <Star className="h-4 w-4 text-primary" fill="currentColor" />
            <span className="text-sm font-medium text-foreground">Premium Beauty Experience</span>
          </div>
          
          <h1 className="mb-6 font-serif text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            <span className="text-balance">Welcome to</span>
            <br />
            <span className="text-primary">Pastel Beauty</span>
          </h1>
          
          <p className="mx-auto mb-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
            A Nepali beauty brand rooted in self-expression, confidence, and clean beauty.
          </p>
          <p className="mx-auto mb-8 max-w-2xl text-sm text-muted-foreground">
            Paraben-Free | Non-Toxic | Vegan | Cruelty-Free | Vitamin E Rich
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="rounded-full bg-primary px-8 text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-xl">
              <a href={PASTEL_SHOP_BEAUTY_URL} target="_blank" rel="noopener noreferrer">
                Visit Our Shop
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-2 border-primary px-8 text-primary transition-all hover:scale-105 hover:bg-primary hover:text-primary-foreground">
              <a href="/review">
                Leave a Review
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* QR Code Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
              Scan to Visit Our Shop
            </h2>
            <p className="text-muted-foreground">
              Discover our collection of clean beauty products
            </p>
          </div>

          <Card className="mx-auto max-w-md overflow-hidden rounded-3xl border-0 bg-card shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <div className="mb-6 flex justify-center">
                <div className="rounded-2xl bg-white p-6 shadow-inner">
                  {mounted ? (
                    <QRCodeSVG 
                      value={PASTEL_BEAUTY_URL}
                      size={200}
                      bgColor="#FFFFFF"
                      fgColor="#D9778E"
                      level="H"
                      includeMargin={false}
                    />
                  ) : (
                    <div className="h-[200px] w-[200px] animate-pulse rounded bg-secondary" />
                  )}
                </div>
              </div>
              
              <div className="text-center">
                <p className="mb-4 text-sm text-muted-foreground">
                  Or copy the link to share
                </p>
                <div className="flex items-center gap-2 rounded-xl bg-secondary p-3">
                  <code className="flex-1 truncate text-sm text-foreground">
                    {PASTEL_BEAUTY_URL}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={copyToClipboard}
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

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 flex items-center justify-center gap-4">
            <a href="/review" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              Leave a Review
            </a>
            <span className="text-muted-foreground">|</span>
            <a href="/admin/login" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              Admin Portal
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Pastel Beauty. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
