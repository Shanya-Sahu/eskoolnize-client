// Signup.tsx
"use client";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useGlobalState } from "@/context";

import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
        rollNumber: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [roleLocked, setRoleLocked] = useState(false); // NEW: to hide role after selection
    const { token, setToken, setUser, authChecking } = useGlobalState();
    const router = useRouter();

    useEffect(() => {
        if (!authChecking && token) {
            router.replace("/");
        }
    }, [authChecking, token, router]);

    const handleRoleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, role: e.target.value });
        if (e.target.value) setRoleLocked(true);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.role) {
            toast.error("Please select a role.");
            return;
        }

        if (formData.role === "student") {
            if (!formData.name || !formData.rollNumber || !formData.password) {
                toast.error("Please fill in all fields.");
                return;
            }
        } else {
            if (!formData.name || !formData.email || !formData.password) {
                toast.error("Please fill in all fields.");
                return;
            }
        }

        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }

        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_API}/api/v1/auth/signup`,
                formData
            );
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem("token", data.token);
            toast.success(`Welcome, ${data.user.name}!`);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Signup failed.");
        }
    };

    return (
        <div className="w-full flex items-center justify-between min-h-screen flex-col md:flex-row">
            <ToastContainer position="top-right" />
            <div className="w-full md:w-[50%] xl:w-[70%] hidden md:block">
                <Image src="/main.jpg" alt="welcome" width={1000} height={1000} />
            </div>
            <div className="w-full md:w-[50%] xl:w-[30%] min-h-screen bg-primary-color text-white flex justify-center items-center flex-col">
                <h2 className="text-[22px] md:text-[28px] font-[600]">Create Account</h2>
                <p className="text-[14px]">Fill in your details below</p>
                <div className="w-[80%] mt-[30px]">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Step 1: Role Selection */}

                        <div>
                            <label className="block mb-1">Who Are You?</label>
                            <select
                                value={formData.role}
                                onChange={handleRoleSelect}
                                className="w-full px-5 py-3 rounded-full focus:outline-none bg-semidarkbg-color text-white"
                            >
                                <option value="">Select Role</option>
                                <option value="teacher">Teacher</option>
                                <option value="student">Student</option>
                                <option value="parent">Parent</option>
                                {/* <option value="admin">Admin</option> */}
                            </select>
                        </div>


                        {/* Step 2: Show fields only if role selected */}
                        {roleLocked && (
                            <>
                                {/* Name */}
                                <div>
                                    <label className="block mb-1">Full Name :</label>
                                    <input
                                        placeholder="Enter your full name"
                                        className="w-full px-5 py-3 rounded-full focus:outline-none bg-semidarkbg-color text-white"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                    />
                                </div>

                                {/* Email for Non-Students */}
                                {formData.role !== "student" && (
                                    <div>
                                        <label className="block mb-1">Email :</label>
                                        <input
                                            placeholder="Enter your email"
                                            className="w-full px-5 py-3 rounded-full focus:outline-none bg-semidarkbg-color text-white"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({ ...formData, email: e.target.value })
                                            }
                                        />
                                    </div>
                                )}

                                {/* Roll Number for Students */}
                                {formData.role === "student" && (
                                    <div>
                                        <label className="block mb-1">Roll Number :</label>
                                        <input
                                            placeholder="Enter your roll number"
                                            className="w-full px-5 py-3 rounded-full focus:outline-none bg-semidarkbg-color text-white"
                                            value={formData.rollNumber}
                                            onChange={(e) =>
                                                setFormData({ ...formData, rollNumber: e.target.value })
                                            }
                                        />
                                    </div>
                                )}

                                {/* Password */}
                                <div className="relative">
                                    <label className="block mb-1">Password :</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="w-full px-5 py-3 rounded-full focus:outline-none bg-semidarkbg-color text-white pr-12"
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({ ...formData, password: e.target.value })
                                        }
                                    />
                                    <div
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-[38px] cursor-pointer"
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="w-full px-5 py-3 rounded-full focus:outline-none bg-semidarkbg-color text-white font-bold"
                                >
                                    Sign Up
                                </button>




                            </>


                        )}

                        {/* Link */}
                        <p className="text-center mt-4">
                            Already have an account?{" "}
                            <Link href="/login" className="font-bold">
                                Log In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
