"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        { email, password }
      );
      
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful! Redirecting...");
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: "radial-gradient(ellipse at 30% 20%, #0f1119, #03050a)"
    }}>
      <div className="bg-[#0d111a] border border-[rgba(255,255,255,0.06)] rounded-3xl p-8 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="logo-icon w-16 h-16 mx-auto mb-4 flex items-center justify-center text-2xl">
            CS
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-[#8b92a8]">Sign in to continue to CineSnap Ultra</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm mb-2 text-[#8b92a8]">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[#1e2436] border border-[rgba(255,255,255,0.06)] rounded-lg focus:outline-none focus:border-[#c084fc] transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2 text-[#8b92a8]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#1e2436] border border-[rgba(255,255,255,0.06)] rounded-lg focus:outline-none focus:border-[#c084fc] transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-gradient-to-r from-[#c084fc] via-[#ec489a] to-[#3b82f6] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#8b92a8]">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#c084fc] hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}