import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Header from "../components/Header";

const NotFound = () => {
    return (
        <div className="flex flex-col justify-center w-full items-center flex-1 bg-gray-50 ">
            {/* <Header /> */}
            {/* Icon */}
            <div className="bg-white shadow-md mt-10 rounded-full p-6 mb-6">
                <HiOutlineExclamationCircle
                    className="text-dark-teal"
                    size={60}
                />
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-extrabold text-gray-800 mb-3">404</h1>

            {/* Subheading */}
            <p className="text-lg text-gray-600 mb-6 text-center max-w-md">Oops! The page you are looking for doesn’t exist or has been moved.</p>

            {/* Buttons */}
            <div className="flex space-x-4">
                <Link
                    to="/"
                    className="px-6 py-3 bg-golden-orange/90 text-white rounded-md shadow hover:bg-golden-orange transition-all"
                >
                    Go Home
                </Link>

                <Link
                    to="/login"
                    className="px-6 py-3 bg-dark-teal/10 text-gray-700 rounded-md shadow hover:bg-gray-300 transition-all"
                >
                    Login
                </Link>
            </div>

            {/* Footer */}
            <p className="text-gray-400 text-sm mt-10">GearGuard © {new Date().getFullYear()}</p>
        </div>
    );
};

export default NotFound;
