import mixpanel from "./mixpanel";

const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production";

export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  if (!isProduction) return;

  mixpanel.track(eventName, {
    platform: "web",
    ...properties,
  });
};