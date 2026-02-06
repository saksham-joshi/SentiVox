import { NextRequest, NextResponse } from "next/server";
import { sendOTP } from "@/network/otp";
import { VALUES } from "@/lib/values";

// Rate limiting map
const otpAttempts = new Map<string, { count: number; lastAttempt: number }>();
const OTP_COOLDOWN_MS = 60000; // 1 minute between OTP requests
const MAX_OTP_REQUESTS = 5; // Max 5 OTP requests per hour per email
const HOUR_MS = 3600000;

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  return VALUES.ALLOWED_EMAIL_DOMAINS.some((domain) =>
    email.toLowerCase().endsWith(domain)
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        {
          error: `Only ${VALUES.ALLOWED_EMAIL_DOMAINS.join(
            " or "
          )} emails are allowed`,
        },
        { status: 400 }
      );
    }

    // Rate limiting check
    const now = Date.now();
    const attempts = otpAttempts.get(normalizedEmail);

    if (attempts) {
      // Check cooldown
      if (now - attempts.lastAttempt < OTP_COOLDOWN_MS) {
        const waitTime = Math.ceil(
          (OTP_COOLDOWN_MS - (now - attempts.lastAttempt)) / 1000
        );
        return NextResponse.json(
          {
            error: `Please wait ${waitTime} seconds before requesting another OTP`,
          },
          { status: 429 }
        );
      }

      // Check hourly limit
      if (
        attempts.count >= MAX_OTP_REQUESTS &&
        now - attempts.lastAttempt < HOUR_MS
      ) {
        return NextResponse.json(
          { error: "Too many OTP requests. Please try again later." },
          { status: 429 }
        );
      }

      // Reset count if an hour has passed
      if (now - attempts.lastAttempt >= HOUR_MS) {
        attempts.count = 0;
      }
    }

    // Send OTP
    const otp_sent_result = await sendOTP(normalizedEmail);

    if (!otp_sent_result) {
      return NextResponse.json(
        { error: "Failed to send OTP. Please try again." },
        { status: 500 }
      );
    }

    // Update rate limiting
    otpAttempts.set(normalizedEmail, {
      count: (attempts?.count || 0) + 1,
      lastAttempt: now,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
