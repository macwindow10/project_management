import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Management System",
  description: "Manage your projects efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#020817] text-white`}
      >
        <nav className="bg-[#020817] text-white fixed w-full z-30 top-0">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Image
                  src="/images/logo.png"
                  alt="Project Manager"
                  width={32}
                  height={32}
                  className="w-8"
                />
                <span className="text-xl font-semibold">Project Manager</span>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <Link
                  href="/"
                  className="hover:text-blue-500 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  className="hover:text-blue-500 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/projects"
                  className="hover:text-blue-500 transition-colors"
                >
                  Projects
                </Link>
                <Link
                  href="/persons"
                  className="hover:text-blue-500 transition-colors"
                >
                  Persons
                </Link>
                <Link
                  href="/hardware"
                  className="hover:text-blue-500 transition-colors"
                >
                  Hardware
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full bg-gray-800">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                </button>
                <Link
                  href="/signin"
                  className="hover:text-blue-500 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/get-started"
                  className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="pt-[62px]">{children}</main>
      </body>
    </html>
  );
}
