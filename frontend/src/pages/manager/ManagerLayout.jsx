import { Link, useLocation } from "react-router-dom";
import Header from "../../components/Header";

export default function ManagerLayout({ children }) {
    const { pathname } = useLocation();

    const nav = [
        { name: "Home", path: "/home" },
        { name: "User Roles", path: "/user-roles" },
        { name: "Analytics", path: "/analytics" },
        { name: "Settings", path: "/settings" },
    ];

    return (
        <>
            <Header className={"fixed"} />
            <div className="flex flex-1 pt-12">
                <div className="w-64 h-full fixed bg-pearl-aqua/20 p-4 border-r border-neutral-200 shadow-md">
                    {nav.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`block px-4 py-2 rounded mb-2 transition duration-200 ${
                                pathname === link.path ? "bg-dark-cyan/80 text-white" : "hover:bg-dark-cyan/20"
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
                <div className="p-6 pl-75 w-full">{children}</div>
            </div>
        </>
    );
}
