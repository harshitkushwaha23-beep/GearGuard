import { Link } from "react-router-dom";
import { HiOutlineUser, HiMenu, HiX } from "react-icons/hi";
import { useState } from "react";
import Logo from "./Logo";

import { useUser } from "../utils/userContext";

export default function Header({ className }) {
    const { user } = useUser();
    const [open, setOpen] = useState(false);

    return (
        <header className={`bg-white shadow-sm  w-full z-50 border-b border-neutral-200 ${className}`}>
            <div className=" px-6 py-2 flex items-center justify-between">
                <Logo />
                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        to="/"
                        className="text-ink-black hover:text-dark-cyan transition font-medium"
                    >
                        Home
                    </Link>
                    <Link
                        to="/inventory"
                        className="text-ink-black hover:text-dark-cyan transition font-medium"
                    >
                        Inventory
                    </Link>
                    <Link
                        to="/reports"
                        className="text-ink-black hover:text-dark-cyan transition font-medium"
                    >
                        Reports
                    </Link>
                </nav>

                {/* Login Button */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <Link
                                to="/home"
                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-teal text-white shadow-md"
                            >
                                <HiOutlineUser size={18} />
                                {user.name}
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-teal text-white hover:bg-dark-cyan transition-all shadow-md"
                            >
                                <HiOutlineUser size={18} />
                                Login
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <HiX size={28} /> : <HiMenu size={28} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {open && (
                <div className="md:hidden bg-white shadow-lg px-6 py-4 space-y-4">
                    <Link
                        to="/"
                        className="block text-ink-black hover:text-dark-cyan text-lg font-medium"
                        onClick={() => setOpen(false)}
                    >
                        Home
                    </Link>

                    <Link
                        to="/inventory"
                        className="block text-ink-black hover:text-dark-cyan text-lg font-medium"
                        onClick={() => setOpen(false)}
                    >
                        Inventory
                    </Link>

                    <Link
                        to="/reports"
                        className="block text-ink-black hover:text-dark-cyan text-lg font-medium"
                        onClick={() => setOpen(false)}
                    >
                        Reports
                    </Link>

                    {user ? (
                        <Link
                            to="/home"
                            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-dark-teal text-white justify-center shadow-md"
                        >
                            <HiOutlineUser size={20} />
                            {user.name}
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-dark-teal text-white hover:bg-dark-cyan transition-all shadow-md justify-center"
                            onClick={() => setOpen(false)}
                        >
                            <HiOutlineUser size={20} />
                            Login
                        </Link>
                    )}
                </div>
            )}
        </header>
    );
}
