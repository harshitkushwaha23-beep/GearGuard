import { useState, useEffect } from "react";
import Modal from "./Modal";
import axiosInstance from "../utils/axiosInstance";

const AddRequestModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        subject: "",
        type: "corrective",
        equipment_id: "",
        scheduled_date: ""
    });
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchEquipment();
        }
    }, [isOpen]);

    const fetchEquipment = async () => {
        try {
            const res = await axiosInstance.get("/equipment");
            setEquipment(res.data);
        } catch (error) {
            console.error("Error fetching equipment:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await axiosInstance.post("/requests", formData);
            onSuccess();
            onClose();
            setFormData({
                subject: "",
                type: "corrective",
                equipment_id: "",
                scheduled_date: ""
            });
        } catch (error) {
            setError(error.response?.data?.message || error.response?.data?.error || "Failed to create request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Maintenance Request">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Request Type *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: "corrective" })}
                            className={`px-4 py-3 rounded-xl border-2 font-medium transition-all ${formData.type === "corrective"
                                    ? "border-red-500 bg-red-50 text-red-700"
                                    : "border-neutral-200 text-slate-600 hover:border-neutral-300"
                                }`}
                        >
                            🔧 Corrective (Breakdown)
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: "preventive" })}
                            className={`px-4 py-3 rounded-xl border-2 font-medium transition-all ${formData.type === "preventive"
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-neutral-200 text-slate-600 hover:border-neutral-300"
                                }`}
                        >
                            📅 Preventive (Routine)
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Equipment *
                    </label>
                    <select
                        name="equipment_id"
                        value={formData.equipment_id}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-teal/20 focus:border-dark-teal transition-all"
                    >
                        <option value="">Select equipment</option>
                        {equipment.map(eq => (
                            <option key={eq.id} value={eq.id}>
                                {eq.name} ({eq.category})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Subject *
                    </label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-teal/20 focus:border-dark-teal transition-all"
                        placeholder="e.g., Oil leaking from hydraulic system"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Scheduled Date {formData.type === "preventive" && "*"}
                    </label>
                    <input
                        type="date"
                        name="scheduled_date"
                        value={formData.scheduled_date}
                        onChange={handleChange}
                        required={formData.type === "preventive"}
                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-teal/20 focus:border-dark-teal transition-all"
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border border-neutral-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-dark-teal text-white rounded-xl font-medium hover:bg-dark-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating..." : "Create Request"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddRequestModal;
