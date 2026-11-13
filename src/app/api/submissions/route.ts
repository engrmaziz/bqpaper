import { NextRequest, NextResponse } from "next/server";
import { getAllSubmissions } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const list = getAllSubmissions();
    return NextResponse.json(
      { submissions: list },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
