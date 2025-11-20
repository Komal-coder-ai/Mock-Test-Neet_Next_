import type { AppProps } from "next/app";
import "../styles/globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'

function Header() {
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null);
  const [userId, setuserId] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState<string | null>(null)

  useEffect(() => {
    try {
      const r = localStorage.getItem("userRole");
      const userId = localStorage.getItem("userId");
      setRole(r);
      setuserId(userId);
      const up = localStorage.getItem('userPhone') || null
      setUserPhone(up)
    } catch (e) {
      setRole(null);
    }
  }, []);

  function handleLogout() {
    try {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userRole')
      localStorage.removeItem('userId')
      localStorage.removeItem('userPhone')
      localStorage.removeItem('user')
    } catch (e) {}
    router.push('/')
  }

  return (
    <>
      {(userId && role == "admin") ? (
        <></>
      ) : (
        <header className="bg-white shadow">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-bold">
              MockTest
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">Home</Link>
              <a onClick={() => router.push(`/test/history?phone=${encodeURIComponent(userPhone || '')}`)} className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Test History</a>
              <a onClick={() => {
                // profile/adhar
                if (userPhone) router.push(`/adhar?phone=${encodeURIComponent(userPhone)}`)
                else router.push('/login')
              }} className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Profile</a>

              {userId ? (
                <button onClick={handleLogout} className="ml-4 px-3 py-1 rounded bg-red-50 text-red-700 text-sm">Logout</button>
              ) : (
                <Link href="/login" className="ml-4 px-3 py-1 rounded bg-blue-50 text-blue-700 text-sm">Login</Link>
              )}
            </nav>
          </div>
        </header>
      )}
    </>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const id = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    setUserId(id);
  }, []);


  const Layout = require('../components/Layout').default;

  return (
    <>
      {/* Optionally keep Header for non-userId pages */}
      {!userId && <Header />}
      {userId ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}
