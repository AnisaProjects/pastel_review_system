"use client";

import { useState } from "react";
import { Star, Send, CheckCircle2, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function ReviewPage() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    
    if (!review.trim()) {
      setError("Please write a review");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase
        .from("reviews")
        .insert({
          name: name.trim() || null,
          rating,
          review: review.trim(),
        });

      if (insertError) {
        throw insertError;
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
        <Card className="w-full max-w-md overflow-hidden rounded-3xl border-0 bg-card shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">
              Thank You!
            </h2>
            <p className="mb-8 text-muted-foreground">
              Your review has been submitted successfully. We appreciate your feedback!
            </p>
            <Button asChild className="rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90">
              <a href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </a>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:py-16">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Share Your Experience</span>
          </div>
          <h1 className="mb-2 font-serif text-3xl font-bold text-foreground md:text-4xl">
            Leave a <span className="text-primary">Review</span>
          </h1>
          <p className="text-muted-foreground">
            We&apos;d love to hear about your visit to Pastel Beauty
          </p>
        </div>

        {/* Review Form */}
        <Card className="overflow-hidden rounded-3xl border-0 bg-card shadow-2xl">
          <CardHeader className="border-b border-border bg-secondary/30 pb-6 pt-8">
            <CardTitle className="text-center font-serif text-xl text-foreground">
              How was your experience?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div className="space-y-3">
                <Label className="text-foreground">Your Rating</Label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="rounded-lg p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <Star
                        className={`h-10 w-10 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? "fill-primary text-primary"
                            : "text-border"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  {rating === 0
                    ? "Tap a star to rate"
                    : rating === 1
                    ? "Poor"
                    : rating === 2
                    ? "Fair"
                    : rating === 3
                    ? "Good"
                    : rating === 4
                    ? "Very Good"
                    : "Excellent!"}
                </p>
              </div>

              {/* Name (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Your Name <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl border-2 border-border bg-background transition-colors focus:border-primary"
                />
              </div>

              {/* Review */}
              <div className="space-y-2">
                <Label htmlFor="review" className="text-foreground">
                  Your Review
                </Label>
                <Textarea
                  id="review"
                  placeholder="Tell us about your experience..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={5}
                  className="resize-none rounded-xl border-2 border-border bg-background transition-colors focus:border-primary"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-xl bg-destructive/10 p-4 text-center text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-primary py-6 text-lg font-medium text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:bg-primary/90 hover:shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Submit Review
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
