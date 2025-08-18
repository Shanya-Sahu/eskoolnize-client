"use client";

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";

import "react-toastify/dist/ReactToastify.css";

type User = {
    id: string;
    name: string;
    email: string;
    rollNumber: string;
    role: string;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
};

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [verifyingUserId, setVerifyingUserId] = useState<string | null>(null);

    const API_BASE = process.env.NEXT_PUBLIC_SERVER_API || "";

    // Get token safely (only in client)
    const getToken = () => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("token");
        }
        return null;
    };

    // Fetch all users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = getToken();
            if (!token) {
                toast.error("No auth token found. Please login.");
                setLoading(false);
                return;
            }

            // const res = await axios.get<User[]>(`${API_BASE}/api/v1/admin/users`, {
            //     headers: {
            //         Authorization: `Bearer ${token}`,
            //     },
            // });
            const res = await axios.get(`${API_BASE}/api/v1/admin/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response) {
                console.error(error.response.data.message);
            } else {
                console.error("Something went wrong");
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Verify user handler
    const verifyUser = async (userId: string) => {
        try {
            setVerifyingUserId(userId);
            const token = getToken();
            if (!token) {
                toast.error("No auth token found. Please login.");
                setVerifyingUserId(null);
                return;
            }

            const res = await axios.patch(
                `${API_BASE}/api/v1/admin/verify-user`,
                { userId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success(res.data.message || "User verified successfully!");

            // Update verified status locally to avoid refetch
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === userId
                        ? { ...user, verified: true, updatedAt: new Date().toISOString() }
                        : user
                )
            );
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response) {
                console.error(error.response.data.message);
            } else {
                console.error("Something went wrong");
            }
        }
    };

    return (
        <div className="px-6 w-full">
            <ToastContainer position="top-right" />
            <h1 className="text-2xl font-bold my-8">All Users</h1>

            {loading ? (
                <p className="text-center text-white">Loading users...</p>
            ) : (
                <div className="overflow-x-auto w-full">
                    <table className="w-full border border-gray-700 rounded-md text-white">
                        <thead className="bg-semidarkbg-color">
                            <tr>
                                <th className="px-4 py-2 border border-gray-700">ID</th>
                                <th className="px-4 py-2 border border-gray-700">Name</th>
                                <th className="px-4 py-2 border border-gray-700">Email</th>
                                <th className="px-4 py-2 border border-gray-700">Roll Number</th>
                                <th className="px-4 py-2 border border-gray-700">Role</th>
                                <th className="px-4 py-2 border border-gray-700">Verified</th>
                                <th className="px-4 py-2 border border-gray-700">Created At</th>
                                <th className="px-4 py-2 border border-gray-700">Updated At</th>
                                <th className="px-4 py-2 border border-gray-700">Verify User</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="text-center py-6 text-gray-400"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}

                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="odd:bg-darkbg-color even:bg-semidarkbg-color text-sm"
                                >
                                    <td className="px-4 py-2 border border-gray-700 break-all max-w-[100px]">{user.id}</td>
                                    <td className="px-4 py-2 border border-gray-700">{user.name}</td>
                                    <td className="px-4 py-2 border border-gray-700 break-all max-w-[200px]">{user.email}</td>
                                    <td className="px-4 py-2 border border-gray-700 break-all max-w-[200px]">{user.rollNumber}</td>
                                    <td className="px-4 py-2 border border-gray-700 capitalize">{user.role}</td>
                                    <td className="px-4 py-2 border border-gray-700 text-center">
                                        {user.verified ? (
                                            <FaCheckCircle
                                                className="inline text-green-500"
                                                title="Verified"
                                            />
                                        ) : (
                                            <span className="text-red-400 font-semibold">No</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-700 whitespace-nowrap">
                                        {new Date(user.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-700 whitespace-nowrap">
                                        {new Date(user.updatedAt).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-700 text-center">
                                        <button
                                            disabled={user.verified || verifyingUserId === user.id}
                                            onClick={() => verifyUser(user.id)}
                                            className={`px-3 py-1 rounded-full font-semibold transition-colors ${user.verified
                                                ? "bg-gray-500 cursor-not-allowed"
                                                : "bg-green-600 hover:bg-green-700 cursor-pointer"
                                                }`}
                                            title={
                                                user.verified
                                                    ? "User already verified"
                                                    : "Click to verify user"
                                            }
                                        >
                                            {verifyingUserId === user.id ? "Verifying..." : "Verify"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
