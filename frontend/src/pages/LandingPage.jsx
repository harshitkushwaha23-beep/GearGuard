import { Link } from "react-router-dom";
import { HiOutlineCube, HiOutlineClipboardCheck, HiOutlineCalendar, HiOutlineUserGroup, HiArrowRight } from "react-icons/hi";
import Logo from "../components/Logo";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pearl-aqua/20">
            {/* Header */}
            <header className="border-b border-neutral-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Logo />
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="px-4 py-2 text-dark-teal font-medium hover:text-dark-cyan transition-colors">
                            Login
                        </Link>
                        <Link to="/signup" className="px-6 py-2 bg-dark-teal text-white rounded-xl font-medium hover:bg-dark-cyan transition-colors shadow-md">
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold text-ink-black mb-6 leading-tight">
                        The Ultimate <span className="text-dark-teal">Maintenance</span><br />Management System
                    </h1>
                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                        Track your assets, manage maintenance requests, and keep your operations running smoothly with GearGuard's intuitive platform.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link to="/signup" className="px-8 py-4 bg-dark-teal text-white rounded-xl font-semibold hover:bg-dark-cyan transition-all shadow-lg hover:shadow-xl flex items-center gap-2 text-lg">
                            Start Free Trial
                            <HiArrowRight size={20} />
                        </Link>
                        <Link to="/login" className="px-8 py-4 border-2 border-dark-teal text-dark-teal rounded-xl font-semibold hover:bg-dark-teal hover:text-white transition-all text-lg">
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <h2 className="text-3xl font-bold text-ink-black text-center mb-12">Everything You Need</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard
                        icon={<HiOutlineCube size={32} className="text-dark-teal" />}
                        title="Equipment Tracking"
                        description="Centralized database for all company assets with detailed technical information."
                    />
                    <FeatureCard
                        icon={<HiOutlineClipboardCheck size={32} className="text-dark-teal" />}
                        title="Smart Kanban Board"
                        description="Drag-and-drop interface for managing maintenance requests with real-time updates."
                    />
                    <FeatureCard
                        icon={<HiOutlineCalendar size={32} className="text-dark-teal" />}
                        title="Preventive Scheduling"
                        description="Calendar-based planning for routine maintenance and inspections."
                    />
                    <FeatureCard
                        icon={<HiOutlineUserGroup size={32} className="text-dark-teal" />}
                        title="Team Management"
                        description="Assign specialized teams and track technician availability and workload."
                    />
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-dark-teal to-dark-cyan py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">Ready to Streamline Your Maintenance?</h2>
                    <p className="text-pearl-aqua text-lg mb-8">
                        Join companies that trust GearGuard to keep their operations running smoothly.
                    </p>
                    <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-dark-teal rounded-xl font-semibold hover:bg-slate-100 transition-all shadow-lg text-lg">
                        Get Started Now
                        <HiArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-neutral-200 bg-white py-8">
                <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
                    <p>© 2025 GearGuard. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-2xl border border-neutral-200 hover:shadow-lg transition-all group">
        <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-ink-black mb-2">{title}</h3>
        <p className="text-slate-600">{description}</p>
    </div>
);

export default LandingPage;
