import mixpanel from "./mixpanel";

const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production";

export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  if (!isProduction) return;

  mixpanel.identify(userId);

  if (traits) {
    mixpanel.people.set(traits);
  }
};