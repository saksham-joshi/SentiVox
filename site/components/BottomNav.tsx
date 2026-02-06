"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Info, LogIn, User } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/docs", label: "Docs", icon: FileText },
    { href: "/about", label: "About", icon: Info },
];

export default function BottomNav() {
    const pathname = usePathname();
    const { isLoggedIn, isLoading } = useAuth();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 pb-safe">
            <nav className="flex items-center justify-around h-16 px-2">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full gap-1 pt-2 pb-2 transition-colors duration-200",
                            isActive(link.href)
                                ? "text-primary"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <link.icon size={20} className={cn(isActive(link.href) && "fill-current/20")} />
                        <span className="text-[10px] font-medium">{link.label}</span>
                    </Link>
                ))}

                {/* Auth Link */}
                <Link
                    href={isLoggedIn ? "/account" : "/login"}
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-full gap-1 pt-2 pb-2 transition-colors duration-200",
                        isActive(isLoggedIn ? "/account" : "/login")
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {isLoading ? (
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground animate-spin" />
                    ) : isLoggedIn ? (
                        <User size={20} className={cn(isActive("/account") && "fill-current/20")} />
                    ) : (
                        <LogIn size={20} className={cn(isActive("/login") && "fill-current/20")} />
                    )}
                    <span className="text-[10px] font-medium">
                        {isLoading ? "..." : isLoggedIn ? "Account" : "Login"}
                    </span>
                </Link>
            </nav>
        </div>
    );
}
