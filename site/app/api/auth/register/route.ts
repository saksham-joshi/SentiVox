import { NextRequest, NextResponse } from "next/server";
import { createUser, isApiKeyUnique } from "@/network/supabase";
import { generateApiKey } from "@/network/api";
import { addFreeTokens } from "@/network/api";
import { VALUES } from "@/lib/values";

// Name validation: alphabets and spaces only, max 19 characters
function isValidName(name: string): boolean {
  const nameRegex = /^[A-Za-z\s]+$/;
  return nameRegex.test(name) && name.length >= 2 && name.length <= 19;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  return VALUES.ALLOWED_EMAIL_DOMAINS.some((domain) =>
    email.toLowerCase().endsWith(domain)
  );
}

// Generate a unique API key (retry if collision)
async function generateUniqueApiKey(): Promise<string> {
  const maxAttempts = 5;

  for (let i = 0; i < maxAttempts; i++) {
    const apiKey = generateApiKey();

    if (await isApiKeyUnique(apiKey)) {
      return apiKey;
    }
  }

  throw new Error("Failed to generate unique API key after multiple attempts");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

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

    // Validate name
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const trimmedName = name.trim();

    if (!isValidName(trimmedName)) {
      return NextResponse.json(
        {
          error: "Name must contain only alphabets and spaces, 2-19 characters",
        },
        { status: 400 }
      );
    }

    // Generate unique API key
    const apiKey = await generateUniqueApiKey();

    // Add free tokens
    if (!await addFreeTokens(apiKey))
    {
      return NextResponse.json(
        { error: "Failed to add free tokens. Please try again." },
        { status: 500 }
      );
    }

    // Create user in Supabase
    const user = await createUser(normalizedEmail, trimmedName, apiKey);

    return NextResponse.json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
