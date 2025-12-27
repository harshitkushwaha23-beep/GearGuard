import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
    return (
        <div className="flex h-screen bg-slate-50 font-roboto">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <Header className="sticky top-0 z-30" />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
