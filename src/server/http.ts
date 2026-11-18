import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import type { ZodType } from "zod";

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export const notFound = (what = "Resource") => new HttpError(404, `${what} not found`);

/** Parses a JSON body and validates it. Throws HttpError(400) with a readable message. */
export async function parseJson<T>(request: Request, schema: ZodType<T>): Promise<T> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    throw new HttpError(400, "Invalid request body.");
  }
  return validate(raw, schema);
}

export function validate<T>(raw: unknown, schema: ZodType<T>): T {
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new HttpError(400, result.error.issues[0]?.message ?? "Invalid input.");
  }
  return result.data;
}

function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof HttpError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A record with this value already exists." }, { status: 409 });
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "This record is still referenced by other data and cannot be removed." },
        { status: 409 },
      );
    }
  }
  console.error("[api] Unhandled error:", error);
  return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
}

type RouteContext<P> = { params: Promise<P> };

/** Wraps a route handler with uniform error handling. */
export function handler<P = Record<string, never>>(
  fn: (request: NextRequest, context: RouteContext<P>) => Promise<Response>,
) {
  return async (request: NextRequest, context: RouteContext<P>): Promise<Response> => {
    try {
      return await fn(request, context);
    } catch (error) {
      return toErrorResponse(error);
    }
  };
}
