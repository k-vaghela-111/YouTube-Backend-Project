import { useState } from "react";
import API from "../services/api.js";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

function Register() {

    const [form, setForm] = useState({
        fullName: "",
        username: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleAvatar = (e) => {
        setAvatar(e.target.files[0]);
    };

    const handleCoverImage = (e) => {
        setCoverImage(e.target.files[0]);
    };

    const isFormValid =
        form.fullName &&
        form.username &&
        form.email &&
        form.password &&
        avatar &&
        coverImage;

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);

        try {

            const formData = new FormData();

            formData.append("fullName", form.fullName);
            formData.append("username", form.username);
            formData.append("email", form.email);
            formData.append("password", form.password);
            formData.append("avatar", avatar);
            formData.append("coverImage", coverImage);

            const res = await API.post("/users/register", formData);

            toast.success(res.data.message);

            navigate("/login");

        } catch (error) {

            const message =
                error.response?.data?.message || "Registration failed";

            toast.error(message);

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">

            <div className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8 md:p-10">

                <h2 className="text-3xl font-bold text-white text-center mb-2">
                    Create Account
                </h2>

                <p className="text-gray-400 text-center text-sm mb-6">
                    Join and start uploading videos
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        onChange={handleChange}
                        className="bg-gray-800 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        className="bg-gray-800 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />

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

                    <div>
                        <label className="text-gray-300 text-sm">Avatar</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatar}
                            className="mt-1 text-gray-400"
                        />
                    </div>

                    <div>
                        <label className="text-gray-300 text-sm">Cover Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverImage}
                            className="mt-1 text-gray-400"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!isFormValid || loading}
                        className={`p-4 rounded-lg font-semibold transition ${!isFormValid || loading
                                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700 text-white"
                            }`}
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>

                    <p className="text-center text-gray-400 text-sm mt-2">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-red-500 hover:text-red-400 font-medium"
                        >
                            Login
                        </Link>
                    </p>

                </form>

            </div>

        </div>
    );
}

export default Register;