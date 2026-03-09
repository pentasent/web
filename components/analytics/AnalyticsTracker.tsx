"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import mixpanel, { initMixpanel } from "@/lib/analytics/mixpanel";

const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isProduction) return;

    initMixpanel();

    mixpanel.track("page_view", {
      page: pathname,
      platform: "web",
    });
  }, [pathname]);

  return null;
}