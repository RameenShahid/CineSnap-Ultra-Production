"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchUserData();
    fetchHistory();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });
      setUser(res.data);
    } catch (error) {
      toast.error("Failed to load user data");
      localStorage.removeItem("token");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/history`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });
      setHistory(res.data);
    } catch (error) {
      console.error("Failed to fetch history");
    }
  };

  const handleUpgrade = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/billing/create-checkout-session`,
        {},
        { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      );
      window.location.href = res.data.url;
    } catch (error) {
      toast.error("Failed to initiate upgrade");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <>
      <nav className="glass-nav">
        <div className="nav-container">
          <div className="logo">
            <div className="logo-icon">CS</div>
            <span>CineSnap <span className="gradient-text">Ultra</span></span>
          </div>
          <div className="nav-links">
            <span className="badge-premium">
              <i className="fas fa-crown"></i> {user?.credits || 0} credits
            </span>
            <Link href="/" className="btn btn-outline btn-sm">
              <i className="fas fa-home"></i> Home
            </Link>
            <button onClick={handleLogout} className="btn btn-outline btn-sm">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="bg-[#0d111a] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Credits Remaining</h3>
              <i className="fas fa-gem text-2xl text-[#c084fc]"></i>
            </div>
            <div className="text-4xl font-bold mb-2">{user?.credits || 0}</div>
            <p className="text-[#8b92a8] text-sm">Each removal costs 1 credit</p>
            {user?.credits < 5 && (
              <button onClick={handleUpgrade} className="btn btn-primary btn-sm w-full mt-4">
                Buy More Credits
              </button>
            )}
          </div>

          <div className="bg-[#0d111a] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Total Processed</h3>
              <i className="fas fa-chart-line text-2xl text-[#10b981]"></i>
            </div>
            <div className="text-4xl font-bold mb-2">{user?.totalProcessed || 0}</div>
            <p className="text-[#8b92a8] text-sm">Images processed with AI</p>
          </div>

          <div className="bg-[#0d111a] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Current Plan</h3>
              <i className="fas fa-trophy text-2xl text-[#f59e0b]"></i>
            </div>
            <div className="text-2xl font-bold mb-2 capitalize">{user?.plan || "Free"}</div>
            <p className="text-[#8b92a8] text-sm">
              {user?.plan === "pro" ? "Unlimited processing" : "5 free credits"}
            </p>
            {user?.plan === "free" && (
              <button onClick={handleUpgrade} className="btn btn-primary btn-sm w-full mt-4">
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>

        {/* History Section */}
        <div className="mt-8 bg-[#0d111a] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          {history.length === 0 ? (
            <p className="text-[#8b92a8] text-center py-8">No images processed yet</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {history.map((item, index) => (
                <div key={index} className="relative group cursor-pointer">
                  <img 
                    src={item.resultUrl} 
                    alt={`Processed ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <button className="btn btn-sm btn-primary" onClick={() => window.open(item.resultUrl, '_blank')}>
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}