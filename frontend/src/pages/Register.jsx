import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { register, user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMsg("");

    const result = await register(name, email, password);

    setLoading(false);

    if (result.success) navigate("/dashboard");
    else setErrorMsg(result.error);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white">

      {/* Background */}

      <div className="fixed inset-0 overflow-hidden">

        <div className="absolute left-[-150px] top-[-100px] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[180px]" />

        <div className="absolute right-[-100px] bottom-[-120px] h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-[180px]" />

      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl">

        {/* LEFT */}

        <div className="flex w-full items-center justify-center px-8 lg:w-[45%]">

          <div className="w-full max-w-md">

            <div className="mb-12">

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10">

                <Sparkles className="h-7 w-7 text-indigo-400" />

              </div>

              <h1 className="text-5xl font-bold tracking-tight">
                Create your account
              </h1>

              <p className="mt-4 text-slate-400 leading-7">
                Join Inner Council and make better decisions with AI-powered
                perspectives.
              </p>

            </div>

            {errorMsg && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>

                <label className="mb-2 block text-sm text-slate-400">
                  Full Name
                </label>

                <div className="relative">

                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />

                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-12 pr-4 text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-500 focus:bg-white/[0.05]"
                  />

                </div>

              </div>

              <div>

                <label className="mb-2 block text-sm text-slate-400">
                  Email
                </label>

                <div className="relative">

                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-12 pr-4 text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-500 focus:bg-white/[0.05]"
                  />

                </div>

              </div>

              <div>

                <label className="mb-2 block text-sm text-slate-400">
                  Password
                </label>

                <div className="relative">

                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-12 pr-14 text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-500 focus:bg-white/[0.05]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              <button
                disabled={loading}
                className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-white text-black font-semibold transition hover:bg-slate-200 disabled:opacity-60"
              >
                {loading ? (
                  "Creating account..."
                ) : (
                  <>
                    Create Account
                    <ArrowRight
                      className="transition group-hover:translate-x-1"
                      size={18}
                    />
                  </>
                )}
              </button>

            </form>

            <p className="mt-10 text-center text-slate-500">

              Already have an account?

              <Link
                to="/login"
                className="ml-2 text-white hover:text-slate-300"
              >
                Sign In
              </Link>

            </p>

          </div>

        </div>

        {/* RIGHT */}

        <div className="relative hidden lg:flex lg:w-[55%] items-center justify-center overflow-hidden">

          <div className="absolute h-[650px] w-[650px] rounded-full border border-white/5" />

          <div className="absolute h-[500px] w-[500px] rounded-full border border-white/5" />

          <div className="absolute h-[350px] w-[350px] rounded-full border border-white/5" />

          <div className="absolute h-40 w-40 rounded-full bg-gradient-to-br from-indigo-500/30 to-sky-500/20 blur-3xl" />

          <div className="relative max-w-md text-center">

            <h2 className="text-4xl font-bold leading-tight">
              Every great decision starts with the right perspective.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Create your account and let your AI council help you evaluate
              choices, compare viewpoints, and move forward with confidence.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;