import { NextResponse } from "next/server";
import { revalidateStorefront } from "@/server/revalidate";
import { handler } from "@/server/http";
import { requireAdmin } from "@/server/auth";
import { deleteReview } from "@/server/services/reviews";

export const DELETE = handler<{ id: string }>(async (_request, { params }) => {
  await requireAdmin();
  await deleteReview((await params).id);
  revalidateStorefront();
  return NextResponse.json({ message: "Review deleted" });
});
