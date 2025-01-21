import { useState } from "react";

import toast, { Toaster } from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: "",
  });

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
        ...SummaryApi.forgotPassword,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/verify-otp", {
          state: data,
        });
        setData({
          email: "",
        });
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
          Forgot your password?
        </p>
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

          <button
            disabled={!validData}
            className={`${
              validData
                ? "bg-secondary-200 hover:bg-green-700 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            } shadow-md rounded-md py-2 text-white font-semibold my-6`}
          >
            Send OTP
          </button>
        </form>
        <p>
          Get back to{" "}
          <Link
            to={"/login"}
            className="font-semibold text-green-600 hover:text-green-800"
          >
            Login?
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;
