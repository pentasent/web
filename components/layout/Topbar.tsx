"use client";

import { Flags } from "@/lib/constants/Flag";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function Topbar() {
  return (
    <div className="w-full bg-primary text-xs sm:text-sm">
      <div className="max-w-full mx-auto py-3 px-6 flex flex-col sm:flex-row items-center justify-center gap-3 relative">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-1 items-center">
            {Flags.map(({ code, name }) => (
              <Image
                key={code}
                src={`/assets/images/flags/${code}-circle.png`}
                width={18}
                height={18}
                alt={`${name} Flag`}
              />
            ))}
          </div>

          <span className="font-normal text-muted">
            Learners from 20+ countries
          </span>
        </div>

        <a
          href="#join"
          className="flex items-center gap-1.5 text-white hover:text-gray-100 group transition-colors font-medium"
        >
          <span>Join Community</span>

          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 -rotate-45 group-hover:rotate-0" />
        </a>
      </div>
    </div>
  );
}