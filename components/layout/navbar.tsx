'use client';

import Link from "next/link";

export default function Navbar() {
  return (
      <nav className="fixed top-0 left-0 w-full backdrop-blur-md z-50 flex items-center justify-between px-6 md:px-12 lg:px-20 py-4 mx-auto bg-transparent">
        <div className="flex items-center gap-12">
          <div className="text-3xl font-light tracking-wide text-[#3d253b]" style={{ fontFamily: 'Georgia, serif' }}>
            <Link href="/">Pentasent</Link>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[15px] text-gray-700">
            <a href="/#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="/#glance" className="hover:text-gray-900 transition-colors">Glance</a>
            <a href="/#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
            <a href="/articles" className="hover:text-gray-900 transition-colors">Articles</a>
          </div>
        </div>
        <a href="/beta-release">
          <button className="bg-[#3d2f4d] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#2d1f3d] transition-all">
            Get the App
          </button>
        </a>
      </nav>
  );
}
