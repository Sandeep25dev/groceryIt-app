import { useEffect, useRef, useState } from "react";

import toast, { Toaster } from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useLocation, useNavigate } from "react-router-dom";

const OtpVerification = () => {
  const [data, setData] = useState(["", "", "", "", "", ""]);

  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef([]);

  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/forgot-password");
    }
  }, []);

  const validData = data.every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.verifyOTP,
        data: {
          email: location?.state?.email,
          otp: data.join(""),
        },
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        setData(["", "", "", "", "", ""]);
        navigate("/reset-password", {
          state: {
            data: response.data,
            email: location?.state?.email,
          },
        });
      }
      console.log(response);
    } catch (error) {
      AxiosToastError(error);
    }

    console.log("From submitted");
  };

  const handleChange = (e, idx) => {
    const value = e.target.value;
    console.log("value", value);
    const newData = [...data];
    newData[idx] = value;
    setData(newData);
    if (value && idx < 5) {
      inputRef.current[idx + 1].focus();
    }
  };

  return (
    <section className="w-full container flex items-center justify-center h-screen px-4">
      <Toaster position="top-right" />

      <div className="bg-white shadow-lg my-4 w-full max-w-lg mx-auto rounded-lg p-8">
        <p className="text-center font-semibold text-lg">Enter Your OTP</p>
        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <div className="flex gap-2 justify-center items-center mt-3">
              {data.map((el, idx) => {
                return (
                  <input
                    key={idx}
                    type="text"
                    id="otp"
                    ref={(ref) => {
                      inputRef.current[idx] = ref;
                      return ref;
                    }}
                    maxLength={1}
                    value={data[idx]}
                    onChange={(e) => handleChange(e, idx)}
                    className="bg-blue-50 w-full max-w-12 p-2 border rounded outline-none focus-within:border-primary-200 text-center text-lg font-semibold"
                  />
                );
              })}
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
            Submit
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

export default OtpVerification;
