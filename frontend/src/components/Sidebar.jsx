import { Link, useLocation } from "react-router-dom";
import { HiOutlineHome, HiOutlineCube, HiOutlineClipboardList, HiOutlineCalendar, HiOutlineUserGroup, HiOutlineCog } from "react-icons/hi";
import Logo from "./Logo";

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: "/home", name: "Dashboard", icon: <HiOutlineHome size={22} /> },
        { path: "/equipment", name: "Equipment", icon: <HiOutlineCube size={22} /> },
        { path: "/requests", name: "Maintenance", icon: <HiOutlineClipboardList size={22} /> },
        { path: "/calendar", name: "Calendar", icon: <HiOutlineCalendar size={22} /> }, // Preventive
        { path: "/teams", name: "Teams", icon: <HiOutlineUserGroup size={22} /> },
    ];

    return (
        <aside className="w-64 bg-white border-r border-neutral-200 hidden md:flex flex-col h-full">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-center">
                <Logo />
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium ${isActive
                                    ? "bg-dark-teal text-white shadow-md shadow-dark-teal/20"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-dark-teal"
                                }`}
                        >
                            <span className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-dark-teal"}`}>
                                {item.icon}
                            </span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-neutral-100">
                <Link
                    to="/settings"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${location.pathname === "/settings"
                            ? "bg-slate-100 text-dark-teal "
                            : "text-slate-500 hover:bg-slate-50 hover:text-dark-teal"
                        }`}
                >
                    <HiOutlineCog size={22} />
                    Settings
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
