import { useEffect, useRef, useState } from "react";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiEye, HiEyeOff } from "react-icons/hi";
import axiosInstance from "../../utils/axiosInstance";
import Header from "../../components/Header";
import signup from "../../assets/images/signup.png";

import { useNavigate } from "react-router-dom";
import PasswordValidation from "../../components/PasswordValidation";

export default function Signup() {
    const navigate = useNavigate();
    const passRef = useRef(null);
    const [firstFocused, setFirstFocused] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
        return passRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Required fields validation
        if (!form.name || !form.email || !form.password) {
            setError("All fields are required.");
            return;
        }

        // Email validation
        if (!validateEmail(form.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        // Password validation
        if (!validatePassword(form.password)) {
            setError("Password requirements are not met");
            return;
        }

        // Submit to backend
        try {
            await axiosInstance.post("/auth/signup", form);
            setSuccess("Account created successfully! You can now log in.");
            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed.");
        }
    };

    useEffect(() => {
        passRef.current.addEventListener("focus", () => {
            setFirstFocused(true);
        });
    }, [passRef]);

    return (
        <div className="min-h-screen flex flex-col items-center bg-pearl-aqua/20">
            <Header />
            <div className="w-full gap-28 flex justify-center  pt-8">
                <div>
                    {" "}
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-dark-teal text-center mb-2">Create an Account</h1>
                    <p className="text-center text-gray-600 mb-8">Start managing your inventory with ease</p>
                    <img
                        src={signup}
                        alt=""
                        className="w-120"
                    />
                </div>
                <div className="bg-white h-max w-full max-w-md rounded-2xl shadow-xl py-5 px-8">
                    <p className="text-center text-dark-teal font-semibold text-xl mb-4">Enter your details</p>
                    {/* Error message */}
                    {error && <p className="text-red-600 bg-red-100 py-3 px-3 rounded-xl text-sm mb-4">{error}</p>}

                    {/* Success message */}
                    {success && <p className="text-green-700 bg-green-100 py-2 px-3 rounded-xl text-sm mb-4">{success}</p>}

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        {/* Name */}
                        <div>
                            {/* <label className="block mb-2 text-sm font-medium text-ink-black">Full Name</label> */}
                            <div
                                className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3 
                                        focus-within:ring-2 focus-within:ring-dark-cyan shadow-sm"
                            >
                                <HiOutlineUser
                                    className="text-dark-teal"
                                    size={20}
                                />
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full bg-transparent focus:outline-none text-ink-black"
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                        </div>

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
                                        focus-within:ring-2 focus-within:ring-dark-cyan shadow-sm"
                            >
                                <HiOutlineLockClosed
                                    className="text-dark-teal"
                                    size={20}
                                />
                                <input
                                    ref={passRef}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Choose your password"
                                    className="w-full bg-transparent focus:outline-none text-ink-black"
                                    onChange={(e) => {
                                        setForm({ ...form, password: e.target.value });
                                        setPassword(e.target.value);
                                    }}
                                />
                                {showPassword ? (
                                    <HiEye
                                        className="text-dark-teal "
                                        size={20}
                                        onClick={() => setShowPassword(false)}
                                    />
                                ) : (
                                    <HiEyeOff
                                        className="text-dark-teal "
                                        size={20}
                                        onClick={() => setShowPassword(true)}
                                    />
                                )}
                            </div>
                        </div>

                        {firstFocused && (
                            <PasswordValidation
                                className={"mt-2 ml-1"}
                                password={password}
                            />
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-golden-orange text-white py-3 mt-3 rounded-xl
                                   text-lg font-semibold hover:bg-burnt-caramel transition-all shadow-md"
                        >
                            Sign Up
                        </button>
                    </form>

                    <p className="text-center text-gray-600 mt-6 text-sm">
                        Already have an account?{" "}
                        <span
                            onClick={() => {
                                navigate("/login");
                            }}
                            className="text-dark-cyan cursor-pointer font-semibold hover:underline"
                        >
                            Login
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
