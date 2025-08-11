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
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { token, setToken, setUser, authChecking } = useGlobalState();
    const router = useRouter();

    useEffect(() => {
        if (!authChecking && token) {
            router.replace("/");
        }
    }, [authChecking, token, router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (Object.values(formData).some((field) => !field.trim())) {
            toast.error("Please fill in all fields.");
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

    const isButtonDisabled = Object.values(formData).some(
        (field) => !field.trim()
    );

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
                        <div>
                            <label className="block mb-1 text-[14px] md:text-[16px]">
                                Full Name :
                            </label>
                            <input
                                placeholder="Enter your full name"
                                className="w-full px-5 py-3 rounded-full focus:outline-none bg-semidarkbg-color text-white placeholder:text-white text-[14px] md:text-[16px]"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-[14px] md:text-[16px]">
                                Email :
                            </label>
                            <input
                                placeholder="Enter your email"
                                className="w-full px-5 py-3 rounded-full focus:outline-none bg-semidarkbg-color text-white placeholder:text-white text-[14px] md:text-[16px]"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                            />
                        </div>

                        <div className="relative">
                            <label className="block mb-1 text-[14px] md:text-[16px]">
                                Password :
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="w-full px-5 py-3 rounded-full focus:outline-none bg-semidarkbg-color text-white placeholder:text-white pr-12 text-[14px] md:text-[16px]"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                            />
                            <div
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-[38px] md:top-[43px] text-white cursor-pointer"
                            >
                                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 text-[14px] md:text-[16px]">
                                Who Are You?
                            </label>
                            <div className="relative w-full">
                                <select
                                    value={formData.role}
                                    onChange={(e) =>
                                        setFormData({ ...formData, role: e.target.value })
                                    }
                                    className="w-full px-5 py-3 rounded-full bg-semidarkbg-color text-white appearance-none focus:border-none focus:outline-none text-[14px] md:text-[16px]"
                                >
                                    <option value="">Select Role</option>
                                    <option value="Teacher">Teacher</option>
                                    <option value="Student">Student</option>
                                    <option value="Parent">Parent</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center">
                                    <svg
                                        className="w-4 h-4 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isButtonDisabled}
                            className={`w-full px-5 py-3 rounded-full focus:outline-none bg-semidarkbg-color ${isButtonDisabled
                                ? "opacity-50 cursor-not-allowed"
                                : "opacity-100 cursor-pointer"
                                } text-white font-bold`}
                        >
                            Sign Up
                        </button>

                        <p className="text-center mt-4 text-[14px] md:text-[16px]">
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
