"use client";

import { useState } from "react";
import { Sidebar } from "@/components/app/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex bg-[#FFFBF7] min-h-screen">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />
      <main className="flex-1 w-full lg:pl-[80px]">
        {/* Header matches styling from UI image */}
        <header className="h-[70px] xl:hidden lg:hidden flex items-center justify-between px-2 shrink-0 bg-[#FFFBF7] z-40 w-full lg:w-[calc(100%-80px)] lg:mt-0 fixed top-0 left-0 backdrop-blur-md lg:ml-[80px]">
          <div className="flex items-center justify-between px-2 flex-1 max-w-7xl">
            {/* <span className="text-[#3c2a34] font-semibold text-2xl lg:hidden font-serif">Pentasent</span> */}
            <Link href="/app/feed" className="flex items-center gap-3 overflow-hidden">
              <Image src="/images/penta_logo.svg" alt="Logo" width={40} height={40} className="rounded-lg" />
              <span
                className="text-2xl font-bold font-serif whitespace-nowrap text-[#3c2a34]"
              >
                Pentasent
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden shrink-0 bg-[#F8F2EE] rounded-lg hover:bg-[#F8F2EE]"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="h-6 w-6 text-[#3c2a34]" />
            </Button>
          </div>
        </header>

        <div className="md:px-4 xl:px-8 bg-[#FFFBF7]">
          {children}
        </div>
      </main>
    </div>
  );
}