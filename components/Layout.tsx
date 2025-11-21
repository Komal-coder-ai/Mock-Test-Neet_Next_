import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  BookOpen,
  Activity,
  User,
  ScrollText,
  LogIn,
  HomeIcon,
} from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();

  const isAuthPage =
    router.pathname === "/" ||
    router.pathname === "/login" ||
    router.pathname === "/register" ||
    router.pathname === "/login/index" ||
    router.pathname === "/register/index";

  const isHomePage = router.pathname === "/";
    return (
      <nav
        className={`relative ${COLORS.navShadow} ${COLORS.navBorder} sticky top-0 z-50 overflow-hidden`}
        style={{ boxShadow: "0 2px 8px rgba(44,62,80,0.08)" }}
      >
        {/* Decorative Circles Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-60px] left-[-80px] w-[220px] h-[220px] bg-gradient-to-br from-blue-700 to-indigo-700 rounded-full opacity-30 blur-2xl" />
          <div className="absolute top-[40px] right-[-100px] w-[180px] h-[180px] bg-gradient-to-br from-indigo-500 to-blue-400 rounded-full opacity-20 blur-2xl" />
          <div className="absolute bottom-[-80px] left-[40%] w-[140px] h-[140px] bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-20 blur-2xl" />
        </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => {
            const phone = localStorage.getItem("userPhone") || "";
            router.push(`/`);
          }}
        >
          <div
            className={`w-12 h-12 rounded-xl ${COLORS.logoBg} flex items-center justify-center shadow-lg border border-blue-200 group-hover:scale-110 transition-transform duration-200`}
          >
            <BookOpen
              size={28}
              className={`${COLORS.logoText} sm:w-8 sm:h-8`}
            />
          </div>
          <div className="ml-3">
            <div
              className={`font-extrabold text-xl md:text-2xl tracking-tight text-blue-700 drop-shadow-sm`}
            >
              HPBOSE
            </div>
            <div
              className={`text-sm md:text-base text-green-500 font-semibold tracking-wide leading-tight`}
            >
              NEET & JEE Preparation
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        {!isAuthPage ? (
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            <button
              className={`flex items-center gap-2 text-base font-bold text-blue-600 hover:text-green-500 px-4 py-2 rounded-lg transition-colors duration-150 bg-transparent border-none cursor-pointer drop-shadow-sm`}
              onClick={() => {
                router.push(`/dashboard`);
              }}
            >
              <HomeIcon size={20} />
              <span className="hidden lg:inline">Home</span>
            </button>
            <button
              className={`flex items-center gap-2 text-base font-bold text-blue-600 hover:text-green-500 px-4 py-2 rounded-lg transition-colors duration-150 bg-transparent border-none cursor-pointer drop-shadow-sm`}
              onClick={() => {
                router.push(`/test/history`);
              }}
            >
              <Activity size={20} />
              <span className="hidden lg:inline">Test History</span>
            </button>

            <button
              className={`flex items-center gap-2 text-base font-bold text-blue-600 hover:text-green-500 px-4 py-2 rounded-lg transition-colors duration-150 bg-transparent border-none cursor-pointer drop-shadow-sm`}
              onClick={() => {
                const userId =
                  localStorage.getItem("userId") ||
                  localStorage.getItem("user");
                if (userId) {
                  router.push("/profile");
                } else {
                  router.push("/login");
                } 
              }}
            >
              <User size={20} />
              <span className="hidden lg:inline">Profile</span>
            </button>
            {!(isHomePage || router.pathname.startsWith('/login')) && (
              <Link
                href="/terms"
                className={`flex items-center gap-2 text-base font-bold text-blue-600 hover:text-green-500 px-4 py-2 rounded-lg transition-colors duration-150 drop-shadow-sm`}
              >
                <ScrollText size={20} />
                <span className="hidden lg:inline">Terms</span>
              </Link>
            )}

            {/* Show Login button on home page */}
            {isHomePage && (
              <button
                className={`flex items-center gap-2 text-base font-bold text-blue-600 hover:text-green-500 px-4 py-2 rounded-lg transition-colors duration-150 bg-transparent border-none cursor-pointer drop-shadow-sm`}
                onClick={() => {
                  router.push(`/login`);
                }}
              >
                <LogIn size={20} />
                <span className="hidden lg:inline">Login</span>
              </button>
            )}
          </div>
        ) : (
          <button
            className={`hidden md:flex items-center gap-2 text-sm lg:text-base font-bold text-blue-600 hover:text-green-500 transition-colors bg-transparent border-none cursor-pointer drop-shadow-sm`}
            onClick={() => {
              router.push(`/login`);
            }}
          >
            <LogIn size={18} />
            <span className="hidden lg:inline">Login</span>
          </button>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-blue-600 drop-shadow-sm"
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
            {!isAuthPage ? (
              <>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-blue-600 hover:text-green-500 hover:bg-white/10 rounded-lg transition-colors bg-transparent border-none cursor-pointer text-left drop-shadow-sm`}
                  onClick={() => {
                    router.push(`/dashboard`);
                    setMobileMenuOpen(false);
                  }}
                >
                  <HomeIcon size={18} />
                  Home
                </button>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-blue-600 hover:text-green-500 hover:bg-white/10 rounded-lg transition-colors bg-transparent border-none cursor-pointer text-left drop-shadow-sm`}
                  onClick={() => {
                    const phone = localStorage.getItem("userPhone") || "";
                    router.push(
                      `/test/history?phone=${encodeURIComponent(phone)}`
                    );
                    setMobileMenuOpen(false);
                  }}
                >
                  <Activity size={18} />
                  Test History
                </button>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-blue-600 hover:text-green-500 hover:bg-white/10 rounded-lg transition-colors bg-transparent border-none cursor-pointer text-left drop-shadow-sm`}
                  onClick={() => {
                    const userId =
                      localStorage.getItem("userId") ||
                      localStorage.getItem("user");
                    if (userId) {
                      router.push("/profile");
                      setMobileMenuOpen(false);
                    } else {
                      alert(
                        "Please login or verify OTP to access your profile."
                      );
                    }
                  }}
                >
                  <User size={18} />
                  Profile
                </button>
                <Link
                  href="/terms"
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-blue-600 hover:text-green-500 hover:bg-white/10 rounded-lg transition-colors drop-shadow-sm`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ScrollText size={18} />
                  Terms
                </Link>

                {/* Show Login button on home page in mobile menu */}
                {isHomePage && (
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-blue-600 hover:text-green-500 hover:bg-white/10 rounded-lg transition-colors bg-transparent border-none cursor-pointer text-left drop-shadow-sm`}
                    onClick={() => {
                      router.push(`/login`);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogIn size={18} />
                    Login
                  </button>
                )}
              </>
            ) : (
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-blue-600 hover:text-green-500 hover:bg-white/10 rounded-lg transition-colors bg-transparent border-none cursor-pointer text-left drop-shadow-sm`}
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
  <footer className=" py-8 sm:py-10 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-100 shadow-inner">
    <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col items-center text-center">
      <div className="mb-2 sm:mb-3 font-bold text-base sm:text-lg text-blue-700 tracking-tight flex items-center gap-2">
        <BookOpen size={18} className="text-blue-600" />
        HPBOSE <span className="text-indigo-600">|</span>{" "}
        <span className="text-indigo-700">NEET & JEE Preparation</span>
      </div>
      <p className="mb-2 sm:mb-3 text-xs sm:text-sm text-gray-600">
        © 2024 HPBOSE. All rights reserved.
      </p>
      <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500 max-w-xl">
        India's #1 platform for NEET & JEE mock tests, analytics, and smart
        preparation.
      </div>
      <div className="mt-3 flex gap-4">
        <a
          href="https://www.hpbose.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-xs sm:text-sm"
        >
          Official Website
        </a>
         
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
}) => {
  const router = useRouter();
  const isTestBeginPage = router.pathname.startsWith('/test/') && router.pathname.endsWith('/begin');
  return (
    <div className="bg-gray-50 flex flex-col">
      {!isTestBeginPage && <Navbar user={user} />}
      <main className="w-full ">{children}</main>
      {!isTestBeginPage && <Footer />}
    </div>
  );
};

export default Layout;
