import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BookOpen, Activity, User, ScrollText, LogIn, HomeIcon } from "lucide-react";
import { useState } from "react";
const COLORS = {
  navBg: "bg-gradient-to-r from-blue-700 to-indigo-700",
  navText: "text-white",
  navAccent: "text-yellow-300",
  navShadow: "shadow-lg",
  navBorder: "border-b border-indigo-200",
  logoBg: "bg-white",
  logoText: "text-blue-700",
};

const Navbar = ({ user }: { user?: any }) => {
  console.log(user, "useruser");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check multiple authentication indicators
    const token = localStorage.getItem("accessToken");
    const phone = localStorage.getItem("userPhone");
    const userId = localStorage.getItem("userId");
    
    // User is logged in if any of these exist
    const loggedIn = !!(token || phone || userId);
    setIsLoggedIn(loggedIn);
    console.log("User logged in status:", loggedIn);
  }, []);

  const router = useRouter();
  return (
    <nav className={`${COLORS.navBg} ${COLORS.navShadow} ${COLORS.navBorder} relative`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer"
          onClick={() => {
            const phone = localStorage.getItem("userPhone") || "";
            router.push(`/`);
          }}
        >
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg ${COLORS.logoBg} flex items-center justify-center shadow-md`}
          >
            <BookOpen size={20} className={`${COLORS.logoText} sm:w-6 sm:h-6`} />
          </div>
          <div>
            <div className={`font-extrabold text-base sm:text-lg md:text-xl ${COLORS.navText}`}>
              HPBOSE
            </div>
            <div
              className={`text-[10px] sm:text-xs ${COLORS.navAccent} font-semibold tracking-wide`}
            >
              NEET & JEE Preparation
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        {isLoggedIn ? (
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            <button
              className={`flex items-center gap-2 text-sm lg:text-base font-medium ${COLORS.navText} hover:${COLORS.navAccent} transition-colors bg-transparent border-none cursor-pointer`}
              onClick={() => {
                router.push(`/dashboard`);
              }}
            >
              <HomeIcon size={18} />
              <span className="hidden lg:inline">Home</span>
            </button>
            <button
              className={`flex items-center gap-2 text-sm lg:text-base font-medium ${COLORS.navText} hover:${COLORS.navAccent} transition-colors bg-transparent border-none cursor-pointer`}
              onClick={() => {
                const phone = localStorage.getItem("userPhone") || "";
                router.push(`/test/history?phone=${encodeURIComponent(phone)}`);
              }}
            >
              <Activity size={18} />
              <span className="hidden lg:inline">Test History</span>
            </button>
           
            <button
              className={`flex items-center gap-2 text-sm lg:text-base font-medium ${COLORS.navText} hover:${COLORS.navAccent} transition-colors bg-transparent border-none cursor-pointer`}
              onClick={() => {
                const userId =
                  localStorage.getItem("userId") ||
                  localStorage.getItem("user");
                if (userId) {
                  router.push("/profile");
                } else {
                  alert("Please login or verify OTP to access your profile.");
                }
              }}
            >
              <User size={18} />
              <span className="hidden lg:inline">Profile</span>
            </button>
            <Link
              href="/terms"
              className={`flex items-center gap-2 text-sm lg:text-base font-medium ${COLORS.navText} hover:${COLORS.navAccent} transition-colors`}
            >
              <ScrollText size={18} />
              <span className="hidden lg:inline">Terms</span>
            </Link>
          </div>
        ) : (
          <>
            <button
              className={`hidden md:flex items-center gap-2 text-sm lg:text-base font-medium ${COLORS.navText} hover:${COLORS.navAccent} transition-colors bg-transparent border-none cursor-pointer`}
              onClick={() => {
                const phone = localStorage.getItem("userPhone") || "";
                router.push(`/login`);
              }}
            >
              <LogIn size={18} />
              <span className="hidden lg:inline">Login</span>
            </button>
          </>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* User Info */}
        {user && (
          <div className="hidden md:flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white rounded-lg border border-indigo-200 shadow">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="text-xs sm:text-sm font-medium text-blue-700 hidden lg:inline">
              {user.name}
            </span>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-r from-blue-700 to-indigo-700 border-t border-indigo-600 shadow-lg z-50">
          <div className="px-4 py-3 space-y-2">
            {isLoggedIn ? (
              <>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium ${COLORS.navText} hover:bg-white/10 rounded-lg transition-colors bg-transparent border-none cursor-pointer text-left`}
                  onClick={() => {
                    router.push(`/dashboard`);
                    setMobileMenuOpen(false);
                  }}
                >
                  <HomeIcon size={18} />
                  Home
                </button>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium ${COLORS.navText} hover:bg-white/10 rounded-lg transition-colors bg-transparent border-none cursor-pointer text-left`}
                  onClick={() => {
                    const phone = localStorage.getItem("userPhone") || "";
                    router.push(`/test/history?phone=${encodeURIComponent(phone)}`);
                    setMobileMenuOpen(false);
                  }}
                >
                  <Activity size={18} />
                  Test History
                </button>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium ${COLORS.navText} hover:bg-white/10 rounded-lg transition-colors bg-transparent border-none cursor-pointer text-left`}
                  onClick={() => {
                    const userId =
                      localStorage.getItem("userId") ||
                      localStorage.getItem("user");
                    if (userId) {
                      router.push("/profile");
                      setMobileMenuOpen(false);
                    } else {
                      alert("Please login or verify OTP to access your profile.");
                    }
                  }}
                >
                  <User size={18} />
                  Profile
                </button>
                <Link
                  href="/terms"
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium ${COLORS.navText} hover:bg-white/10 rounded-lg transition-colors`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ScrollText size={18} />
                  Terms
                </Link>
              </>
            ) : (
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium ${COLORS.navText} hover:bg-white/10 rounded-lg transition-colors bg-transparent border-none cursor-pointer text-left`}
                onClick={() => {
                  router.push(`/login`);
                  setMobileMenuOpen(false);
                }}
              >
                <LogIn size={18} />
                Login
              </button>
            )}
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg mt-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium text-white">
                  {user.name}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="mt-8 sm:mt-12 md:mt-16 py-6 sm:py-8 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-xs sm:text-sm text-gray-700">
      <div className="mb-2 sm:mb-3 font-semibold text-sm sm:text-base text-blue-700">
        HPBOSE - NEET & JEE Preparation
      </div>
      <p className="mb-3 sm:mb-4 text-xs sm:text-sm">© 2024 HPBOSE. All rights reserved.</p>
      <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 text-[10px] sm:text-xs text-gray-600">
        <span className="flex items-center justify-center gap-1">
          <span className="font-medium">Contact:</span>
          <a
            href="mailto:support@mocktestpro.com"
            className="text-blue-600 hover:underline break-all"
          >
            support@mocktestpro.com
          </a>
        </span>
        <span className="flex items-center justify-center gap-1">
          <span className="font-medium">WhatsApp:</span>
          <a
            href="https://wa.me/919876543210"
            className="text-blue-600 hover:underline"
          >
            +91-9876543210
          </a>
        </span>
        <span className="flex items-center justify-center gap-1">
          <span className="font-medium">Instagram:</span>
          <a
            href="https://instagram.com/mocktestpro"
            className="text-blue-600 hover:underline"
          >
            @mocktestpro
          </a>
        </span>
      </div>
      <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-500 px-4">
        <span>
          India's #1 platform for NEET & JEE mock tests, analytics, and smart
          preparation.
        </span>
      </div>
    </div>
  </footer>
);

const Layout = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: any;
}) => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Navbar user={user} />
    <main className="w-full  mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 flex-1">{children}</main>
    <Footer />
  </div>
);

export default Layout;
