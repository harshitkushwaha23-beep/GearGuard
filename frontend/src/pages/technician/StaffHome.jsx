import { useUser } from "../../utils/userContext";

const StaffHome = () => {
    const { user, logout } = useUser();
    return (
        <div className="">
            <h1 className="text-3xl font-bold">Staff Dashboard</h1>

            <div className="mt-6 bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">Your Info</h2>

                <p>
                    <strong>Name:</strong> {user.name}
                </p>
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
                <p>
                    <strong>Role:</strong> {user.role}
                </p>

                <button
                    onClick={logout}
                    className="mt-5 px-4 py-2 bg-red-500 text-white rounded"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default StaffHome;
