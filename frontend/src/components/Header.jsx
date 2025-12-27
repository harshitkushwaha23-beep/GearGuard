import { Link } from "react-router-dom";
import { HiOutlineUser, HiMenu, HiX } from "react-icons/hi";
import { useState } from "react";
import Logo from "./Logo";

import { useUser } from "../utils/userContext";

export default function Header({ className }) {
    const { user } = useUser();
    const [open, setOpen] = useState(false);

    // Mobile Sidebar could be implemented here or using the Sidebar component with a mobile state. 
    // For now, simple mobile menu logic.

    return (
        <header className={`bg-white/80 backdrop-blur-md border-b border-neutral-200 ${className}`}>
            <div className="px-6 py-3 flex items-center justify-between">

                {/* Mobile: Logo + Menu */}
                <div className="flex items-center gap-4 md:hidden">
                    <button onClick={() => setOpen(!open)} className="text-slate-600">
                        {open ? <HiX size={26} /> : <HiMenu size={26} />}
                    </button>
                    <Logo />
                </div>

                {/* Desktop: Title or Breadcrumbs (Optional, leaving blank for clean look or dynamic title later) */}
                <div className="hidden md:block">
                    {/* Placeholder for Page Title */}
                    {/* <h1 className="text-xl font-bold text-ink-black">Dashboard</h1> */}
                </div>

                {/* Right Side: User Profile */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-3 pl-4 border-l border-neutral-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-ink-black">{user.name}</p>
                                <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-dark-teal border border-neutral-200">
                                <HiOutlineUser size={20} />
                            </div>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-teal text-white hover:bg-dark-cyan transition-all shadow-md text-sm font-medium"
                        >
                            <HiOutlineUser size={18} />
                            Login
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Dropdown */}
            {open && (
                <div className="md:hidden bg-white border-t border-neutral-100 absolute top-full left-0 w-full shadow-lg py-4 px-4 flex flex-col gap-2">
                    <Link to="/home" className="p-3 hover:bg-slate-50 rounded-lg text-slate-700 font-medium" onClick={() => setOpen(false)}>Dashboard</Link>
                    <Link to="/equipment" className="p-3 hover:bg-slate-50 rounded-lg text-slate-700 font-medium" onClick={() => setOpen(false)}>Equipment</Link>
                    <Link to="/requests" className="p-3 hover:bg-slate-50 rounded-lg text-slate-700 font-medium" onClick={() => setOpen(false)}>Maintenance</Link>
                    <Link to="/calendar" className="p-3 hover:bg-slate-50 rounded-lg text-slate-700 font-medium" onClick={() => setOpen(false)}>Calendar</Link>
                    <Link to="/teams" className="p-3 hover:bg-slate-50 rounded-lg text-slate-700 font-medium" onClick={() => setOpen(false)}>Teams</Link>
                </div>
            )}
        </header>
    );
}
