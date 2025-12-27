import { useUser } from "./userContext";

// Manager pages
import ManagerHome from "../pages/manager/ManagerHome";
import UserRoles from "../pages/manager/UserRoles";
import Analytics from "../pages/manager/Analytics";
import ManagerLayout from "../pages/manager/ManagerLayout";
import ManagerSettings from "../pages/manager/ManagerSettings";
// Unused imports removed


// Technician pages
import StaffHome from "../pages/technician/StaffHome";
import Announcements from "../pages/technician/Announcements";
import Attendance from "../pages/technician/Attendance";
import StaffSettings from "../pages/technician/StaffSettings";
import NotFound from "../pages/NotFound";
import StaffLayout from "../pages/technician/StaffLayout";

// Employee pages
import EmployeeHome from "../pages/employee/EmployeeHome";
import EmployeeSettings from "../pages/employee/EmployeeSettings";
import EmployeeLayout from "../pages/employee/EmployeeLayout";

export default function RoleRoute({ page }) {
    const { user } = useUser();

    if (!user) return null;

    const role = user.role;

    const managerPages = {
        home: <ManagerHome />,
        userRoles: <UserRoles />,
        analytics: <Analytics />,
        settings: <ManagerSettings />,
    };

    const staffPages = {
        home: <StaffHome />,
        announcements: <Announcements />,
        attendance: <Attendance />,
        settings: <StaffSettings />,
    };

    const employeePages = {
        home: <EmployeeHome />,
        announcements: <Announcements />,
        attendance: <Attendance />,
        settings: <EmployeeSettings />,
    };

    if (role === "manager") return <ManagerLayout>{managerPages[page] || <NotFound />}</ManagerLayout>;
    if (role === "technician") return <StaffLayout>{staffPages[page] || <NotFound />}</StaffLayout>;
    if (role === "employee") return <EmployeeLayout>{employeePages[page] || <NotFound />}</EmployeeLayout>;

    return <h2>❌ Unknown role</h2>;
}
