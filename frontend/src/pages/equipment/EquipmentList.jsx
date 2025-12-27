import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineSearch, HiOutlinePlus, HiOutlineCube } from "react-icons/hi";
import axiosInstance from "../../utils/axiosInstance";
import AddEquipmentModal from "../../components/AddEquipmentModal";

const EquipmentList = () => {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        try {
            const res = await axiosInstance.get("/equipment");
            setEquipment(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching equipment:", error);
            setLoading(false);
        }
    };

    const filteredEquipment = equipment.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.serial_number?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-ink-black">Equipment</h1>
                    <p className="text-slate-500">Manage company assets and their maintenance.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-dark-teal text-white rounded-xl hover:bg-dark-cyan transition-colors shadow-md font-medium"
                >
                    <HiOutlinePlus size={20} />
                    Add Equipment
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by name or serial number..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dark-teal/20 focus:border-dark-teal transition-all"
                />
            </div>

            {/* Grid */}
            {loading ? (
                <div className="text-center py-10 text-slate-500">Loading equipment...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredEquipment.map((item) => (
                        <Link
                            key={item.id}
                            to={`/equipment/${item.id}`}
                            className="bg-white p-5 rounded-2xl border border-neutral-200 hover:shadow-lg hover:border-dark-teal/30 transition-all group"
                        >
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-dark-teal mb-4 group-hover:scale-110 transition-transform">
                                <HiOutlineCube size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-ink-black mb-1">{item.name}</h3>
                            <p className="text-sm text-slate-500 mb-4">{item.category}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
                                    {item.serial_number || "N/A"}
                                </span>
                                {item.open_requests_count > 0 && (
                                    <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                        {item.open_requests_count} Issues
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}

                    {filteredEquipment.length === 0 && (
                        <div className="col-span-full text-center py-10 text-slate-400">
                            No equipment found. By adding some!
                        </div>
                    )}
                </div>
            )}

            <AddEquipmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchEquipment}
            />
        </div>
    );
};

export default EquipmentList;
