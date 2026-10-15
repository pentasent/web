'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShieldCheck, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { AUTH_LAYOUT_CONFIG, AUTH_HEADER_COPY } from '@/data/auth';

export default function AuthHeader() {
  const pathname = usePathname();
  const isLoginPage = pathname === '/auth/login' || pathname === '/auth' || pathname === '/auth/';
  const isRegisterPage = pathname === '/auth/register';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#ded9d5] transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-18 items-center justify-between">
          {/* Left Brand Mark - Consistent with InvestorNavbar */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="group flex items-center select-none transition-opacity hover:opacity-85"
            >
              <Image
                src="/assets/images/logos/penta-text-burgundy-dark.svg"
                alt="Pentasent"
                width={135}
                height={40}
                className="w-28 xs:w-32 sm:w-34 h-auto"
                priority
              />
            </Link>
            <span className="hidden md:inline-block h-4 w-px bg-[#ded9d5]" />
            <span className="hidden md:inline-flex items-center gap-1.5 text-[12.5px] sm:text-[13px] font-medium tracking-wide text-muted-foreground">
              <ShieldCheck size={15} className="text-primary" />
              {AUTH_LAYOUT_CONFIG.securityLabel}
            </span>
          </div>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {isLoginPage && (
              <div className="flex items-center gap-1.5 sm:gap-2 text-[13px] sm:text-[14px]">
                <span className="text-muted-foreground hidden sm:inline">{AUTH_HEADER_COPY.loginPrompt}</span>
                <Link
                  href={AUTH_HEADER_COPY.registerHref}
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary-hover hover:underline"
                >
                  <span>{AUTH_HEADER_COPY.registerActionText}</span>
                  <ArrowUpRight size={14} className="hidden xs:inline" />
                </Link>
              </div>
            )}

            {isRegisterPage && (
              <div className="flex items-center gap-1.5 sm:gap-2 text-[13px] sm:text-[14px]">
                <span className="text-muted-foreground hidden sm:inline">{AUTH_HEADER_COPY.registerPrompt}</span>
                <Link
                  href={AUTH_HEADER_COPY.loginHref}
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary-hover hover:underline"
                >
                  <span>{AUTH_HEADER_COPY.loginActionText}</span>
                  <ArrowUpRight size={14} className="hidden xs:inline" />
                </Link>
              </div>
            )}

            <Link
              href={AUTH_HEADER_COPY.backHref}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-md border border-[#ded9d5] bg-[#faf9f8] text-[13px] sm:text-[13.5px] font-medium text-foreground hover:border-primary hover:text-primary hover:bg-white transition-all select-none"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">{AUTH_HEADER_COPY.backPrefix}</span> {AUTH_HEADER_COPY.backBrand}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
