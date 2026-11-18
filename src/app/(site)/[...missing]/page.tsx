import { notFound } from "next/navigation";

/** Renders the branded (site) 404 — with navbar and footer — for unknown URLs. */
export default function CatchAll() {
  notFound();
}
