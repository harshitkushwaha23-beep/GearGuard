import { HiOutlineUserGroup } from "react-icons/hi";

const TeamManagement = () => {
    return (
        <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full text-slate-400 mb-6">
                <HiOutlineUserGroup size={40} />
            </div>
            <h1 className="text-2xl font-bold text-ink-black mb-2">Team Management</h1>
            <p className="text-slate-500 max-w-md mx-auto">
                Manage your specialized maintenance teams (Mechanics, Electricians, IT) and assign technicians.
                <br /><br />
                <span className="text-xs font-mono bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Coming Soon / Admin Only</span>
            </p>
        </div>
    );
};

export default TeamManagement;
