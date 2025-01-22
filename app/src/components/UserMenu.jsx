/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Divider from "./Divider";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";

const UserMenu = ({ closeUserMenu }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logoutUser,
      });
      if (response.data.success) {
        closeUserMenu();
        dispatch(logout());
        localStorage.clear();
        toast.success("User logged out successfully");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div>
      <div className="font-semibold">My Account</div>
      <div className="text-sm">{user.name || user.mobile}</div>
      <Divider />
      <div className="text-sm grid gap-3">
        <Link
          to={""}
          className="bg-blue-100 rounded-md hover:bg-blue-200 shadow-md p-2"
        >
          My Orders
        </Link>
        <Link
          to={""}
          className="bg-blue-100 rounded-md hover:bg-blue-200 shadow-md p-2"
        >
          Saved Addresses
        </Link>
        <button
          onClick={handleLogout}
          className="text-left bg-red-600 rounded-md text-white hover:bg-red-700 shadow-md p-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
