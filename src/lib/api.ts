import { NextResponse } from "next/server";

const CORS = { "Access-Control-Allow-Origin": "*" };

export function ok(data: unknown, status: number) {
  return NextResponse.json({ success: true, data }, { status, headers: CORS });
}

export function err(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status, headers: CORS });
}
