import { useEffect, useState } from "react";
import { HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import axiosInstance from "../../utils/axiosInstance";
import Header from "../../components/Header";
import login from "../../assets/images/login.png";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../utils/userContext";

export default function Login() {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Required fields
        if (!form.email || !form.password) {
            setError("Please enter both email and password.");
            return;
        }

        // Email validation
        if (!validateEmail(form.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        try {
            const res = await axiosInstance.post("/auth/login", form);
            console.log(res.data.user);
            setUser(res.data.user);
            setSuccess("Login successful! Redirecting...");
            setTimeout(() => {
                navigate("/home");
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password.");
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/home");
        }
    }, [user]);

    return (
        <div className="min-h-screen flex flex-col items-center bg-pearl-aqua/20">
            <Header />
            <div className=" pt-8 flex justify-center w-full gap-40">
                <div>
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-dark-teal text-center mb-3">Welcome Back</h1>
                    <p className="text-center text-gray-600 mb-8">Login to continue managing your inventory</p>
                    <img
                        src={login}
                        alt=""
                        className="w-90"
                    />
                </div>

                <div className="bg-white h-max w-full max-w-md rounded-2xl shadow-xl p-8">
                    <p className="text-center text-dark-teal font-semibold text-xl mb-5">Enter your email and password</p>
                    {/* Error message */}
                    {error && <p className="text-red-600 bg-red-100 p-3 rounded-xl text-sm mb-4">{error}</p>}

                    {/* Success message */}
                    {success && <p className="text-green-700 bg-green-100 p-3 rounded-xl text-sm mb-4">{success}</p>}

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        {/* Email */}
                        <div>
                            {/* <label className="block mb-2 text-sm font-medium text-ink-black">Email</label> */}
                            <div
                                className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3 
                                        focus-within:ring-2 focus-within:ring-dark-cyan shadow-sm"
                            >
                                <HiOutlineMail
                                    className="text-dark-teal"
                                    size={20}
                                />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-transparent focus:outline-none text-ink-black"
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            {/* <label className="block mb-2 text-sm font-medium text-ink-black">Password</label> */}
                            <div
                                className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3 
                                        focus-within:ring-2 focus-within:ring-dark-cyan shadow-sm relative"
                            >
                                <HiOutlineLockClosed
                                    className="text-dark-teal"
                                    size={20}
                                />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="w-full bg-transparent focus:outline-none text-ink-black"
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                />

                                {/* Show / Hide Password Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 text-dark-teal hover:text-dark-cyan"
                                >
                                    {showPassword ? <HiEye size={20} /> : <HiEyeOff size={20} />}
                                </button>
                            </div>
                        </div>
                        <p className="text-right mt-2">
                            <span
                                onClick={() => {
                                    navigate("/forgot-password");
                                }}
                                className="text-dark-cyan cursor-pointer font-semibold hover:underline text-sm"
                            >
                                Forgot Password?
                            </span>
                        </p>

                        {/* Button */}
                        <button
                            type="submit"
                            className="w-full bg-golden-orange text-white py-3 rounded-xl text-lg 
                                   font-semibold hover:bg-burnt-caramel transition-all shadow-md"
                        >
                            Login
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-gray-600 mt-6 text-sm">
                        Don’t have an account?{" "}
                        <span
                            onClick={() => {
                                navigate("/signup");
                            }}
                            className="text-dark-cyan cursor-pointer font-semibold hover:underline"
                        >
                            Sign Up
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
