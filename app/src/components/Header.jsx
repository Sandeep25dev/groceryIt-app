import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Search from "./Search";
import { FaUserCircle } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import useMobile from "../hooks/useMobile";
import { useSelector } from "react-redux";
import { useState } from "react";
import UserMenu from "./UserMenu";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const isSearchPage = location.pathname === "/search";
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const user = useSelector((state) => state?.user);

  console.log("user from store", user);

  const redirectToLoginPage = () => {
    navigate("/login");
  };

  const handleCloseUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  const handleUserOnMobile = () => {
    if (!user._id) {
      navigate("/login");
      return;
    }
  };

  return (
    <header className="h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center px-10 justify-between">
          {/* logo */}
          <div className="h-full">
            <Link to={"/"} className="h-full flex justify-center items-center">
              <img
                src={logo}
                alt="logo"
                width={170}
                height={60}
                className="hidden lg:block"
              />
              <img
                src={logo}
                alt="logo"
                width={120}
                height={60}
                className="lg:hidden"
              />
            </Link>
          </div>
          {/* Search */}
          <div className="hidden lg:block">
            <Search />
          </div>
          {/* Login and cart */}
          <div>
            {/* For mobile view */}
            <button
              onClick={handleUserOnMobile}
              className="text-neutral-600 lg:hidden"
            >
              <FaUserCircle size={25} />
            </button>
            {/* For desktop view */}
            <div className="hidden lg:flex items-center gap-10">
              {user?._id ? (
                <div className="relative">
                  <div
                    className="flex items-center gap-1 cursor-pointer select-none"
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  >
                    <p>Account</p>
                    {isUserMenuOpen ? (
                      <GoTriangleUp size={22} />
                    ) : (
                      <GoTriangleDown size={22} />
                    )}
                  </div>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-12 select-none">
                      <div className="bg-white rounded lg:shadow-md p-4 min-w-52">
                        <UserMenu closeUserMenu={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={redirectToLoginPage} className="text-lg px-2">
                  Login
                </button>
              )}

              <button className="flex items-center gap-2 bg-secondary-200 hover:bg-green-700 px-3 py-3 rounded-lg text-white">
                {/* add to cart icon */}
                <div>
                  <IoCartOutline size={28} />
                </div>
                <div className="font-semibold">
                  <p>My cart</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>
    </header>
  );
};

export default Header;
