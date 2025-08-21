// src/app/(auth)/layout.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FloatingDock } from "@/components/ui/floating-dock";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const links = [
    {
      title: "Home",
      href: "/",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      title: "About",
      href: "/about",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      ),
    },
    {
      title: "Contact",
      href: "/contact",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px, rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center, rgba(120,119,198,0.3)_0,transparent_50%)]"></div>
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 animate-float"
            style={{
              width: Math.random() * 50 + 10 + 'px',
              height: Math.random() * 50 + 10 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: Math.random() * 10 + 10 + 's',
            }}
          ></div>
        ))}
      </div>

      {/* Left Panel */}
      <section className="hidden w-1/2 items-center justify-center p-10 lg:flex xl:w-2/5 relative">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12 relative z-10">
          <Link href="/" className="group">
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Digital Library
            </span>
          </Link>

          <div className="space-y-6 text-white">
            <h1 className="text-5xl font-bold leading-tight">
              Welcome to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Future</span> of Library Management
            </h1>
            <p className="text-lg text-gray-300">
              Access thousands of resources, reserve study spaces, and manage your academic journey with our cutting-edge platform.
            </p>
          </div>
          
          {/* <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <Image
              src="/images/library-group.jpg"
              alt="Modern Library"
              width={400}
              height={300}
              className="relative rounded-lg transition-all duration-300 group-hover:scale-105"
            />
          </div> */}

          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            {[
              { icon: "📚", text: "10K+ Resources" },
              { icon: "🪑", text: "Smart Reservations" },
              { icon: "📊", text: "Analytics Dashboard" },
              { icon: "🔒", text: "Secure Access" }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-2 text-gray-300">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Right Panel */}
      <section className="flex flex-1 flex-col items-center justify-center p-4 py-10 lg:p-10 lg:py-0 relative">
        {/* Mobile logo */}
        <div className="mb-10 lg:hidden">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Digital Library
          </span>
        </div>

        {children}
        
        {/* Floating navigation dock */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 lg:hidden">
          <FloatingDock items={links} />
        </div>
      </section>
    </div>
  );
};

export default Layout;