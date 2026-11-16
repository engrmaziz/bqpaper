import { NextRequest, NextResponse } from "next/server";
import { 
  AUTHORIZED_EXAMINER_EMAIL, 
  verifyExaminerCredentials, 
  generateExaminerToken 
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, passcode } = body as { email?: string; passcode?: string };

    if (!email || !passcode) {
      return NextResponse.json(
        { error: "Email and passcode are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== AUTHORIZED_EXAMINER_EMAIL.toLowerCase()) {
      return NextResponse.json(
        { 
          error: `Access Denied: Only ${AUTHORIZED_EXAMINER_EMAIL} (Instructor of Applied AI, Bano Qabil Kasur) is authorized to access the class marksheet.` 
        },
        { status: 403 }
      );
    }

    const isValid = verifyExaminerCredentials(email, passcode);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid instructor passcode. Please verify your credentials." },
        { status: 401 }
      );
    }

    const token = generateExaminerToken(email);

    return NextResponse.json({
      success: true,
      email: AUTHORIZED_EXAMINER_EMAIL,
      token,
      message: "Instructor identity verified successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Authentication failed." },
      { status: 500 }
    );
  }
}

