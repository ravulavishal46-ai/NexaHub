"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { StarRating } from "@/components/shared/star-rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDemoStore } from "@/lib/store/demo-store";
import { cn, formatDate, simulateLatency } from "@/lib/utils";
import type { ServiceRequest } from "@/types";

const labels = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

/** Lets the customer rate a completed request (1–5 stars + optional comment). */
export function RateRequest({ request }: { request: ServiceRequest }) {
  const { rateRequest } = useDemoStore();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  if (request.feedback) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your rating</CardTitle>
          <CardDescription>Thanks for your feedback — it helps the team improve.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-3">
            <StarRating value={request.feedback.rating} />
            <span className="text-sm font-medium">{labels[request.feedback.rating]}</span>
          </div>
          {request.feedback.comment && <p className="text-sm text-muted-foreground">“{request.feedback.comment}”</p>}
          <p className="text-xs text-muted-foreground">Rated {formatDate(request.feedback.at)}</p>
        </CardContent>
      </Card>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) {
      setError("Choose a rating from 1 to 5 stars.");
      return;
    }
    setError(undefined);
    setSaving(true);
    await simulateLatency(600);
    rateRequest(request.id, rating, comment.trim());
    setSaving(false);
    toast.success("Thanks for rating this service");
  }

  const shown = hover || rating;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate this service</CardTitle>
        <CardDescription>How did it go? Your rating is shared with the NexaHub team.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} noValidate className="space-y-4">
          <fieldset>
            <legend className="sr-only">Rating</legend>
            <div className="flex items-center gap-3">
              <div className="flex" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <label
                    key={n}
                    className="cursor-pointer rounded p-0.5 has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/40"
                    onMouseEnter={() => setHover(n)}
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={n}
                      checked={rating === n}
                      onChange={() => {
                        setRating(n);
                        setError(undefined);
                      }}
                      className="sr-only"
                      aria-label={`${n} star${n > 1 ? "s" : ""} – ${labels[n]}`}
                    />
                    <Star
                      aria-hidden
                      className={cn(
                        "size-7 transition-colors",
                        n <= shown ? "fill-amber-400 text-amber-400" : "text-muted-foreground/50",
                      )}
                    />
                  </label>
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground" aria-live="polite">
                {shown ? labels[shown] : "Select a rating"}
              </span>
            </div>
            {error && <p className="mt-2 text-xs font-medium text-destructive">{error}</p>}
          </fieldset>
          <div className="grid gap-2">
            <Label htmlFor="rating-comment">
              Comment <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="rating-comment"
              rows={3}
              maxLength={300}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What went well? What could be better?"
            />
          </div>
          <Button type="submit" loading={saving}>
            Submit rating
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
