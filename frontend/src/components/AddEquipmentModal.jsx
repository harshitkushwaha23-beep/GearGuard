import { useState, useEffect } from "react";
import Modal from "./Modal";
import axiosInstance from "../utils/axiosInstance";

const AddEquipmentModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        serial_number: "",
        location: "",
        purchase_date: "",
        warranty_end: "",
        team_id: ""
    });
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchTeams();
        }
    }, [isOpen]);

    const fetchTeams = async () => {
        try {
            const res = await axiosInstance.get("/teams");
            setTeams(res.data);
        } catch (error) {
            console.error("Error fetching teams:", error);
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
            await axiosInstance.post("/equipment", formData);
            onSuccess();
            onClose();
            setFormData({
                name: "",
                category: "",
                serial_number: "",
                location: "",
                purchase_date: "",
                warranty_end: "",
                team_id: ""
            });
        } catch (error) {
            setError(error.response?.data?.error || "Failed to add equipment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Equipment">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Equipment Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-teal/20 focus:border-dark-teal transition-all"
                            placeholder="e.g., CNC Machine"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Category *
                        </label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-teal/20 focus:border-dark-teal transition-all"
                            placeholder="e.g., Machinery"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Serial Number
                        </label>
                        <input
                            type="text"
                            name="serial_number"
                            value={formData.serial_number}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-teal/20 focus:border-dark-teal transition-all"
                            placeholder="e.g., SN-12345"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-teal/20 focus:border-dark-teal transition-all"
                            placeholder="e.g., Factory Floor A"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Purchase Date
                        </label>
                        <input
                            type="date"
                            name="purchase_date"
                            value={formData.purchase_date}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-teal/20 focus:border-dark-teal transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Warranty End
                        </label>
                        <input
                            type="date"
                            name="warranty_end"
                            value={formData.warranty_end}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-teal/20 focus:border-dark-teal transition-all"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Assigned Maintenance Team
                        </label>
                        <select
                            name="team_id"
                            value={formData.team_id}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-teal/20 focus:border-dark-teal transition-all"
                        >
                            <option value="">Select a team</option>
                            {teams.map(team => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </div>
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
                        {loading ? "Adding..." : "Add Equipment"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddEquipmentModal;
