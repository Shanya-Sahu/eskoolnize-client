"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// Define the expected shape of the JWT payload
interface JwtPayload {
    id: string;
    role: string;
    verified: boolean;
    iat: number;
    exp: number;
}

export default function StudentDashboard() {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setRole(null);
            setLoading(false);
            return;
        }

        try {
            // Decode the token and assert the payload type
            const decoded = jwtDecode<JwtPayload>(token);
            setRole(decoded.role);
        } catch (error) {
            console.error("Invalid token:", error);
            setRole(null);
        }
        setLoading(false);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (role !== "student") {
        return (
            <div className="text-center text-red-600 text-xl mt-10">
                Not Authorized: You cannot access this page.
            </div>
        );
    }

    return (
        <div className="w-full py-10">
            <h2 className="text-4xl text-center font-bold">Student Dashboard</h2>

        </div>
    );
}
