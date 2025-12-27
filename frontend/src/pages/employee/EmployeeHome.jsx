import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineClipboardList, HiOutlineCube } from "react-icons/hi";
import axiosInstance from "../../utils/axiosInstance";
import { useUser } from "../../utils/userContext";

const EmployeeHome = () => {
    const { user } = useUser();
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyRequests();
    }, []);

    const fetchMyRequests = async () => {
        try {
            const res = await axiosInstance.get("/requests");
            // Filter to show only requests created by this user
            const userRequests = res.data.filter(r => r.requested_by === user.id);
            setMyRequests(userRequests);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching requests:", error);
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-ink-black mb-2">Employee Dashboard</h1>
                <p className="text-slate-500">View your equipment and submit maintenance requests</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/equipment" className="bg-white p-6 rounded-2xl border border-neutral-200 hover:shadow-lg transition-all group">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">View</p>
                            <p className="text-2xl font-bold text-dark-teal">Equipment</p>
                        </div>
                        <div className="p-3 rounded-xl bg-dark-teal/10 group-hover:scale-110 transition-transform">
                            <HiOutlineCube size={28} className="text-dark-teal" />
                        </div>
                    </div>
                </Link>

                <Link to="/requests" className="bg-white p-6 rounded-2xl border border-neutral-200 hover:shadow-lg transition-all group">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">View</p>
                            <p className="text-2xl font-bold text-blue-600">My Requests</p>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-100 group-hover:scale-110 transition-transform">
                            <HiOutlineClipboardList size={28} className="text-blue-600" />
                        </div>
                    </div>
                </Link>
            </div>

            {/* My Requests */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm">
                <div className="p-6 border-b border-neutral-100">
                    <h2 className="text-xl font-bold text-ink-black">My Maintenance Requests</h2>
                </div>
                <div className="divide-y divide-neutral-100">
                    {loading ? (
                        <p className="text-center py-8 text-slate-400">Loading...</p>
                    ) : myRequests.length === 0 ? (
                        <p className="text-center py-8 text-slate-400">No requests yet. Submit one using the Maintenance page!</p>
                    ) : (
                        myRequests.map(request => (
                            <div key={request.id} className="p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-ink-black">{request.subject}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${request.status === 'new' ? 'bg-blue-100 text-blue-700' :
                                                    request.status === 'in_progress' ? 'bg-orange-100 text-orange-700' :
                                                        request.status === 'repaired' ? 'bg-green-100 text-green-700' :
                                                            'bg-slate-100 text-slate-700'
                                                }`}>
                                                {request.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500">{request.equipment_name}</p>
                                        {request.technician && (
                                            <p className="text-xs text-slate-400 mt-1">Assigned to: {request.technician}</p>
                                        )}
                                    </div>
                                    <span className="text-xs text-slate-400">
                                        {new Date(request.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeHome;
