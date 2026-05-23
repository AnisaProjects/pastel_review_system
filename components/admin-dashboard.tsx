"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Star, 
  Trash2, 
  LogOut, 
  BarChart3, 
  MessageSquare, 
  TrendingUp,
  User,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createClient } from "@/lib/supabase/client";

interface Review {
  id: string;
  name: string | null;
  rating: number;
  review: string;
  created_at: string;
}

interface AdminDashboardProps {
  initialReviews: Review[];
}

export function AdminDashboard({ initialReviews }: AdminDashboardProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("reviews").delete().eq("id", id);

      if (error) {
        throw error;
      }

      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error deleting review:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";
  const fiveStarReviews = reviews.filter((r) => r.rating === 5).length;
  const ratingDistribution = [1, 2, 3, 4, 5].map(
    (rating) => reviews.filter((r) => r.rating === rating).length
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your customer reviews
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-2xl border-0 bg-card shadow-lg">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <MessageSquare className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
                <p className="text-3xl font-bold text-foreground">{totalReviews}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 bg-card shadow-lg">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <BarChart3 className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-foreground">{averageRating}</p>
                  <Star className="h-5 w-5 fill-primary text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 bg-card shadow-lg">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <TrendingUp className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">5-Star Reviews</p>
                <p className="text-3xl font-bold text-foreground">{fiveStarReviews}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 bg-card shadow-lg">
            <CardContent className="p-6">
              <p className="mb-3 text-sm text-muted-foreground">Rating Distribution</p>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating, index) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="w-3 text-xs text-muted-foreground">{rating}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: totalReviews > 0
                            ? `${(ratingDistribution[4 - index] / totalReviews) * 100}%`
                            : "0%",
                        }}
                      />
                    </div>
                    <span className="w-6 text-xs text-muted-foreground">
                      {ratingDistribution[4 - index]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <Card className="rounded-2xl border-0 bg-card shadow-lg">
          <CardHeader className="border-b border-border">
            <CardTitle className="font-serif text-xl text-foreground">
              All Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">No reviews yet</h3>
                <p className="text-sm text-muted-foreground">
                  Reviews will appear here once customers submit them.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex flex-col gap-4 p-6 transition-colors hover:bg-secondary/30 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="flex-1 space-y-3">
                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= review.rating
                                ? "fill-primary text-primary"
                                : "text-border"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Review Text */}
                      <p className="text-foreground">{review.review}</p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {review.name || "Anonymous"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === review.id}
                          className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          {deletingId === review.id ? (
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
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
                          ) : (
                            <>
                              <Trash2 className="mr-1 h-4 w-4" />
                              Delete
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Review</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this review? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(review.id)}
                            className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
