
import { NextRequest, NextResponse } from "next/server";
import { verifyOTP, removeOTP } from "@/network/otp";
import { checkUserExists, getUserByEmail } from "@/network/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    // Validate inputs
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!otp || typeof otp !== "string") {
      return NextResponse.json({ error: "OTP is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedOtp = otp.toLowerCase().trim();

    // Verify OTP
    const isValid = await verifyOTP(normalizedEmail, normalizedOtp);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 401 }
      );
    }

    // OTP is valid - remove it from memory to prevent reuse
    await removeOTP(normalizedEmail);

    // Check if user exists in database
    const userExists = await checkUserExists(normalizedEmail);

    if (userExists) {
      // Existing user - fetch their data
      const user = await getUserByEmail(normalizedEmail);
      return NextResponse.json({
        success: true,
        exists: true,
        user: user,
      });
    } else {
      // New user - they need to complete registration
      return NextResponse.json({
        success: true,
        exists: false,
      });
    }
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP. Please try again." },
      { status: 500 }
    );
  }
}
