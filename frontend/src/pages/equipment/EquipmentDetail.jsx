import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineUserGroup } from "react-icons/hi";
import axiosInstance from "../../utils/axiosInstance";
import SmartButton from "../../components/SmartButton";

const EquipmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch specific equipment (using list endpoint with filter for now or find in state not ideal, better fetch all and find or if backend supported id)
        // Backend text said "Get active equipment", let's assume valid ID fetch or list usage.
        // Wait, backend `getEquipment` returns ALL. 
        // I will just fetch all and filter in frontend for this Hackathon MVP speed.
        // Ideally backend should have `getEquipmentById`.
        const fetchEquipmentDetails = async () => {
            try {
                const res = await axiosInstance.get("/equipment");
                const found = res.data.find(e => e.id === parseInt(id));
                setEquipment(found);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching equipment:", error);
                setLoading(false);
            }
        };
        fetchEquipmentDetails();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading details...</div>;
    if (!equipment) return <div className="p-8 text-center text-slate-500">Equipment not found</div>;

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate("/equipment")}
                className="flex items-center gap-2 text-slate-500 hover:text-dark-teal transition-colors"
            >
                <HiOutlineArrowLeft /> Back to Equipment
            </button>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-6 w-full">
                    {/* Header */}
                    <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6">
                            <SmartButton
                                count={equipment.open_requests_count || 0}
                                onClick={() => navigate(`/requests?equipment=${equipment.id}`)}
                            />
                        </div>

                        <div className="pr-32"> {/* Space for Smart Button */}
                            <h1 className="text-3xl font-bold text-ink-black mb-2">{equipment.name}</h1>
                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">
                                {equipment.category}
                            </span>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                            <h2 className="text-lg font-bold text-ink-black mb-4 border-b border-neutral-100 pb-2">Technical Info</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Serial Number</label>
                                    <p className="text-slate-700 font-mono">{equipment.serial_number || "N/A"}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <HiOutlineLocationMarker className="text-slate-400" />
                                    <div>
                                        <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Location</label>
                                        <p className="text-slate-700">{equipment.location || "Unknown"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <HiOutlineCalendar className="text-slate-400" />
                                    <div>
                                        <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Purchase Date</label>
                                        <p className="text-slate-700">{equipment.purchase_date ? new Date(equipment.purchase_date).toLocaleDateString() : "N/A"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <HiOutlineCalendar className="text-slate-400" />
                                    <div>
                                        <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Warranty End</label>
                                        <p className="text-slate-700">{equipment.warranty_end ? new Date(equipment.warranty_end).toLocaleDateString() : "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                            <h2 className="text-lg font-bold text-ink-black mb-4 border-b border-neutral-100 pb-2">Maintenance Team</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-dark-teal">
                                        <HiOutlineUserGroup size={24} />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Assigned Team</label>
                                        <p className="text-slate-700 font-medium">{equipment.team_id ? "Team #" + equipment.team_id : "No dedicated team"}</p>
                                        {/* Ideally fetch team name, need new backend endpoint or join */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentDetail;
