import { useNavigate } from "react-router-dom";
import { HiOutlineClipboardList } from "react-icons/hi";

const SmartButton = ({ count, onClick, label = "Requests" }) => {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center w-24 h-20 bg-white border border-neutral-200 rounded-lg shadow-sm hover:shadow-md hover:border-dark-teal/50 transition-all group"
        >
            <div className="flex items-center gap-2 mb-1">
                <HiOutlineClipboardList className="text-dark-teal group-hover:scale-110 transition-transform" size={20} />
                <span className="text-xl font-bold text-ink-black">{count}</span>
            </div>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</span>
        </button>
    );
};

export default SmartButton;
