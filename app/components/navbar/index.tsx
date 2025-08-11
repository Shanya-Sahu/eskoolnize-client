// 'use client';
// import { useState } from 'react';
// import { HiMiniBars3 } from "react-icons/hi2";
// import { RxDashboard } from "react-icons/rx";
// import { MdOutlineClass, MdOutlineSettings } from "react-icons/md";
// import { PiStudent } from "react-icons/pi";
// import { RiPresentationLine } from "react-icons/ri";
// import { LuMessageCircleQuestion } from "react-icons/lu";
// import { LuLogOut } from "react-icons/lu";
// import Link from 'next/link';
// import { useGlobalState } from '@/context';

// const navItems = [
//     { label: 'Dashboard', icon: <RxDashboard />, href: '/' },
//     { label: 'Teachers', icon: <RiPresentationLine />, href: '/teachers' },
//     { label: 'Students', icon: <PiStudent />, href: '/students' },
//     { label: 'Classes', icon: <MdOutlineClass />, href: '/classes' },
//     { label: 'Settings', icon: <MdOutlineSettings />, href: '/settings' },
//     { label: 'Support', icon: <LuMessageCircleQuestion />, href: '/support' },
// ];

// export default function Navbar() {
//     const [collapsed, setCollapsed] = useState(false);
//     const { token, logout } = useGlobalState();

//     if (!token) return null; // Hide navbar when not authenticated

//     return (
//         <div
//             className={`h-screen flex flex-col bg-primary-color text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'
//                 }`}
//         >
//             <div className={`flex items-center p-4 my-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
//                 {!collapsed && <span className="text-2xl font-bold">eSkoolnize</span>}
//                 <button onClick={() => setCollapsed(!collapsed)}>
//                     <HiMiniBars3 size={24} />
//                 </button>
//             </div>

//             <nav className="flex flex-col gap-4 px-2">
//                 {navItems.map((item) => (
//                     <Link
//                         key={item.label}
//                         href={item.href}
//                         className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-[--color-secondary-color] text-white hover:font-bold"
//                     >
//                         <span className='text-2xl'>{item.icon}</span>
//                         {!collapsed && <span>{item.label}</span>}
//                     </Link>
//                 ))}
//             </nav>

//             <div className="mt-auto p-4">
//                 <button
//                     onClick={logout}
//                     className={`flex items-center px-3 py-2 rounded-lg hover:font-bold cursor-pointer hover:bg-[--color-secondary-color] w-full transition-all duration-200 ${collapsed ? 'justify-center' : 'gap-4'
//                         }`}
//                 >
//                     <LuLogOut className='text-2xl shrink-0' />
//                     {!collapsed && <span>Log Out</span>}
//                 </button>
//             </div>
//         </div>
//     );
// }

'use client';
import { useState } from 'react';
import { HiMiniBars3 } from "react-icons/hi2";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineClass, MdOutlineSettings } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { RiPresentationLine } from "react-icons/ri";
import { LuMessageCircleQuestion } from "react-icons/lu";
import { LuLogOut } from "react-icons/lu";
import Link from 'next/link';
import { useGlobalState } from '@/context';

const navItems = [
    { label: 'Dashboard', icon: <RxDashboard />, href: '/' },
    { label: 'Teachers', icon: <RiPresentationLine />, href: '/teachers' },
    { label: 'Students', icon: <PiStudent />, href: '/students' },
    { label: 'Classes', icon: <MdOutlineClass />, href: '/classes' },
    { label: 'Settings', icon: <MdOutlineSettings />, href: '/settings' },
    { label: 'Support', icon: <LuMessageCircleQuestion />, href: '/support' },
];

export default function Navbar() {
    const [collapsed, setCollapsed] = useState(false);
    const { token, logout } = useGlobalState();

    if (!token) return null;

    return (
        <div className={`h-screen flex flex-col bg-primary-color text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
            <div className={`flex items-center p-4 my-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
                {!collapsed && <span className="text-2xl font-bold">eSkoolnize</span>}
                <button onClick={() => setCollapsed(!collapsed)}>
                    <HiMiniBars3 size={24} />
                </button>
            </div>

            <nav className="flex flex-col gap-4 px-2">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="relative group flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-semidarkbg-color text-white hover:font-bold"
                    >
                        <span className='text-2xl'>{item.icon}</span>
                        {!collapsed && <span>{item.label}</span>}

                        {/* Tooltip when collapsed */}
                        {collapsed && (
                            <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap bg-semidarkbg-color text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                                {item.label}
                            </span>
                        )}
                    </Link>
                ))}
            </nav>

            <div className="mt-auto px-2 mb-4">
                <button
                    onClick={logout}
                    className="relative group flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-semidarkbg-color text-white hover:font-bold w-full"
                >
                    <LuLogOut className='text-2xl shrink-0' />
                    {!collapsed && <span>Log Out</span>}

                    {/* Tooltip for logout when collapsed */}
                    {collapsed && (
                        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap bg-semidarkbg-color text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                            Log Out
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}
