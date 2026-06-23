import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, LogIn, Cpu } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoggingIn(true);

    const result = await login(email, password);
    setIsLoggingIn(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 pointer-events-none overflow-hidden max-h-screen">
        <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] rounded-full bg-neon-purple/5 blur-[80px] pulsing-glow-circle" />
        <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] rounded-full bg-neon-pink/5 blur-[80px] pulsing-glow-circle" />
      </div>

      <div className="glass-panel max-w-md w-full rounded-3xl p-8 border border-white/5 shadow-2xl relative z-10">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex p-3 bg-gradient-to-tr from-neon-purple to-neon-pink rounded-2xl shadow-xl shadow-neon-purple/20 mb-2">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 text-sm">
            Sign in to access your Inner Council
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-950/20 border border-red-500/30 text-red-400 text-xs font-mono rounded-xl mb-6 flex items-start gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 tracking-wider font-mono uppercase">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full cyber-input pl-11 text-sm"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 tracking-wider font-mono uppercase">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full cyber-input pl-11 text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3 rounded-xl gradient-btn flex items-center justify-center gap-2 shadow-lg shadow-neon-purple/20 cursor-pointer disabled:opacity-50"
          >
            <LogIn className="w-5 h-5" />
            {isLoggingIn ? 'Decrypting Access...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          New to the council?{' '}
          <Link to="/register" className="text-neon-cyan hover:underline font-semibold font-mono">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
