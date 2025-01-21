import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const validData = Object.values(data).every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.login,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
        setData({
          email: "",
          password: "",
        });

        navigate("/");
      }
      console.log(response);
    } catch (error) {
      AxiosToastError(error);
    }

    console.log("From submitted");
  };

  return (
    <section className="w-full container flex items-center justify-center h-screen px-4">
      <Toaster position="top-right" />
      <div className="bg-white shadow-lg my-4 w-full max-w-lg mx-auto rounded-lg p-8">
        <p className="text-center font-semibold text-lg">Login to Grocery-it</p>
        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label htmlFor="email">Email</label>
            <input
              value={data.email}
              onChange={handleChange}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email here"
              className="bg-blue-50 p-2 border rounded outline-none focus-within:border-primary-200"
            />
          </div>
          <div className="grid">
            <label htmlFor="password">Password</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center gap-1 focus-within:border-primary-200">
              <input
                value={data.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password here"
                className="w-full outline-none bg-transparent"
              />
              <div
                className="cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <IoEyeOff size={22} /> : <IoEye size={22} />}
              </div>
            </div>
            <Link
              to={"/forgot-password"}
              className="block ml-auto mt-2 text-green-700"
            >
              Forgot password?
            </Link>
          </div>

          <button
            disabled={!validData}
            className={`${
              validData
                ? "bg-secondary-200 hover:bg-green-700 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            } shadow-md rounded-md py-2 text-white font-semibold my-6`}
          >
            Login
          </button>
        </form>
        <p>
          Don&lsquo;t have an account?{" "}
          <Link
            to={"/sign-up"}
            className="font-semibold text-green-600 hover:text-green-800"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
