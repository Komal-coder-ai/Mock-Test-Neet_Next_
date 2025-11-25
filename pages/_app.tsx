import type { AppProps } from "next/app";
import "../styles/globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

function Header() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [userId, setuserId] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState<string | null>(null);

  useEffect(() => {
    try {
      const r = localStorage.getItem("userRole");
      const userId = localStorage.getItem("userId");
      setRole(r);
      setuserId(userId);
      const up = localStorage.getItem("userPhone") || null;
      setUserPhone(up);
    } catch (e) {
      setRole(null);
    }
  }, []);

  function handleLogout() {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      localStorage.removeItem("userPhone");
      localStorage.removeItem("user");
    } catch (e) {}
    router.push("/");
  }

  return (
    <>
      {userId && role == "admin" ? (
        <></>
      ) : (
        <header className="bg-white shadow">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-bold">
              MockTest
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Home
              </Link>
              <a
                onClick={() =>
                  router.push(
                    `/test/history?phone=${encodeURIComponent(userPhone || "")}`
                  )
                }
                className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Test History
              </a>
              <a
                onClick={() => {
                  if (userId) router.push("/profile");
                  else router.push("/login");
                }}
                className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Profile
              </a>

              {userId ? (
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-1 rounded bg-red-50 text-red-700 text-sm"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="ml-4 px-3 py-1 rounded bg-blue-50 text-blue-700 text-sm"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        </header>
      )}
    </>
  );
}


export default function App({ Component, pageProps }: AppProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const id = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    setUserId(id);

    // Patch global fetch to handle 401
    if (typeof window !== "undefined") {
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const response = await originalFetch(...args);
        if (response.status === 401) {
          try {
            localStorage.clear();
          } catch (e) {}
          router.push("/login");
        }
        return response;
      };
    } 
  }, [router]);

  const Layout = require("../components/Layout").default;

  return (
    <>
      <Head>
        <title>HPBOSE | NEET &amp; JEE Preparation</title>
        <link rel="icon" href="/images.png" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
