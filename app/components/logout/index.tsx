"use client";

import { useGlobalState } from "@/context/index";
import { FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function LogoutButton() {
    const { logout } = useGlobalState();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        // Redirect to login or homepage
        router.push("/login");

        toast.success("Logout Successfully!");

    };

    return (
        <div
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-semidarkbg-color text-white hover:bg-darkbg-color transition w-fit"
        >
            <ToastContainer position="top-right" />
            <FaSignOutAlt size={18} />
            Logout
        </div>
    );
}
