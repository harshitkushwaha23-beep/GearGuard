import { useState, useEffect } from "react";
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HiOutlineUser, HiOutlineClock, HiOutlineExclamationCircle } from "react-icons/hi";
import axiosInstance from "../../utils/axiosInstance";
import AddRequestModal from "../../components/AddRequestModal";

// Kanban Column Component
const KanbanColumn = ({ id, title, requests, color }) => {
    const { setNodeRef } = useSortable({ id });
    return (
        <div ref={setNodeRef} className="flex-1 min-w-[300px] bg-slate-50 border border-neutral-200 rounded-2xl p-4 flex flex-col h-full">
            <h3 className={`font-bold text-sm uppercase tracking-wider mb-4 ${color}`}>{title} ({requests.length})</h3>
            <SortableContext items={requests.map(r => r.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3 flex-1 overflow-y-auto min-h-[100px]">
                    {requests.map(req => (
                        <KanbanCard key={req.id} request={req} />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
};

// Kanban Card Component
const KanbanCard = ({ request }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: request.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200 hover:shadow-md cursor-grab active:cursor-grabbing touch-none">
            <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${request.type === 'corrective' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                    {request.type === 'corrective' ? 'Breakdown' : 'Routine'}
                </span>
                {request.scheduled_date && new Date(request.scheduled_date) < new Date() && request.status !== 'repaired' && (
                    <HiOutlineExclamationCircle className="text-red-500" title="Overdue" />
                )}
            </div>
            <h4 className="font-bold text-ink-black text-sm mb-1">{request.subject}</h4>
            <p className="text-xs text-slate-500 mb-3 line-clamp-1">{request.equipment_name}</p>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-50 mt-2">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                    <HiOutlineClock size={14} />
                    <span>{request.scheduled_date ? new Date(request.scheduled_date).toLocaleDateString() : 'Unscheduled'}</span>
                </div>
                {request.technician && (
                    <div className="w-6 h-6 rounded-full bg-dark-teal text-white flex items-center justify-center text-xs" title={request.technician}>
                        <HiOutlineUser size={12} />
                    </div>
                )}
            </div>
        </div>
    );
};


const MaintenanceDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await axiosInstance.get("/requests");
            setRequests(res.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    const getColumns = () => {
        return {
            new: requests.filter(r => r.status === 'new'),
            in_progress: requests.filter(r => r.status === 'in_progress'),
            repaired: requests.filter(r => r.status === 'repaired'),
            scrap: requests.filter(r => r.status === 'scrap'),
        };
    };

    const columns = getColumns();

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id;
        // Find which column we dropped over
        // If dropped over a container (column), id is status.
        // If dropped over a card, we need to find that card's status.
        let newStatus = over.id;

        // Check if over.id is a status key
        if (!['new', 'in_progress', 'repaired', 'scrap'].includes(newStatus)) {
            // It's a card ID, find the card
            const overRequest = requests.find(r => r.id === over.id);
            if (overRequest) {
                newStatus = overRequest.status;
            } else {
                return; // Can't determine status
            }
        }

        const request = requests.find(r => r.id === activeId);
        if (request && request.status !== newStatus) {
            // Optimistic Update
            setRequests(requests.map(r => r.id === activeId ? { ...r, status: newStatus } : r));

            try {
                // Determine duration if moving to repaired? For now just status.
                await axiosInstance.patch(`/requests/${activeId}/status`, { status: newStatus });
            } catch (error) {
                console.error("Error updating status:", error);
                // Revert
                fetchRequests();
            }
        }
    };

    const activeRequest = activeId ? requests.find(r => r.id === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="h-[calc(100vh-140px)] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-ink-black">Maintenance Board</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-dark-teal text-white rounded-xl shadow-md font-medium text-sm"
                    >
                        + New Request
                    </button>
                </div>

                <div className="flex gap-4 h-full overflow-x-auto pb-4">
                    <KanbanColumn id="new" title="New" requests={columns.new} color="text-blue-600" />
                    <KanbanColumn id="in_progress" title="In Progress" requests={columns.in_progress} color="text-orange-600" />
                    <KanbanColumn id="repaired" title="Repaired" requests={columns.repaired} color="text-green-600" />
                    <KanbanColumn id="scrap" title="Scrap" requests={columns.scrap} color="text-slate-500" />
                </div>
            </div>

            <DragOverlay>
                {activeRequest ? <KanbanCard request={activeRequest} /> : null}
            </DragOverlay>

            <AddRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchRequests}
            />
        </DndContext>
    );
};

export default MaintenanceDashboard;
