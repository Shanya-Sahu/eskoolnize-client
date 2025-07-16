"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import verifyToken from "./functions/verifyToken";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: string;
    verified: boolean;
}

// AuthState will be either user info or null
export type AuthState = AuthUser | null;

interface GlobalContextType {
    user: AuthState;
    setUser: React.Dispatch<React.SetStateAction<AuthState>>;
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    authChecking: boolean;
    logout: () => void;
    verifyToken: (token: string) => Promise<boolean>;
}

const GlobalContext = createContext<GlobalContextType>({
    user: null,
    setUser: () => { },
    token: null,
    setToken: () => { },
    authChecking: true,
    logout: () => { },
    verifyToken: async () => false,
});

export function GlobalStateProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [user, setUser] = useState<AuthState>(null);
    const [token, setToken] = useState<string | null>(null);
    const [initialized, setInitialized] = useState(false);
    const [authChecking, setAuthChecking] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
        }
        setInitialized(true);
    }, []);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }, [token]);

    useEffect(() => {
        if (!initialized) return;

        const publicPaths = ["/signup", "/login"];
        if (publicPaths.some((p) => pathname.startsWith(p))) {
            setAuthChecking(false);
            return;
        }

        const check = async () => {
            if (!token) {
                setAuthChecking(false);
                router.replace("/login");
                return;
            }

            const valid = await verifyToken(token);
            setAuthChecking(false);
            if (!valid) {
                setToken(null);
                setUser(null);
                localStorage.removeItem("token");
                router.replace("/login");
            }
        };
        check();
    }, [initialized, token, pathname, router]);

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <GlobalContext.Provider
            value={{ user, setUser, token, setToken, authChecking, logout, verifyToken }}
        >
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobalState() {
    return useContext(GlobalContext);
}
