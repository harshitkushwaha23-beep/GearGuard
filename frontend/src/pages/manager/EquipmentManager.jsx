import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { FaPlus, FaWrench, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EquipmentManager = () => {
    const [equipment, setEquipment] = useState([]);
    const [teams, setTeams] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        serial_number: "",
        location: "",
        purchase_date: "",
        warranty_end: "",
        team_id: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [eqRes, teamRes] = await Promise.all([
                axiosInstance.get("/equipment"),
                axiosInstance.get("/teams"),
            ]);
            setEquipment(eqRes.data);
            setTeams(teamRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post("/equipment", formData);
            setShowModal(false);
            setFormData({
                name: "",
                category: "",
                serial_number: "",
                location: "",
                purchase_date: "",
                warranty_end: "",
                team_id: "",
            });
            fetchData();
        } catch (error) {
            console.error("Error creating equipment:", error);
            alert("Failed to create equipment");
        }
    };

    const handleScrap = async (id) => {
        if (window.confirm("Are you sure you want to scrap this equipment? It will be marked as unusable.")) {
            try {
                await axiosInstance.patch(`/equipment/${id}/scrap`);
                fetchData();
            } catch (error) {
                console.error("Error scrapping equipment:", error);
            }
        }
    };

    const handleSmartClick = (id) => {
        // Navigate to Requests page with filter
        navigate(`/requests?equipment_id=${id}`);
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Equipment Management</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-dark-cyan text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-dark-cyan/90 transition"
                >
                    <FaPlus /> Add Equipment
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {equipment.map((item) => (
                        <div key={item.id} className="bg-white p-5 rounded-xl shadow border border-gray-100 relative">
                             {item.is_scrapped && (
                                <div className="absolute top-2 right-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                                    SCRAPPED
                                </div>
                            )}
                            <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
                            <p className="text-sm text-gray-500 mb-3">{item.category}</p>
                            
                            <div className="text-sm text-gray-600 space-y-1 mb-4">
                                <p><strong>Serial:</strong> {item.serial_number}</p>
                                <p><strong>Location:</strong> {item.location}</p>
                                <p><strong>Team:</strong> {teams.find(t => t.id === item.team_id)?.name || 'N/A'}</p>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <button
                                    onClick={() => handleSmartClick(item.id)}
                                    className="flex items-center gap-2 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition"
                                >
                                    <FaWrench />
                                    {item.open_requests_count} Open Requests
                                </button>
                                
                                {!item.is_scrapped && (
                                    <button 
                                        onClick={() => handleScrap(item.id)}
                                        className="text-red-400 hover:text-red-600 transition"
                                        title="Scrap Equipment"
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">Add New Equipment</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} className="border p-2 rounded w-full" required />
                                <input name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} className="border p-2 rounded w-full" required />
                            </div>
                            <input name="serial_number" placeholder="Serial Number" value={formData.serial_number} onChange={handleInputChange} className="border p-2 rounded w-full" required />
                            <input name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} className="border p-2 rounded w-full" required />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500">Purchase Date</label>
                                    <input type="date" name="purchase_date" value={formData.purchase_date} onChange={handleInputChange} className="border p-2 rounded w-full" required />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Warranty End</label>
                                    <input type="date" name="warranty_end" value={formData.warranty_end} onChange={handleInputChange} className="border p-2 rounded w-full" required />
                                </div>
                            </div>
                            <select name="team_id" value={formData.team_id} onChange={handleInputChange} className="border p-2 rounded w-full" required>
                                <option value="">Select Maintenance Team</option>
                                {teams.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>

                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-dark-cyan text-white rounded hover:bg-dark-cyan/90">Add Equipment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EquipmentManager;
