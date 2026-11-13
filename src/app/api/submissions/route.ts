import { NextRequest, NextResponse } from "next/server";
import { getAllSubmissions } from "@/lib/storage";
import { verifyExaminerToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Check Authorization Header or query param
    const authHeader = req.headers.get("authorization");
    const customHeader = req.headers.get("x-examiner-token");
    const { searchParams } = new URL(req.url);
    const queryToken = searchParams.get("token");

    const token = 
      (authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null) ||
      customHeader ||
      queryToken;

    if (!verifyExaminerToken(token)) {
      return NextResponse.json(
        { 
          error: "Access Denied: Protected resource. Only io@maziz.me is authorized to view the class marksheet." 
        },
        { status: 403 }
      );
    }

    const list = await getAllSubmissions();
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
