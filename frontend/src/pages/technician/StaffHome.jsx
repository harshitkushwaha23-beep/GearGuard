import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineClipboardList, HiOutlineCheckCircle, HiOutlineClock } from "react-icons/hi";
import axiosInstance from "../../utils/axiosInstance";
import { useUser } from "../../utils/userContext";

const StaffHome = () => {
    const { user } = useUser();
    const [assignedRequests, setAssignedRequests] = useState([]);
    const [stats, setStats] = useState({
        assigned: 0,
        completed: 0,
        inProgress: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssignedRequests();
    }, []);

    const fetchAssignedRequests = async () => {
        try {
            const res = await axiosInstance.get("/requests");
            // Filter to show only requests assigned to this technician
            const techRequests = res.data.filter(r => r.assigned_to === user.id);
            setAssignedRequests(techRequests);

            // Calculate stats
            setStats({
                assigned: techRequests.filter(r => r.status === 'new').length,
                inProgress: techRequests.filter(r => r.status === 'in_progress').length,
                completed: techRequests.filter(r => r.status === 'repaired').length
            });

            setLoading(false);
        } catch (error) {
            console.error("Error fetching requests:", error);
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-ink-black mb-2">Technician Dashboard</h1>
                <p className="text-slate-500">Manage your assigned maintenance tasks</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">Assigned</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.assigned}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-100">
                            <HiOutlineClipboardList size={28} className="text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">In Progress</p>
                            <p className="text-3xl font-bold text-orange-600">{stats.inProgress}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-orange-100">
                            <HiOutlineClock size={28} className="text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">Completed</p>
                            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-green-100">
                            <HiOutlineCheckCircle size={28} className="text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Action */}
            <Link to="/requests" className="block">
                <div className="bg-gradient-to-r from-dark-teal to-dark-cyan p-6 rounded-2xl text-white hover:shadow-lg transition-all">
                    <h3 className="text-xl font-bold mb-2">Go to Kanban Board</h3>
                    <p className="text-pearl-aqua">View and update all maintenance requests</p>
                </div>
            </Link>

            {/* Assigned Requests */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm">
                <div className="p-6 border-b border-neutral-100">
                    <h2 className="text-xl font-bold text-ink-black">My Assigned Tasks</h2>
                </div>
                <div className="divide-y divide-neutral-100">
                    {loading ? (
                        <p className="text-center py-8 text-slate-400">Loading...</p>
                    ) : assignedRequests.length === 0 ? (
                        <p className="text-center py-8 text-slate-400">No tasks assigned yet</p>
                    ) : (
                        assignedRequests.slice(0, 5).map(request => (
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
                                            <span className={`text-xs px-2 py-0.5 rounded ${request.type === 'corrective' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                {request.type === 'corrective' ? 'Breakdown' : 'Routine'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500">{request.equipment_name}</p>
                                        {request.scheduled_date && (
                                            <p className="text-xs text-slate-400 mt-1">
                                                Scheduled: {new Date(request.scheduled_date).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffHome;
