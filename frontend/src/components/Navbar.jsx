import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  LayoutDashboard,
  History,
  PlusCircle,
  LogOut,
  ChevronDown
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#09090B]/80 backdrop-blur-xl">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">

        {/* LEFT */}

        <div className="flex items-center gap-12">

          {/* Logo */}

          <Link
            to="/"
            className="flex items-center gap-4"
          >

            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">

              <div className="absolute h-1.5 w-1.5 rounded-full bg-white left-[12px] top-[13px]" />

              <div className="absolute h-1.5 w-1.5 rounded-full bg-slate-500 right-[12px] top-[13px]" />

              <div className="absolute h-1.5 w-1.5 rounded-full bg-slate-400 bottom-[12px]" />

              <div className="absolute h-px w-4 bg-slate-500 top-[16px]" />

              <div className="absolute h-px w-3 rotate-[58deg] bg-slate-500 left-[17px] top-[19px]" />

              <div className="absolute h-px w-3 -rotate-[58deg] bg-slate-500 right-[17px] top-[19px]" />

            </div>

            <div>

              <h1 className="text-lg font-semibold tracking-tight text-white">
                Inner Council
              </h1>

              <p className="text-xs text-slate-500">
                Decision Intelligence
              </p>

            </div>

          </Link>

          {/* Navigation */}

          {user && (

            <nav className="hidden lg:flex items-center gap-2">

              <Link
                to="/dashboard"
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive("/dashboard")
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard size={17} />
                  Dashboard
                </div>
              </Link>

              <Link
                to="/create-decision"
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive("/create-decision")
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <PlusCircle size={17} />
                  New Decision
                </div>
              </Link>

              <Link
                to="/history"
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive("/history")
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <History size={17} />
                  History
                </div>
              </Link>

            </nav>

          )}

        </div>

        {/* RIGHT */}

        {user ? (

          <div className="flex items-center gap-4">

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-white">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div className="hidden md:block">

                <p className="text-sm font-medium text-white">
                  {user.name}
                </p>

                <p className="text-xs text-slate-500">
                  Member
                </p>

              </div>

              <ChevronDown
                size={16}
                className="text-slate-500"
              />

            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <div className="flex items-center gap-2">
                <LogOut size={17} />
                Logout
              </div>
            </button>

          </div>

        ) : (

          <div className="flex items-center gap-3">

            <Link
              to="/login"
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-slate-200"
            >
              Get Started
            </Link>

          </div>

        )}

      </div>

    </header>
  );
};

export default Navbar;