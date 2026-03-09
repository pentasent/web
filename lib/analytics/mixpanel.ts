import mixpanel from "mixpanel-browser";

const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production";

export const initMixpanel = () => {
  if (!isProduction) return;

  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN as string, {
    track_pageview: false,
    persistence: "localStorage",
  });
};

export default mixpanel;