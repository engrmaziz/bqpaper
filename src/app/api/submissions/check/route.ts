import { NextRequest, NextResponse } from "next/server";
import { checkStudentAlreadySubmitted } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rollNumber = searchParams.get("rollNumber") || "";
    const email = searchParams.get("email") || "";

    if (!rollNumber.trim() && !email.trim()) {
      return NextResponse.json({ exists: false });
    }

    const result = await checkStudentAlreadySubmitted(rollNumber, email);
    return NextResponse.json({
      exists: result.exists,
      submittedAt: result.submission?.submittedAt,
      studentName: result.submission?.student.name,
      totalScore: result.submission?.totalScore,
      grade: result.submission?.grade,
    });
  } catch (err: any) {
    return NextResponse.json({ exists: false, error: err.message }, { status: 500 });
  }
}
