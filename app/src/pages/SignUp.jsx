import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCnfPassword, setShowCnfPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const validData = Object.values(data).every((el) => el); // returns a boolen if each data keys contains any value

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords are not matching");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.signUp,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
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
        <p className="text-center font-semibold text-lg">
          Sign-up to Grocery-it
        </p>
        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
          <div className="grid">
            <label htmlFor="name">Name</label>
            <input
              value={data.name}
              onChange={handleChange}
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name here"
              className="bg-blue-50 p-2 border rounded outline-none focus-within:border-primary-200"
              autoFocus
            />
          </div>
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
          </div>
          <div className="grid">
            <label htmlFor="cnf-password">Confirm Password</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center gap-1 focus-within:border-primary-200">
              <input
                value={data.confirmPassword}
                onChange={handleChange}
                type={showCnfPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Enter your password again"
                className="w-full outline-none bg-transparent"
              />
              <div
                className="cursor-pointer"
                onClick={() => setShowCnfPassword((prev) => !prev)}
              >
                {showCnfPassword ? <IoEyeOff size={22} /> : <IoEye size={22} />}
              </div>
            </div>
          </div>

          <button
            disabled={!validData}
            className={`${
              validData
                ? "bg-secondary-200 hover:bg-green-700 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            } shadow-md rounded-md py-2 text-white font-semibold my-6`}
          >
            Sign Up
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="font-semibold text-green-600 hover:text-green-800"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignUp;
