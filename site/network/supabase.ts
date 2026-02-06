"use server";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// User type definition
export interface User {
  email: string;
  name: string;
  apikey: string;
  join_date: string;
}

// Initialize Supabase client with service role for server-side operations
function getSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are not configured");
  }

  return createClient(supabaseUrl, supabaseKey);
}

const supabase = getSupabaseClient();

/**
 * Check if a user exists in the database by email
 */
export async function checkUserExists(email: string): Promise<boolean> {

  const { data, error } = await supabase
    .from("users")
    .select("email")
    .eq("email", email.toLowerCase())
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows returned
    throw new Error(`Database error: ${error.message}`);
  }

  return !!data;
}

/**
 * Get user data by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase())
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Database error: ${error.message}`);
  }

  return data as User | null;
}

/**
 * Check if an API key is unique (not already in use)
 */
export async function isApiKeyUnique(apiKey: string): Promise<boolean> {
  const { data: isUnique, error } = await supabase
    .rpc('is_apikey_unique', { lookup_key: apiKey });

  if (error) {
    console.error('Error checking key:', error);
    return false;
  }

  return isUnique; // Returns true or false
}

/**
 * Create a new user in the database
 */
export async function createUser(
  email: string,
  name: string,
  apiKey: string
): Promise<User> {
  

  const joinDate = new Date().toISOString();

  const { data, error } = await supabase
    .from("users")
    .insert({
      email: email.toLowerCase(),
      name: name.trim(),
      apikey: apiKey,
      join_date: joinDate,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return data as User;
}

/**
 * Get user by API key
 */
export async function getUserByApiKey(apiKey: string): Promise<User | null> {
  

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("apikey", apiKey)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Database error: ${error.message}`);
  }

  return data as User | null;
}
