import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import NotFound from "./pages/NotFound";
import { UserProvider } from "./utils/userContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import RoleRoute from "./utils/RoleRoute";
import ProjectColors from "./pages/ProjectColors";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Settings from "./pages/Settings";

// Placeholder imports - Component creation to follow immediately
import EquipmentList from "./pages/equipment/EquipmentList";
import EquipmentDetail from "./pages/equipment/EquipmentDetail";
import MaintenanceDashboard from "./pages/maintenance/MaintenanceDashboard";
import CalendarView from "./pages/maintenance/CalendarView";
import TeamManagement from "./pages/teams/TeamManagement";

const App = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    {/* Public Landing Page */}
                    <Route path="/" element={<LandingPage />} />

                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* Protected Application Routes */}
                    <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route path="/home" element={<Dashboard />} />

                        {/* Equipment Module */}
                        <Route path="/equipment" element={<EquipmentList />} />
                        <Route path="/equipment/:id" element={<EquipmentDetail />} />

                        {/* Maintenance Module */}
                        <Route path="/requests" element={<MaintenanceDashboard />} />
                        <Route path="/calendar" element={<CalendarView />} />

                        {/* Teams Module */}
                        <Route path="/teams" element={<TeamManagement />} />

                        {/* Legacy/Other Routes */}
                        <Route path="/announcements" element={<RoleRoute page="announcements" />} />
                        <Route path="/attendance" element={<RoleRoute page="attendance" />} />
                        <Route path="/user-roles" element={<RoleRoute page="userRoles" />} />
                        <Route path="/analytics" element={<RoleRoute page="analytics" />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/project-colors" element={<ProjectColors />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;
