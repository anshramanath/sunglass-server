import { NextResponse } from "next/server";

export function ok(data: unknown) {
  return NextResponse.json({ success: true, data }, { status: 200 });
}

export function err(message: string, status: number, data?: unknown) {
  return NextResponse.json({ success: false, message, data }, { status });
}
