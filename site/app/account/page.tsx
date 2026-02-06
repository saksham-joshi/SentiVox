"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Key, Copy, Eye, EyeOff, LogOut, Calendar, CheckCircle } from "lucide-react";
import { getTokenCount } from "@/network/api";

export default function AccountPage() {
    const router = useRouter();
    const { user, isLoggedIn, isLoading, logout } = useAuth();
    const [showApiKey, setShowApiKey] = useState(false);
    const [copied, setCopied] = useState(false);
    const [tokenCount, setTokenCount] = useState<number | null>(null);
    const [tokenLoading, setTokenLoading] = useState(true);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            router.push("/login");
        }
    }, [isLoading, isLoggedIn, router]);

    // Fetch token count when user is authenticated
    useEffect(() => {
        const fetchTokenCount = async () => {
            if (user?.apikey) {
                try {
                    setTokenLoading(true);
                    const count = await getTokenCount(user.apikey);
                    setTokenCount(count);
                } catch (error) {
                    console.error("Failed to fetch token count:", error);
                    setTokenCount(null);
                } finally {
                    setTokenLoading(false);
                }
            }
        };

        if (isLoggedIn && user) {
            fetchTokenCount();
        }
    }, [isLoggedIn, user]);

    const handleCopyApiKey = async () => {
        if (user?.apikey) {
            try {
                await navigator.clipboard?.writeText(user.apikey);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy:", err);
            }
        }
    };

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const maskApiKey = (key: string) => {
        if (key.length <= 8) return "•".repeat(key.length);
        return key.substring(0, 4) + "•".repeat(key.length - 8) + key.substring(key.length - 4);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        );
    }

    // Don't render if not logged in (will redirect)
    if (!isLoggedIn || !user) {
        return null;
    }

    return (
        <div className="min-h-screen flex justify-center px-4 py-20 items-start">
            <div className="w-full max-w-lg space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">Your Account</h1>
                    <p className="text-muted-foreground">Manage your Senti-Vox account</p>
                </div>

                {/* User Info Card */}
                <Card className="border-border/50 shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl text-primary">
                            <User size={20} />
                            Profile Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Name */}
                        <div className="space-y-1">
                            <label className="text-sm text-muted-foreground">Name</label>
                            <p className="text-lg font-medium">{user.name}</p>
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-sm text-muted-foreground">Email</label>
                            <p className="text-lg font-medium">{user.email}</p>
                        </div>

                        {/* Token Count */}
                        <div className="space-y-1">
                            <label className="text-sm text-muted-foreground">Token Count</label>
                            <p className="text-lg font-medium">
                                {tokenLoading ? (
                                    <span className="animate-pulse">Loading...</span>
                                ) : tokenCount !== null && tokenCount !== undefined ? (
                                    <span>{tokenCount.toLocaleString()}</span>
                                ) : (
                                    <span className="text-destructive">Failed to load</span>
                                )}
                            </p>
                        </div>

                        {/* Join Date */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar size={14} />
                            Member since {formatDate(user.join_date)}
                        </div>
                    </CardContent>
                </Card>

                {/* API Key Card */}
                <Card className="border-border/50 shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl text-primary">
                            <Key size={20} />
                            API Key
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Use this key to authenticate your API requests. Keep it secure!
                        </p>

                        {/* API Key Display */}
                        <div className="relative">
                            <div className="flex items-center gap-2 p-4 bg-muted rounded-lg font-mono text-sm break-all">
                                {showApiKey ? user.apikey : maskApiKey(user.apikey)}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowApiKey(!showApiKey)}
                                className="gap-2 flex-1"
                            >
                                {showApiKey ? (
                                    <>
                                        <EyeOff size={16} />
                                        Hide
                                    </>
                                ) : (
                                    <>
                                        <Eye size={16} />
                                        View
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopyApiKey}
                                className="gap-2 flex-1"
                            >
                                {copied ? (
                                    <>
                                        <CheckCircle size={16} className="text-green-500" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16} />
                                        Copy
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Logout Button */}
                <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="w-full gap-2"
                    size="lg"
                >
                    <LogOut size={18} />
                    Sign Out
                </Button>
            </div>
        </div>
    );
}
