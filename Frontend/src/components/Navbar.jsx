import React, { useEffect } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { selectUserData, setUserData } from "../redux/userSlice";
import { ChevronDown, LogOut } from "lucide-react";
import { logout } from "../features/logout";

function Navbar() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);

  console.log("USER DATA:", userData);
  console.log("USER NAME:", userData?.data?.name);

  const initials =
    userData?.data?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "Guest";

  console.log("INITIALS:", initials);

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(setUserData(null));
      setMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const theme = window.localStorage.getItem("theme");
    const dark = theme ? theme === "dark" : true;

    document.documentElement.classList.toggle("dark", dark);
    setIsDarkMode(dark);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";

    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="w-full h-16 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl flex items-center px-6 gap-6 font-sans transition-colors duration-300">

      {/* Logo */}
      <div className="flex items-center gap-2.5 shrink-0">
        <span className="text-slate-900 dark:text-white font-bold text-[17px] tracking-tight">
          Vertex AI
        </span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2 shrink-0">

        {/* Theme Button */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors duration-150"
        >
          {isDarkMode ? <FiMoon size={18} /> : <FiSun size={18} />}
        </button>

        {/* Profile */}
        <div className="relative ml-1">

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 pl-1.5 pr-2 h-10 rounded-lg shadow-sm shadow-blue-500/20 transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-white/[0.06]"
          >

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-200 dark:to-white flex items-center justify-center overflow-hidden ring-1 ring-black/5 dark:ring-white/20">
              <span className="text-[12px] font-semibold text-white dark:text-slate-900">
                {initials}
              </span>
            </div>

            {/* Name */}
            <span className="text-[13.5px] font-medium text-slate-700 dark:text-slate-200 hidden sm:inline">
              {userData?.data?.name || "Guest"}
            </span>

            {/* Arrow */}
            <ChevronDown
              size={14}
              className={`text-slate-700 dark:text-slate-500 hover:text-slate-400 transition-transform duration-150 ${
                menuOpen ? "rotate-180" : ""
              }`}
            />

          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white/95 dark:bg-[#12121c]/95 backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-xl py-1.5 z-50 animate-[fadeIn_0.15s_ease-out]">

              {/* User Info */}
              <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-white/[0.08] flex items-center gap-3">

                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-200 dark:to-white flex items-center justify-center shrink-0 ring-1 ring-black/5 dark:ring-white/20">
                  <span className="text-[12px] font-semibold text-white dark:text-slate-900">
                    {initials}
                  </span>
                </div>

                {/* Name + Email */}
                <div className="min-w-0">

                  <p className="text-[13.5px] font-medium text-slate-700 dark:text-slate-200 truncate">
                    {userData?.data?.name || "Guest"}
                  </p>

                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate">
                    {userData?.data?.email || ""}
                  </p>

                </div>

              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13.5px] text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-150"
              >
                <LogOut size={18} />
                Logout
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Navbar;