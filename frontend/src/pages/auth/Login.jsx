import { useState } from "react";
import { HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../utils/userContext";
import Logo from "../../components/Logo";

export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (!form.email || !form.password) {
            setError("Please enter both email and password.");
            setLoading(false);
            return;
        }

        try {
            const res = await axiosInstance.post("/auth/login", form);
            setUser(res.data.user);
            setSuccess("Login successful! Redirecting...");
            setTimeout(() => {
                navigate("/home");
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pearl-aqua/20 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex mb-6">
                        <Logo />
                    </div>
                    <h1 className="text-3xl font-bold text-ink-black mb-2">Welcome Back</h1>
                    <p className="text-slate-600">Sign in to manage your equipment and maintenance</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-8">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-6">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="your@email.com"
                                    className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dark-teal/20 focus:border-dark-teal transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dark-teal/20 focus:border-dark-teal transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-dark-teal transition-colors"
                                >
                                    {showPassword ? <HiEye size={20} /> : <HiEyeOff size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 text-dark-teal rounded border-neutral-300 focus:ring-2 focus:ring-dark-teal/20" />
                                <span className="text-slate-600">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-dark-teal hover:text-dark-cyan font-medium">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-dark-teal text-white py-3 rounded-xl font-semibold hover:bg-dark-cyan transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-600 text-sm">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-dark-teal hover:text-dark-cyan font-semibold">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Quick Login Info */}
                <div className="mt-6 text-center">
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm">
                        <strong>Demo:</strong> admin@example.com / admin
                    </div>
                </div>
            </div>
        </div>
    );
}
