import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Endpoint de santé — utilisé par le healthcheck Docker et le monitoring */
export function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
