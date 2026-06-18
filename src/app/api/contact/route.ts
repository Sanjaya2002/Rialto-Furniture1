import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  console.log("Contact request received:", {
    name: body.name,
    email: body.email,
    phone: body.phone,
    message: body.message,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({
    message: "Thank you for your message. We will get back to you soon.",
  });
}
