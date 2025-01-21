import { useEffect, useState } from "react";
import { IoSearch, IoArrowBackOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import useMobile from "../hooks/useMobile";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [isMoile] = useMobile();

  useEffect(() => {
    const isSearchPageActive = location.pathname === "/search";
    setIsSearchPage(isSearchPageActive);
  }, [location]);

  console.log(isSearchPage);

  const redirectToSearchPage = () => {
    navigate("/search");
  };

  return (
    <div className="w-full bg-gray-200 min-w-[300px] lg:min-w-[420px] h-10 lg:h-12 rounded-lg overflow-hidden flex items-center text-neutral-600 group focus-within:border-primary-200 border-2">
      <div>
        {isMoile && isSearchPage ? (
          <Link
            to={"/"}
            className="flex justify-center items-center h-full p-3 group-focus-within:text-primary-200"
          >
            <IoArrowBackOutline size={22} />
          </Link>
        ) : (
          <button className="flex justify-center items-center h-full p-3 group-focus-within:text-primary-200">
            <IoSearch size={22} />
          </button>
        )}
      </div>
      <div className="w-full h-full">
        {!isSearchPage ? (
          //When not in search page
          <div
            onClick={redirectToSearchPage}
            className="w-full h-full flex items-center"
          >
            {/* Search &lsquo;milk&lsquo; */}
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                'Search "milk"',
                1000, // wait 1s before replacing "Mice" with "Hamsters"
                'Search "chips"',
                1000,
                'Search "maida"',
                1000,
                'Search "noodles"',
                1000,
                'Search "sugar"',
                1000,
                'Search "spices"',
                1000,
                'Search "vegetables"',
                1000,
                'Search "cold drink"',
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          //when in search page
          <div className="w-full h-full">
            <input
              type="text"
              placeholder="Search for groceries here"
              autoFocus
              className="bg-transparent w-full h-full outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
