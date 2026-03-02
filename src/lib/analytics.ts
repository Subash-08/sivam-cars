type EventParams = Record<
    string,
    string | number | boolean | null | undefined
>;

const isDev = process.env.NODE_ENV === "development";
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

export const trackEvent = (
    eventName: string,
    params?: EventParams
) => {
    if (typeof window === "undefined") return;

    if (isDev) {
        console.log(`📊 Event: ${eventName}`, params);
    }

    if (!window.gtag) {
        if (isDev) {
            console.warn("⚠️ gtag not loaded");
        }
        return;
    }

    window.gtag("event", eventName, params);
};

export const trackPageView = (url: string, title?: string) => {
    if (
        typeof window === "undefined" ||
        !window.gtag ||
        !GA_MEASUREMENT_ID
    )
        return;

    if (isDev) {
        console.log(`📊 Page View: ${url} | ${title || ''}`);
    }

    window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: url,
        page_title: title,
    });
};

export const setUserProperties = (
    properties: Record<string, any>
) => {
    if (typeof window === "undefined" || !window.gtag) return;

    if (isDev) {
        console.log(`📊 Set User Properties:`, properties);
    }

    window.gtag("set", properties);
};
