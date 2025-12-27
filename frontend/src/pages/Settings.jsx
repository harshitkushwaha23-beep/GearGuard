import { useState } from "react";
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlineLogout } from "react-icons/hi";
import { useUser } from "../utils/userContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Settings = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [message, setMessage] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        setLoading(true);

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match" });
            setLoading(false);
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setMessage({ type: "error", text: "Password must be at least 6 characters" });
            setLoading(false);
            return;
        }

        try {
            // Note: This endpoint would need to be created in the backend
            await axiosInstance.patch("/user/change-password", {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            setMessage({ type: "success", text: "Password changed successfully" });
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Failed to change password"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-ink-black mb-2">Settings</h1>
                <p className="text-slate-500">Manage your account preferences and security</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-neutral-200">
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`px-4 py-3 font-medium transition-colors ${activeTab === "profile"
                            ? "text-dark-teal border-b-2 border-dark-teal"
                            : "text-slate-500 hover:text-ink-black"
                        }`}
                >
                    Profile
                </button>
                <button
                    onClick={() => setActiveTab("security")}
                    className={`px-4 py-3 font-medium transition-colors ${activeTab === "security"
                            ? "text-dark-teal border-b-2 border-dark-teal"
                            : "text-slate-500 hover:text-ink-black"
                        }`}
                >
                    Security
                </button>
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
                <div className="bg-white rounded-2xl border border-neutral-200 p-8 space-y-6">
                    <h2 className="text-xl font-bold text-ink-black mb-4">Profile Information</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    value={user.name}
                                    disabled
                                    className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-xl bg-slate-50 text-slate-600"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-xl bg-slate-50 text-slate-600"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Role
                            </label>
                            <div className="px-4 py-3 border border-neutral-200 rounded-xl bg-slate-50">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.role === 'manager' ? 'bg-purple-100 text-purple-700' :
                                        user.role === 'technician' ? 'bg-blue-100 text-blue-700' :
                                            'bg-green-100 text-green-700'
                                    }`}>
                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 text-sm text-slate-500">
                        <p>* Profile information cannot be edited. Contact your administrator for changes.</p>
                    </div>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
                <div className="bg-white rounded-2xl border border-neutral-200 p-8 space-y-6">
                    <h2 className="text-xl font-bold text-ink-black mb-4">Change Password</h2>

                    {message.text && (
                        <div className={`px-4 py-3 rounded-xl text-sm ${message.type === "success"
                                ? "bg-green-50 border border-green-200 text-green-700"
                                : "bg-red-50 border border-red-200 text-red-700"
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dark-teal/20 focus:border-dark-teal transition-all"
                                    placeholder="Enter current password"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dark-teal/20 focus:border-dark-teal transition-all"
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dark-teal/20 focus:border-dark-teal transition-all"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-dark-teal text-white py-3 rounded-xl font-semibold hover:bg-dark-cyan transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>

                    <div className="pt-6 border-t border-neutral-200">
                        <h3 className="font-semibold text-ink-black mb-3">Danger Zone</h3>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors"
                        >
                            <HiOutlineLogout size={20} />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
