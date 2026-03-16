import mixpanel from "mixpanel-browser";

const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production";

export const initMixpanel = () => {
  // if (!isProduction) return;

  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN as string, {
    autocapture: true,
    record_sessions_percent: 100,
    api_host: 'https://api-eu.mixpanel.com',
    batch_requests: true,
    verbose: true,
    ip: true,
    persistence: "localStorage",
  });
};

export default mixpanel;