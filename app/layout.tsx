import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#ffffff] text-[#1F2328]`}
      >
        <nav className="bg-[#ffffff] border-b border-[#d0d7de] fixed w-full z-30 top-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-[62px]">
              <div className="flex">
                <div className="shrink-0 flex items-center">
                  <span className="text-xl font-semibold text-[#1F2328]">
                    Project Management
                  </span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                  <a
                    href="/dashboard"
                    className="border-[#fd8c73] text-[#1F2328] inline-flex items-center px-3 pt-1 border-b-2 text-[14px] leading-normal font-semibold"
                  >
                    Dashboard
                  </a>
                  <a
                    href="/projects"
                    className="border-transparent text-[#656d76] hover:border-[#656d76] hover:text-[#1F2328] inline-flex items-center px-3 pt-1 border-b-2 text-[14px] leading-normal"
                  >
                    Projects
                  </a>
                  <a
                    href="/persons"
                    className="border-transparent text-[#656d76] hover:border-[#656d76] hover:text-[#1F2328] inline-flex items-center px-3 pt-1 border-b-2 text-[14px] leading-normal"
                  >
                    Team Members
                  </a>
                  <a
                    href="/hardware"
                    className="border-transparent text-[#656d76] hover:border-[#656d76] hover:text-[#1F2328] inline-flex items-center px-3 pt-1 border-b-2 text-[14px] leading-normal"
                  >
                    Hardware
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="pt-[62px] pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
