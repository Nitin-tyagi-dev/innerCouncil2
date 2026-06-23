import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, PlusCircle, LayoutDashboard, History, LogOut, Cpu } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 mb-8 border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-gradient-to-tr from-neon-purple to-neon-pink rounded-xl shadow-lg shadow-neon-purple/20 group-hover:scale-105 transition-transform duration-300">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-wider gradient-text-neon font-sans">
              INNER COUNCIL
            </span>
            <span className="block text-[10px] tracking-widest text-slate-500 font-mono">
              AI DECISION DECIDER
            </span>
          </div>
        </Link>

        {user ? (
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/dashboard')
                    ? 'bg-neon-purple/10 text-neon-cyan border border-neon-purple/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              <Link
                to="/create-decision"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/create-decision')
                    ? 'bg-neon-purple/10 text-neon-cyan border border-neon-purple/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                New Dilemma
              </Link>

              <Link
                to="/history"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/history')
                    ? 'bg-neon-purple/10 text-neon-cyan border border-neon-purple/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <History className="w-4 h-4" />
                History
              </Link>
            </div>

            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
              <div className="hidden sm:block text-right">
                <span className="block text-xs text-slate-500 font-mono">AUTHORIZED AS</span>
                <span className="font-semibold text-sm text-slate-200">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 bg-red-950/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 rounded-lg text-sm font-medium border border-red-900/30 hover:border-red-700/50 transition-all duration-200 shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm rounded-lg gradient-btn font-semibold shadow-lg shadow-neon-purple/30 hover:shadow-neon-purple/50 transition-all duration-300"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
