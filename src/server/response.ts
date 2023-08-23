import { NextResponse } from "next/server";

export function ok(body: unknown) {
  return NextResponse.json(body, { status: 200 });
}

export function badRequest(message: string) {
  return NextResponse.json({ message }, { status: 400 });
}
