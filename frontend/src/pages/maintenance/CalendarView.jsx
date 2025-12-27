import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css'; // Import default styles, tailored in index.css
import axiosInstance from "../../utils/axiosInstance";
import { HiOutlineClock } from "react-icons/hi";

const CalendarView = () => {
    const [date, setDate] = useState(new Date());
    const [requests, setRequests] = useState([]);
    const [selectedDateRequests, setSelectedDateRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await axiosInstance.get("/requests");
            // Filter only preventive for calendar? Or all? User said "Preventive" in reqs.
            const preventive = res.data.filter(r => r.type === 'preventive' && r.scheduled_date);
            setRequests(preventive);
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    useEffect(() => {
        // Filter requests for selected date
        const filtered = requests.filter(r => {
            const d = new Date(r.scheduled_date);
            return d.getDate() === date.getDate() &&
                d.getMonth() === date.getMonth() &&
                d.getFullYear() === date.getFullYear();
        });
        setSelectedDateRequests(filtered);
    }, [date, requests]);

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dayRequests = requests.filter(r => {
                const d = new Date(r.scheduled_date);
                return d.getDate() === date.getDate() &&
                    d.getMonth() === date.getMonth() &&
                    d.getFullYear() === date.getFullYear();
            });

            if (dayRequests.length > 0) {
                return <div className="w-2 h-2 bg-dark-teal rounded-full mx-auto mt-1"></div>;
            }
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 space-y-6">
                <h1 className="text-2xl font-bold text-ink-black">Preventive Schedule</h1>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
                    <Calendar
                        onChange={setDate}
                        value={date}
                        tileContent={tileContent}
                        className="w-full border-none font-sans"
                    />
                </div>
            </div>

            <div className="lg:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 h-fit">
                <h2 className="text-lg font-bold text-ink-black mb-4">
                    {date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </h2>

                {selectedDateRequests.length === 0 ? (
                    <p className="text-slate-400 text-sm">No preventive maintenance scheduled.</p>
                ) : (
                    <div className="space-y-4">
                        {selectedDateRequests.map(req => (
                            <div key={req.id} className="p-4 bg-slate-50 rounded-xl border border-neutral-100">
                                <h4 className="font-bold text-ink-black text-sm">{req.subject}</h4>
                                <p className="text-xs text-slate-500 mb-2">{req.equipment_name}</p>
                                <div className="flex items-center gap-2 text-xs text-dark-teal font-medium">
                                    <HiOutlineClock />
                                    <span>Scheduled</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <button className="w-full mt-6 py-3 rounded-xl bg-slate-100 text-dark-teal font-medium hover:bg-slate-200 transition-colors">
                    + Schedule New
                </button>
            </div>
        </div>
    );
};

export default CalendarView;
