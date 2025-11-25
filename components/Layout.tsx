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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  console.log(mobileMenuOpen, "mobileMenuOpen");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  console.log(scrolled, "scrolled");
  const router = useRouter();

  const isAuthPage =
    router.pathname === "/" ||
    router.pathname === "/login" ||
    router.pathname === "/register" ||
    router.pathname === "/login/index" ||
    router.pathname === "/register/index";

  const isHomePage = router.pathname === "/";

  // Define navigation links as objects
  const navLinks = [
    {
      label: "Home",
      icon: <HomeIcon size={20} />,
      onClick: () => router.push(`/dashboard`),
      show: !isAuthPage,
      desktop: true,
      mobile: true,
      color: "text-blue-600",
    },
    {
      label: "Test History",
      icon: <Activity size={20} />,
      onClick: () => router.push(`/test/history`),
      show: !isAuthPage,
      desktop: true,
      mobile: true,
      color: "text-blue-600",
    },
    {
      label: "Profile",
      icon: <User size={20} />,
      onClick: () => {
        const userId =
          localStorage.getItem("userId") || localStorage.getItem("user");
        if (userId) {
          router.push("/profile");
        } else {
          router.push("/login");
        }
      },
      show: !isAuthPage,
      desktop: true,
      mobile: true,
      color: "text-blue-600",
    },
    {
      label: "Terms and Condition",
      icon: <ScrollText size={20} />,
      onClick: () => router.push(`/terms`),
      show:
        !isAuthPage && !(isHomePage || router.pathname.startsWith("/login")),
      desktop: true,
      mobile: true,
      color: "text-blue-600",
      isLink: true,
      href: "/terms",
    },
    {
      label: "Login",
      icon: <LogIn size={20} />,
      onClick: () => router.push(`/login`),
      show: isHomePage,
      desktop: true,
      mobile: true,
      color: "text-blue-600",
    },
    {
      label: "Logout",
      icon: <LogIn size={20} />,
      onClick: async () => {
        if (typeof window !== "undefined") {
          // Dynamically import SweetAlert2
          const Swal = (await import("sweetalert2")).default;
          Swal.fire({
            title: "Are you sure?",
            text: "Do you want to logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2563eb", // blue-600
            cancelButtonColor: "#6366f1", // indigo-500
            confirmButtonText: "Yes, logout!",
            background: "#f8fafc", // gray-50
            color: "#1e293b", // slate-800
            customClass: {
              popup: "rounded-xl shadow-lg border border-blue-200",
              title: "font-bold text-blue-700",
              confirmButton: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-2 rounded-lg",
              cancelButton: "bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg border border-indigo-200",
            },
          }).then((result: any) => {
            if (result.isConfirmed) {
              localStorage.clear();
              router.push("/login");
            }
          });
        }
      },
      show:
        !isAuthPage && !(isHomePage || router.pathname.startsWith("/login")),
      desktop: true,
      mobile: true,
      color: "text-red-600",
      isLink: false,
    },
  ];

  return (
    <nav
      className={`

        ${!scrolled ? "backdrop-blur-md bg-white/70" : COLORS.navBg}
        relative ${COLORS.navShadow} ${
        COLORS.navBorder
      } sticky top-0 z-50 overflow-hidden
        
        `}
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
              className={`font-extrabold text-xl md:text-2xl tracking-tight drop-shadow-sm ${scrolled ? 'text-white' : 'text-blue-700'}`}
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
        <div className="hidden md:flex items-center gap-6 lg:gap-10">
          {navLinks
            .filter((link) => link.desktop && link.show)
            .map((link) => {
              const linkColor = scrolled ? "text-white" : link.color;
              return link.isLink ? (
                <Link
                  key={link.label}
                  href={link.href || ""}
                  className={`flex items-center gap-2 text-base font-bold ${linkColor} hover:text-green-500 px-4 py-2 rounded-lg transition-colors duration-150 drop-shadow-sm`}
                >
                  {link.icon}
                  <span className="hidden lg:inline">{link.label}</span>
                </Link>
              ) : (
                <button
                  key={link.label}
                  className={`flex items-center gap-2 text-base font-bold ${linkColor} hover:text-green-500 px-4 py-2 rounded-lg transition-colors duration-150 bg-transparent border-none cursor-pointer drop-shadow-sm`}
                  onClick={link.onClick}
                >
                  {link.icon}
                  <span className="hidden lg:inline">{link.label}</span>
                </button>
              );
            })}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-colors drop-shadow-sm
            ${scrolled ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white hover:bg-indigo-800' : 'bg-white/10 hover:bg-white/20 text-blue-600'}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200 ${scrolled ? 'text-white' : 'text-blue-600'}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <g>
              {mobileMenuOpen ? (
                <>
                  <path d="M6 18L18 6" />
                  <path d="M6 6l12 12" />
                </>
              ) : (
                <>
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </>
              )}
            </g>
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
        <div className="">
          <div className="px-4 py-3 space-y-2">
            {navLinks
              .filter((link) => link.mobile && link.show)
              .map((link) => {
                const linkColor = scrolled ? "text-white" : link.color;
                return link.isLink ? (
                  <Link
                    key={link.label}
                    href={link.href || ""}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold ${linkColor} hover:text-green-500 hover:bg-white/10 rounded-lg transition-colors drop-shadow-sm`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.label}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold ${linkColor} hover:text-green-500 hover:bg-white/10 rounded-lg transition-colors bg-transparent border-none cursor-pointer text-left drop-shadow-sm`}
                    onClick={() => {
                      link.onClick();
                      setMobileMenuOpen(false);
                    }}
                  >
                    {link.icon}
                    {link.label}
                  </button>
                );
              })}
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
  const isTestBeginPage =
    router.pathname.startsWith("/test/") && router.pathname.endsWith("/begin");
  return (
    <div className="bg-gray-50 flex flex-col">
      {!isTestBeginPage && <Navbar user={user} />}
      <main className="w-full ">{children}</main>
      {!isTestBeginPage && <Footer />}
    </div>
  );
};

export default Layout;
