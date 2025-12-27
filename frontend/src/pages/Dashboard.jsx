import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineCube, HiOutlineClipboardList, HiOutlineCheckCircle, HiOutlineExclamationCircle } from "react-icons/hi";
import axiosInstance from "../utils/axiosInstance";

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalEquipment: 0,
        openRequests: 0,
        completedToday: 0,
        overdue: 0
    });
    const [recentRequests, setRecentRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [equipmentRes, requestsRes] = await Promise.all([
                axiosInstance.get("/equipment"),
                axiosInstance.get("/requests")
            ]);

            const equipment = equipmentRes.data;
            const requests = requestsRes.data;

            // Calculate stats
            const openRequests = requests.filter(r => r.status === 'new' || r.status === 'in_progress').length;
            const completedToday = requests.filter(r => {
                if (r.status !== 'repaired') return false;
                const today = new Date().toDateString();
                return new Date(r.created_at).toDateString() === today;
            }).length;

            const overdue = requests.filter(r => {
                if (!r.scheduled_date || r.status === 'repaired') return false;
                return new Date(r.scheduled_date) < new Date();
            }).length;

            setStats({
                totalEquipment: equipment.length,
                openRequests,
                completedToday,
                overdue
            });

            // Get 5 most recent requests
            setRecentRequests(requests.slice(0, 5));
            setLoading(false);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setLoading(false);
        }
    };

    const StatCard = ({ icon, label, value, color, link }) => (
        <Link to={link} className={`bg-white p-6 rounded-2xl border border-neutral-200 hover:shadow-lg transition-all group`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
                    <p className={`text-3xl font-bold ${color}`}>{value}</p>
                </div>
                <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-')}/10 group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
            </div>
        </Link>
    );

    if (loading) {
        return <div className="text-center py-10 text-slate-500">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-ink-black mb-2">Dashboard</h1>
                <p className="text-slate-500">Welcome back! Here's your maintenance overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<HiOutlineCube size={28} className="text-dark-teal" />}
                    label="Total Equipment"
                    value={stats.totalEquipment}
                    color="text-dark-teal"
                    link="/equipment"
                />
                <StatCard
                    icon={<HiOutlineClipboardList size={28} className="text-blue-600" />}
                    label="Open Requests"
                    value={stats.openRequests}
                    color="text-blue-600"
                    link="/requests"
                />
                <StatCard
                    icon={<HiOutlineCheckCircle size={28} className="text-green-600" />}
                    label="Completed Today"
                    value={stats.completedToday}
                    color="text-green-600"
                    link="/requests"
                />
                <StatCard
                    icon={<HiOutlineExclamationCircle size={28} className="text-red-600" />}
                    label="Overdue"
                    value={stats.overdue}
                    color="text-red-600"
                    link="/requests"
                />
            </div>

            {/* Recent Requests */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm">
                <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-ink-black">Recent Requests</h2>
                    <Link to="/requests" className="text-dark-teal hover:text-dark-cyan font-medium text-sm">
                        View All →
                    </Link>
                </div>
                <div className="divide-y divide-neutral-100">
                    {recentRequests.length === 0 ? (
                        <p className="text-center py-8 text-slate-400">No requests yet</p>
                    ) : (
                        recentRequests.map(request => (
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

export default Dashboard;
