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

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { token, setToken, setUser, authChecking } = useGlobalState();
    const router = useRouter();

    useEffect(() => {
        if (!authChecking && token) {
            router.replace("/");
        }
    }, [authChecking, token, router]);

    const validateEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (!validateEmail(email)) {
            toast.error("Invalid email address.");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }

        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_API}/api/v1/auth/login`,
                { email, password }
            );

            setToken(data.token);
            setUser(data.user);
            localStorage.setItem("token", data.token);

            toast.success(`Welcome back, ${data.user.name}!`);

        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Login failed.");
        }
    };

    const isButtonDisabled = !email.trim() || !password.trim();

    return (
        <div className="w-full flex items-center justify-between min-h-screen flex-col md:flex-row">
            <ToastContainer position="top-right" />
            <div className="w-full md:w-[50%] xl:w-[70%] hidden md:block">
                <Image src="/main.jpg" alt="welcome" width={1000} height={1000} />
            </div>

            <div className="w-full md:w-[50%] xl:w-[30%] min-h-screen bg-primary-color text-white flex justify-center items-center flex-col">
                <h2 className="text-[22px] md:text-[28px] font-[600]">Welcome</h2>
                <p className="text-[14px]">Sign in to your account</p>

                <div className="w-[80%] mt-[30px]">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block mb-1 text-[14px] md:text-[16px]">
                                Email :
                            </label>
                            <input
                                placeholder="Enter your email"
                                className="w-full px-5 py-3 rounded-full focus:outline-none bg-semidarkbg-color text-white placeholder:text-white text-[14px] md:text-[16px]"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                            <div
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-[38px] md:top-[43px] text-white cursor-pointer"
                            >
                                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </div>
                        </div>

                        <Link
                            href="/reset-password"
                            className="flex justify-end cursor-pointer text-[12px] md:text-[14px]"
                        >
                            Forgot your password?
                        </Link>

                        <button
                            type="submit"
                            disabled={isButtonDisabled}
                            className={`w-full px-5 py-3 rounded-full focus:outline-none bg-semidarkbg-color ${isButtonDisabled
                                ? "opacity-50 cursor-not-allowed"
                                : "opacity-100 cursor-pointer"
                                } text-white font-bold`}
                        >
                            Log In
                        </button>

                        <p className="text-center mt-4 text-[14px] md:text-[16px]">
                            Don’t have any account?{" "}
                            <Link href="/signup" className="font-bold">
                                Register Now
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

