import { useState, useRef } from "react";
import { HiOutlineLockClosed, HiEye, HiEyeOff, HiOutlineUser, HiTrash } from "react-icons/hi";
import axiosInstance from "../../utils/axiosInstance";
import LoadingSpinner from "../../components/LoadingSpinner";
import PasswordValidation from "../../components/PasswordValidation";
import { useUser } from "../../utils/userContext";
import DeletePopUp from "../../components/DeletePopUp";

const StaffSettings = () => {
    const { user, setUser, logout } = useUser();

    const [name, setName] = useState(user.name);
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // ---------- UPDATE NAME ----------
    const handleNameUpdate = async () => {
        setLoading(true);
        setMessage("");

        try {
            await axiosInstance.patch("/user/update-name", { name });
            setUser({ ...user, name });
            setMessage("Name updated successfully!");
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to update name.");
        } finally {
            setLoading(false);
        }
    };

    // ---------- RESET PASSWORD ----------
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (password !== confirmPass) {
            setMessage("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await axiosInstance.post("/auth/reset-password-with-login", {
                newPassword: password,
            });
            setMessage("Password changed successfully!");
            setPassword("");
            setConfirmPass("");
        } catch (err) {
            setMessage(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    // ---------- DELETE ACCOUNT ----------
    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            await axiosInstance.delete("/user/delete-account");
            logout();
        } catch {
            setMessage("Failed to delete account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-4xl font-bold">Settings</h1>

            <div className="max-w-xl mt-6 space-y-8">
                {message && <p className="text-center bg-blue-100 text-blue-700 p-3 rounded-xl text-sm">{message}</p>}

                {/* UPDATE NAME */}
                <div>
                    <h2 className="text-xl font-semibold mb-3">Update Name</h2>
                    <div className="flex gap-3">
                        <div className="flex items-center bg-gray-100 px-4 py-3 rounded-xl w-full">
                            <HiOutlineUser
                                className="text-dark-teal mr-2"
                                size={20}
                            />
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-transparent w-full outline-none"
                            />
                        </div>
                        <button
                            onClick={handleNameUpdate}
                            disabled={name === user.name || loading}
                            className="bg-dark-teal text-white px-5 rounded-xl hover:bg-dark-cyan transition disabled:cursor-not-allowed"
                        >
                            Save
                        </button>
                    </div>
                </div>

                {/* RESET PASSWORD */}
                <form
                    onSubmit={handlePasswordSubmit}
                    className="space-y-5"
                >
                    <h2 className="text-xl font-semibold">Change Password</h2>

                    {/* PASSWORD */}
                    <div className="flex items-center bg-gray-100 px-4 py-3 rounded-xl relative">
                        <HiOutlineLockClosed
                            className="text-dark-teal"
                            size={20}
                        />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New password"
                            className="bg-transparent w-full ml-3 outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4"
                        >
                            {showPassword ? <HiEye /> : <HiEyeOff />}
                        </button>
                    </div>

                    {/* CONFIRM */}
                    <div className="flex items-center bg-gray-100 px-4 py-3 rounded-xl relative">
                        <HiOutlineLockClosed
                            className="text-dark-teal"
                            size={20}
                        />
                        <input
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirm password"
                            className="bg-transparent w-full ml-3 outline-none"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-4"
                        >
                            {showConfirm ? <HiEye /> : <HiEyeOff />}
                        </button>
                    </div>

                    <PasswordValidation password={password} />

                    <button className="w-full bg-golden-orange text-white py-3 rounded-xl font-semibold">
                        {loading ? <LoadingSpinner /> : "Reset Password"}
                    </button>
                </form>

                {/* DELETE ACCOUNT */}
                <div className="border-t pt-6">
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-2 text-red-600 hover:underline"
                    >
                        <HiTrash /> Delete Account
                    </button>
                </div>
            </div>

            <DeletePopUp
                show={showDeleteModal}
                setShow={setShowDeleteModal}
                func={handleDeleteAccount}
            />
        </div>
    );
};

export default StaffSettings;
