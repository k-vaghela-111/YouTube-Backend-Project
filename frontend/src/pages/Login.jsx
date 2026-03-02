import { useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import { Link } from "react-router-dom";

function Login() {

    const [login, setLogin] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const isFormValid = login.email && login.password;

    const handleChange = (e) => {
        setLogin({
            ...login,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {

            const res = await API.post("/users/login", login);

            toast.success(res.data.message);

        } catch (error) {

            const message =
                error.response?.data?.message || "Login failed";

            toast.error(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">

            <div className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8 md:p-10">

                <h2 className="text-3xl font-bold text-white text-center mb-2">
                    Welcome Back
                </h2>

                <p className="text-gray-400 text-center text-sm mb-6">
                    Login to your account
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        className="bg-gray-800 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="bg-gray-800 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />

                    <button
                        type="submit"
                        disabled={!isFormValid || loading}
                        className={`p-4 rounded-lg font-semibold transition ${
                            !isFormValid || loading
                                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <p className="text-center text-gray-400 text-sm mt-2">
                        New User?{" "}
                        <Link
                            to="/register"
                            className="text-red-500 hover:text-red-400 font-medium"
                        >
                            Create Account
                        </Link>
                    </p>

                </form>

            </div>

        </div>
    );
}

export default Login;