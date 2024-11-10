import { Link, useNavigate } from "react-router-dom";

export function FirstPage() {
    const navigate = useNavigate();
    return (
        <>
            <div className="bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center min-h-screen">
                <img
                    src={import.meta.env.VITE_BACKENDURL + '/api/static/url-shortener-logo.png'}
                    alt="Url Shortener"
                    className="w-full max-w-md h-auto mb-6"
                />
                <p className="text-4xl font-bold text-gray-800 dark:text-gray-200">URL SHORTENER</p>
                <p className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-8">By Om Bhut</p>
                <Link to={'/login'}>
                    <button
                        type="button"
                        className="bg-gradient-to-r from-blue-600 to-blue-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-700 rounded-lg text-base px-6 py-3 text-white font-semibold shadow-md"
                    >
                        Login / SignUp
                    </button>
                </Link>
            </div>
        </>
    );
}
