import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BookOpen, Activity, User, ScrollText } from "lucide-react";

const Navbar = ({ user }: { user?: any }) => {
  const router = useRouter();
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            const phone = localStorage.getItem("userPhone") || "";
            router.push(`/dashboard`);
          }}
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <BookOpen size={20} />
          </div>
          <div>
            <div className="font-semibold text-lg text-gray-900">
              MockTest Pro
            </div>
            <div className="text-xs text-gray-500">JEE & NEET Preparation</div>
          </div>
        </div>
        {/* Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <button
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer"
            onClick={() => {
              const phone = localStorage.getItem("userPhone") || "";
              router.push(`/test/history?phone=${encodeURIComponent(phone)}`);
            }}
          >
            <Activity size={16} />
            Test History
          </button>
          <button
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer"
           
          >
            <User size={16} />
            Profile
          </button>
          <Link
            href="/terms"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ScrollText size={16} />
            Terms
          </Link>
        </div>
        {/* User Info */}
        {user && (
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {user.name}
            </span>
          </div>
        )}
      </div>
    </nav>
  );
};

const Layout = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: any;
}) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar user={user} />
    <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
  </div>
);

export default Layout;
