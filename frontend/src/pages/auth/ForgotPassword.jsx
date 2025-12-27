import { useState, useRef, useEffect } from "react";
import Header from "../../components/Header";
import axiosInstance from "../../utils/axiosInstance";
import { HiOutlineLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import LoadingSpinner from "../../components/LoadingSpinner";
import PasswordValidation from "../../components/PasswordValidation";

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [resetToken, setResetToken] = useState("");
    const [message, setMessage] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);

    const inputRefs = useRef([]);

    // STEP 1 — SUBMIT EMAIL
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            await axiosInstance.post("/auth/forgot-password", { email });
            setMessage("Verification code sent to your email.");
            setStep(2);
        } catch (err) {
            setMessage(err.response?.data?.message || "Email not found.");
        } finally {
            setLoading(false);
        }
    };

    // STEP 2 — OTP INPUT HANDLER
    const handleOtpChange = (value, index) => {
        if (/^\d{0,1}$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < 5) inputRefs.current[index + 1].focus();
            if (!value && index > 0) inputRefs.current[index - 1].focus();
        }
    };

    // SUPPORT PASTING FULL OTP
    const handleOtpPaste = (e) => {
        const paste = e.clipboardData.getData("text").trim();
        if (!/^\d{6}$/.test(paste)) return;

        const digits = paste.split("");
        setOtp(digits);

        // Focus last box
        inputRefs.current[5]?.focus();
    };

    // SUBMIT OTP
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const code = otp.join("");
        setLoading(true);

        try {
            const res = await axiosInstance.post("/auth/verify-otp", { email, code });
            setResetToken(res.data.resetToken);
            setMessage("OTP verified! Set your new password.");
            setStep(3);
        } catch (err) {
            setMessage(err.response?.data?.message || "Invalid OTP.");
        } finally {
            setLoading(false);
        }
    };

    // STEP 3 — RESET PASSWORD
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (password !== confirmPass) {
            setMessage("Passwords do not match.");
            return;
        }
        setLoading(true);

        try {
            await axiosInstance.post("/auth/reset-password", {
                email,
                newPassword: password,
                resetToken,
            });

            setMessage("Password changed successfully! Redirecting...");
            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);
        } catch (err) {
            setMessage(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (message.length > 0) {
            const timer = setTimeout(() => setMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div className="min-h-screen bg-pearl-aqua/20">
            <Header />

            <div className="flex mt-5 justify-center ">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
                    <div className="flex flex-col mb-6 text-dark-teal">
                        <h2 className="text-2xl font-bold  text-center">Forgot Password</h2>
                        <h3 className="font-medium text-lg text-center">step {step} of 3</h3>
                    </div>

                    {message && <p className="text-center bg-blue-100 text-blue-700 p-3 rounded-xl mb-4 text-sm">{message}</p>}
                    <LoadingSpinner />
                    {/* ---------- STEP 1: EMAIL ---------- */}
                    {step === 1 && (
                        <form
                            onSubmit={handleEmailSubmit}
                            className="space-y-5"
                        >
                            <div className="bg-gray-100 px-4 py-3 rounded-xl shadow-sm">
                                <input
                                    type="email"
                                    placeholder="Enter your registered email"
                                    className="w-full bg-transparent outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <p className="text-right text-gray-600 mt-6 text-sm">
                                Back to login?{" "}
                                <a
                                    href="/login"
                                    className="text-dark-cyan font-semibold hover:underline"
                                >
                                    Login
                                </a>
                            </p>

                            <button
                                type="submit"
                                className="w-full bg-golden-orange flex justify-center items-center gap-4 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-golden-orange/90 transition"
                            >
                                {loading && <LoadingSpinner className={"w-4 border-2"} />}
                                Send OTP
                            </button>
                        </form>
                    )}

                    {/* ---------- STEP 2: OTP ---------- */}
                    {step === 2 && (
                        <form onSubmit={handleOtpSubmit}>
                            <p className="text-center text-gray-600 mb-4">Enter the 6-digit code sent to your email</p>

                            <div className="flex mx-6 justify-between mb-6">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        maxLength="1"
                                        className="w-12 h-12 text-center text-xl border-2 border-neutral-400 rounded-xl shadow-sm outline-dark-cyan"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e.target.value, index)}
                                        onPaste={index === 0 ? handleOtpPaste : undefined}
                                    />
                                ))}
                            </div>
                            <p className="text-center text-gray-600 mb-4">
                                Didn't receive the code?{" "}
                                <button
                                    type="button"
                                    className="text-dark-teal hover:underline"
                                    // onClick={handleResendOtp}
                                >
                                    Resend OTP
                                </button>
                            </p>

                            <button
                                type="submit"
                                className="w-full bg-golden-orange flex justify-center items-center gap-4 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-golden-orange/90 transition"
                                // className="w-full bg-dark-teal flex justify-center items-center gap-4 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-dark-cyan transition"
                            >
                                {loading && <LoadingSpinner className={"w-4 border-2"} />}
                                Verify OTP
                            </button>
                        </form>
                    )}

                    {/* ---------- STEP 3: NEW PASSWORD ---------- */}
                    {step === 3 && (
                        <form
                            onSubmit={handlePasswordSubmit}
                            className="space-y-5"
                        >
                            {/* NEW PASSWORD */}
                            <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3 shadow-sm relative">
                                <HiOutlineLockClosed
                                    className="text-dark-teal"
                                    size={20}
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    className="w-full bg-transparent outline-none"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 text-dark-teal hover:text-dark-cyan"
                                >
                                    {showPassword ? <HiEye size={20} /> : <HiEyeOff size={20} />}
                                </button>
                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3 shadow-sm relative">
                                <HiOutlineLockClosed
                                    className="text-dark-teal"
                                    size={20}
                                />
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Confirm password"
                                    className="w-full bg-transparent outline-none"
                                    value={confirmPass}
                                    onChange={(e) => setConfirmPass(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-4 text-dark-teal hover:text-dark-cyan"
                                >
                                    {showConfirm ? <HiEye size={20} /> : <HiEyeOff size={20} />}
                                </button>
                            </div>

                            <PasswordValidation
                                className={"mt-2 ml-5"}
                                password={password}
                            />

                            <button
                                type="submit"
                                className="w-full bg-golden-orange flex justify-center items-center gap-4 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-golden-orange/90 transition"
                            >
                                {loading && <LoadingSpinner className={"w-4 border-2"} />}
                                Reset Password
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
