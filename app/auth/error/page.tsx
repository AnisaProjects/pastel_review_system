import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-md overflow-hidden rounded-3xl border-0 bg-card shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">
            Authentication Error
          </h2>
          <p className="mb-8 text-muted-foreground">
            Something went wrong during sign in. The link may have expired or
            already been used. Please try signing in again.
          </p>
          <Button
            asChild
            className="rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90"
          >
            <a href="/admin/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </a>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
