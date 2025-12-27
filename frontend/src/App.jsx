import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import NotFound from "./pages/NotFound";
import { UserProvider } from "./utils/userContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import RoleRoute from "./utils/RoleRoute";
import Header from "./components/Header";
import ProjectColors from "./pages/ProjectColors";

const App = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    {/* Default Route */}{" "}
                    <Route
                        path="/"
                        element={
                            <div>
                                {" "}
                                <Header /> <ProjectColors />
                            </div>
                        }
                    />
                    {/* Auth */}
                    <Route
                        path="/login"
                        element={<Login />}
                    />
                    <Route
                        path="/signup"
                        element={<Signup />}
                    />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                    {/* Role-based visible routes */}
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <RoleRoute page="home" />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/announcements"
                        element={
                            <ProtectedRoute>
                                <RoleRoute page="announcements" />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/attendance"
                        element={
                            <ProtectedRoute>
                                <RoleRoute page="attendance" />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/user-roles"
                        element={
                            <ProtectedRoute>
                                <RoleRoute page="userRoles" />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/analytics"
                        element={
                            <ProtectedRoute>
                                <RoleRoute page="analytics" />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute>
                                <RoleRoute page="settings" />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="*"
                        element={<NotFound />}
                    />
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;
