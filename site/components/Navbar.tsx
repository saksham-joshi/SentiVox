"use client";

import Link from "next/link";
import Image from "next/image";
import { FileText, Info, Home, LogIn, User } from "lucide-react";
import { VALUES } from "@/lib/values";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";

const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/docs", label: "Docs", icon: FileText },
    { href: "/about", label: "About", icon: Info },
];

export default function Navbar() {
    const { isLoggedIn, isLoading } = useAuth();

    return (
        <header className="hidden md:block fixed top-0 left-0 right-0 z-50 glass">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-3 group"
                    >
                        <div className="relative w-8 h-8 overflow-hidden rounded-lg transition-transform duration-200 group-hover:scale-110">
                            <Image
                                src="/logo.png"
                                alt={VALUES.APP_NAME}
                                fill
                                sizes="32px"
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                            {VALUES.APP_NAME}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200"
                            >
                                <link.icon size={16} />
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth Button */}
                    <div className="hidden md:block">
                        {isLoading ? (
                            <Button size="sm" variant="ghost" disabled>
                                <span className="animate-pulse">...</span>
                            </Button>
                        ) : isLoggedIn ? (
                            <Link href="/account">
                                <Button size="sm" className="gap-2">
                                    <User size={16} />
                                    Account
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button size="sm" className="gap-2">
                                    <LogIn size={16} />
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
