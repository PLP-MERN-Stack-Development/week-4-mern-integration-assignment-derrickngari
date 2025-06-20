import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bars3BottomLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";
import { AuthContext } from "../context/authContext";

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const { user, setUser } = useContext(AuthContext);

  const menuItems = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Blogs", to: "/blogs" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex items-center mt-6 justify-between w-full px-10 py-4 relative">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="logo outline-none font-bold text-2xl bg-gradient-to-r from-emerald-500  to-pink-500 text-transparent bg-clip-text"
        >
          Bloggy
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-10 mr-40 font-semibold">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.to}
                className={`hover:text-emerald-600 ${
                  active === item.label ? "text-emerald-600 font-bold" : ""
                }`}
                onClick={() => setActive(item.label)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Login/Logout Button */}
        {!user ? (
          <button
            className="hidden md:block hover:bg-emerald-950 hover:text-emerald-500 border border-emerald-500 text-emerald-500 font-bold px-6 py-2 rounded"
            onClick={() => navigate("/login")} // ✅ FIXED: wrap in arrow function
          >
            Login
          </button>
        ) : (
          <button
            className="hidden md:block hover:bg-pink-950 hover:text-pink-500 border border-pink-500 text-pink-500 font-bold px-6 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden hover:text-emerald-400"
          onClick={() => setIsOpen(true)}
        >
          {!isOpen && <Bars3BottomLeftIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul
          ref={menuRef}
          className="absolute top-[-25px] right-0 min-h-screen w-60 bg-gray-900 shadow-lg rounded px-4 py-8 flex flex-col gap-6 md:hidden z-50 duration-200"
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 left-4 hover:text-emerald-400"
          >
            <ChevronDoubleRightIcon className="h-6 w-6" />
          </button>

          <div className="mt-10 items-center">
            {menuItems.map((item) => (
              <li key={item.label} className="list-none">
                <Link
                  to={item.to}
                  className={`block text-lg py-1.5 hover:text-emerald-400 ${
                    active === item.label ? "text-emerald-400" : ""
                  }`}
                  onClick={() => {
                    setIsOpen(false);
                    setActive(item.label);
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </div>

          {!user ? (
            <button
              className="mt-8 w-full text-center hover:bg-emerald-950 hover:text-emerald-500 border border-emerald-500 text-emerald-500 font-bold px-4 py-2 rounded"
              onClick={() => {
                setIsOpen(false);
                navigate("/login");
              }}
            >
              Login
            </button>
          ) : (
            <button
              className="mt-8 w-full text-center hover:bg-pink-950 hover:text-pink-500 border border-pink-500 text-pink-500 font-bold px-4 py-2 rounded"
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
            >
              Logout
            </button>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
