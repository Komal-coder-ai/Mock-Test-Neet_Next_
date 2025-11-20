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
  const [userId, setUserId] = useState<string | null>(null);
  console.log(userId, "userIduserId");

  useEffect(() => {
    const id =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    setUserId(id);
  }, []);

  const router = useRouter();
  return (
    <nav className={`${COLORS.navBg} ${COLORS.navShadow} ${COLORS.navBorder}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            const phone = localStorage.getItem("userPhone") || "";
            router.push(`/`);
          }}
        >
          <div
            className={`w-10 h-10 rounded-lg ${COLORS.logoBg} flex items-center justify-center shadow-md`}
          >
            <BookOpen size={24} className={COLORS.logoText} />
          </div>
          <div>
            <div className={`font-extrabold text-xl ${COLORS.navText}`}>
              MockTest Pro
            </div>
            <div
              className={`text-xs ${COLORS.navAccent} font-semibold tracking-wide`}
            >
              NEET & JEE Preparation
            </div>
          </div>
        </div>
        {/* Navigation */}
        {userId ? (
          <div className="hidden md:flex items-center gap-8">
            <button
              className={`flex items-center gap-2 text-base font-medium ${COLORS.navText} hover:${COLORS.navAccent} transition-colors bg-transparent border-none cursor-pointer`}
              onClick={() => {
                router.push(`/dashboard`);
              }}
            >
              <HomeIcon size={18} />
              Home
            </button>
            <button
              className={`flex items-center gap-2 text-base font-medium ${COLORS.navText} hover:${COLORS.navAccent} transition-colors bg-transparent border-none cursor-pointer`}
              onClick={() => {
                const phone = localStorage.getItem("userPhone") || "";
                router.push(`/test/history?phone=${encodeURIComponent(phone)}`);
              }}
            >
              <Activity size={18} />
              Test History
            </button>
           
            <button
              className={`flex items-center gap-2 text-base font-medium ${COLORS.navText} hover:${COLORS.navAccent} transition-colors bg-transparent border-none cursor-pointer`}
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
              Profile
            </button>
            <Link
              href="/terms"
              className={`flex items-center gap-2 text-base font-medium ${COLORS.navText} hover:${COLORS.navAccent} transition-colors`}
            >
              <ScrollText size={18} />
              Terms
            </Link>
          </div>
        ) : (
          <>
            <button
              className={`flex items-center gap-2 text-base font-medium ${COLORS.navText} hover:${COLORS.navAccent} transition-colors bg-transparent border-none cursor-pointer`}
              onClick={() => {
                const phone = localStorage.getItem("userPhone") || "";
                router.push(`/login`);
              }}
            >
              <LogIn size={18} />
              Login
            </button>
          </>
        )}

        {/* User Info */}
        {user && (
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-indigo-200 shadow">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="text-sm font-medium text-blue-700">
              {user.name}
            </span>
          </div>
        )}
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="mt-16 py-8 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
    <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-700">
      <div className="mb-2 font-semibold text-blue-700">
        MockTest Pro - NEET & JEE Preparation
      </div>
      <p className="mb-2">© 2024 MockTest Pro. All rights reserved.</p>
      <div className="mb-2 flex justify-center gap-6 text-xs text-gray-600">
        <span>
          Contact:{" "}
          <a
            href="mailto:support@mocktestpro.com"
            className="text-blue-600 hover:underline"
          >
            support@mocktestpro.com
          </a>
        </span>
        <span>
          WhatsApp:{" "}
          <a
            href="https://wa.me/919876543210"
            className="text-blue-600 hover:underline"
          >
            +91-9876543210
          </a>
        </span>
        <span>
          Instagram:{" "}
          <a
            href="https://instagram.com/mocktestpro"
            className="text-blue-600 hover:underline"
          >
            @mocktestpro
          </a>
        </span>
      </div>
      <div className="mt-2 text-xs text-gray-500">
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
    <main className="w-[90vw] mx-auto px-6 py-8 flex-1">{children}</main>
    <Footer />
  </div>
);

export default Layout;
