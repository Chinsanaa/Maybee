import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  approveReviewAction,
  rejectReviewAction,
  deleteReviewAction,
} from "@/app/actions/admin-review-actions";
import { StarRating } from "@/components/product/star-rating";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MessageSquare } from "lucide-react";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("product_review")
    .select("*, product:product_id ( name_mn, slug_mn )")
    .order("created_at", { ascending: false });
  if (status === "pending") query = query.eq("is_approved", false);
  if (status === "approved") query = query.eq("is_approved", true);

  const { data: reviews } = await query;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-brand-ink">Reviews</h1>
        <div className="flex gap-2 text-sm">
          <Link href="/admin/reviews" className="rounded-full border border-brand-gray-light px-3 py-1.5 hover:border-brand-red">
            All
          </Link>
          <Link href="/admin/reviews?status=pending" className="rounded-full border border-brand-gray-light px-3 py-1.5 hover:border-brand-red">
            Pending
          </Link>
          <Link href="/admin/reviews?status=approved" className="rounded-full border border-brand-gray-light px-3 py-1.5 hover:border-brand-red">
            Approved
          </Link>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {(reviews ?? []).map((r) => (
          <Card key={r.id} padding="p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <StarRating value={r.rating} />
                <span className="font-medium text-brand-ink">{r.customer_name}</span>
                <Badge variant={r.is_approved ? "success" : "warning"}>
                  {r.is_approved ? "Approved" : "Pending"}
                </Badge>
              </div>
              <span className="text-xs text-brand-gray">{new Date(r.created_at).toLocaleDateString("en-US")}</span>
            </div>
            <p className="mt-2 text-sm text-brand-ink">{r.review_text}</p>
            {r.product && (
              <p className="mt-1 text-xs text-brand-gray">
                Product: {(r.product as { name_mn: string }).name_mn}
              </p>
            )}
            <div className="mt-3 flex gap-3">
              {!r.is_approved && (
                <form action={approveReviewAction}>
                  <input type="hidden" name="id" value={r.id} />
                  <Button type="submit" variant="ghost" size="sm" className="!text-green-700">
                    Approve
                  </Button>
                </form>
              )}
              {r.is_approved && (
                <form action={rejectReviewAction}>
                  <input type="hidden" name="id" value={r.id} />
                  <Button type="submit" variant="ghost" size="sm" className="!text-brand-gray">
                    Unapprove
                  </Button>
                </form>
              )}
              <form action={deleteReviewAction}>
                <input type="hidden" name="id" value={r.id} />
                <Button type="submit" variant="danger" size="sm">
                  Delete
                </Button>
              </form>
            </div>
          </Card>
        ))}
        {(reviews ?? []).length === 0 && (
          <EmptyState icon={MessageSquare} title="No reviews found" description="Guest reviews will appear here once submitted." />
        )}
      </div>
    </div>
  );
}
