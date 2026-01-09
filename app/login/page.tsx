"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
// import { useTranslations } from "next-intl"; // Removed to avoid build error outside [locale]

export default function LoginPage() {
  // const t = useTranslations(); // Removed
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, isAdmin } = useAuth();
  const router = useRouter();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (isAdmin) {
      router.push("/admin");
    }
  }, [isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      // Navigation happens in AuthContext after successful login
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.message || "Invalid email or password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/">
            <Image
              src="/Logo.svg"
              alt="One Plus Logo"
              width={150}
              height={60}
              style={{ width: "auto", height: "auto" }}
              className="h-auto"
              priority
            />
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <section className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
        <div className="w-full max-w-md px-6">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <h1 className="text-3xl font-bold text-[#0f1b4b] mb-2 text-center">
              Login
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Sign in to access your account
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f1b4b] focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f1b4b] focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0f1b4b] text-white py-3 rounded-lg font-semibold hover:bg-[#0f1b4b]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="#" className="text-[#701621] hover:underline font-medium">
                  Contact us
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
