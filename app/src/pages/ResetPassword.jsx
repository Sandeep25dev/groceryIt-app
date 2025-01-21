import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showCnfPassword, setShowCnfPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  useEffect(() => {
    if (!location?.state?.data?.success) {
      navigate("/");
    }
    if (location?.state?.email) {
      setData((prev) => {
        return {
          ...prev,
          email: location?.state?.email,
        };
      });
    }
  }, []);

  console.log("email:", data.email);

  const validData = Object.values(data).every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.newPassword !== data.confirmNewPassword) {
      return toast.error("Passwords are not matching");
    }

    try {
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: data,
      });
      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
        setData({
          email: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  return (
    <section className="w-full container flex items-center justify-center h-screen px-4">
      <Toaster position="top-right" />

      <div className="bg-white shadow-lg my-4 w-full max-w-lg mx-auto rounded-lg p-8">
        <p className="text-center font-semibold text-lg">Enter New Password</p>
        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label htmlFor="password">Password</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center gap-1 focus-within:border-primary-200">
              <input
                value={data.newPassword}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                placeholder="Enter your new password here"
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
          <div className="grid gap-2">
            <label htmlFor="password">Confirm Password</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center gap-1 focus-within:border-primary-200">
              <input
                value={data.confirmNewPassword}
                onChange={handleChange}
                type={showCnfPassword ? "text" : "password"}
                id="confirmNewPassword"
                name="confirmNewPassword"
                placeholder="Enter your new password again"
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
            Change Password
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

export default ResetPassword;
