"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import AnalyzerInput from "@/components/AnalyzerInput";
import SentimentResult from "@/components/SentimentResult";
import HeroSection from "@/components/HeroSection";
import { COLORS } from "@/lib/colors";
import { useAuth } from "@/lib/AuthContext";
import { AnalysisResult, analyzeSingleComment } from "@/network/api";

export default function Home() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Ref for the bottom input to scroll to it
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when results update
    if (results.length > 0) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [results]);

  const handleAnalyze = async (text: string) => {
    // Check if user is logged in before allowing analysis
    if (!isLoggedIn || !user) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeSingleComment(text, user.apikey);
      setResults(prev => [...prev, result]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-2xl mx-auto space-y-12">

          {/* History of Analysis */}
          {results.map((result, index) => (
            <div key={index} className="space-y-6 animate-slide-up">
              {/* Read-only Input */}
              <div className="opacity-90">
                <AnalyzerInput
                  onAnalyze={() => { }}
                  isLoading={false}
                  value={result.originalText}
                  readOnly={true}
                />
              </div>

              {/* Result */}
              <SentimentResult
                data={result}
                originalText={result.originalText}
              />

              <div className="w-full h-px bg-border/50 my-4" style={{ backgroundColor: COLORS.primaryDark }} />
            </div>
          ))}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-danger-soft border border-danger/20 rounded-lg text-center text-danger">
              {error}
            </div>
          )}

          {/* Login prompt for non-authenticated users */}
          {!authLoading && !isLoggedIn && (
            <div className="p-4 bg-muted border border-border rounded-lg text-center">
              <p className="text-muted-foreground mb-2">
                Please log in to analyze text and access your API key.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="text-primary hover:underline font-medium"
              >
                Sign in to get started →
              </button>
            </div>
          )}

          {/* New Active Input */}
          <div ref={bottomRef}>
            <AnalyzerInput
              key={results.length} // Force re-mount to clear input after analysis
              onAnalyze={handleAnalyze}
              isLoading={isLoading || authLoading}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
