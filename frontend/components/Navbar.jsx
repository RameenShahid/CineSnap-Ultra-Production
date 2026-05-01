"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar({ isLoggedIn, credits, setIsLoggedIn }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (setIsLoggedIn) setIsLoggedIn(false);
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <nav className="glass-nav">
      <div className="nav-container">
        <Link href="/" className="logo">
          <div className="logo-icon">CS</div>
          <span>CineSnap <span className="gradient-text">Ultra</span></span>
        </Link>
        <div className="nav-links">
          {isLoggedIn ? (
            <>
              <span className="badge-premium">
                <i className="fas fa-crown"></i> {credits} credits
              </span>
              <Link href="/dashboard" className="btn btn-outline btn-sm">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline btn-sm">
                <i className="fas fa-sign-in-alt"></i> Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                <i className="fas fa-user-plus"></i> Sign Up Free →
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}