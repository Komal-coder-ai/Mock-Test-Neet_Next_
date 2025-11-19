import type { AppProps } from "next/app";
import "../styles/globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";

function Header() {
  const [role, setRole] = useState<string | null>(null);
  const [userId, setuserId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const r = localStorage.getItem("userRole");
      const userId = localStorage.getItem("userId");
      setRole(r);
      setuserId(userId);
    } catch (e) {
      setRole(null);
    }
  }, []);

  return (
    <>
      {(userId && role == "admin")&& (
        <header className="bg-white shadow">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-bold">
              MockTest
            </Link>
            <nav className="flex items-center gap-4">
            
                <Link
                  href="/admin/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-700"
                >
                  Admin Dashboard
                </Link>
            
             
            </nav>
          </div>
        </header>
      )}
    </>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}
