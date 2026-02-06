"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// User type for client-side (without sensitive info if needed, but we include apikey for UX)
export interface AuthUser {
    email: string;
    name: string;
    apikey: string;
    join_date: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (user: AuthUser) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "sentivox_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser) as AuthUser;
                // Validate the stored data has required fields
                if (parsedUser.email && parsedUser.name && parsedUser.apikey) {
                    setUser(parsedUser);
                } else {
                    localStorage.removeItem(AUTH_STORAGE_KEY);
                }
            }
        } catch {
            // Invalid JSON in localStorage, clear it
            localStorage.removeItem(AUTH_STORAGE_KEY);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = (userData: AuthUser) => {
        setUser(userData);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: !!user,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
