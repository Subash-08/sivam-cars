import { BetaAnalyticsDataClient } from "@google-analytics/data";

const propertyId = process.env.GA_PROPERTY_ID;

const credentials = JSON.parse(
    process.env.GA_SERVICE_ACCOUNT_KEY as string
);

const analyticsClient = new BetaAnalyticsDataClient({
    credentials,
});

export interface DateRange {
    startDate: string;
    endDate: string;
}

const defaultRange: DateRange = { startDate: "7daysAgo", endDate: "today" };

export async function getAnalyticsOverview(range: DateRange = defaultRange) {
    const [response] = await analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [range],
        metrics: [
            { name: "activeUsers" },
            { name: "screenPageViews" },
            { name: "sessions" },
            { name: "newUsers" }
        ]
    });
    return response;
}

export async function getVisitorTrends(range: DateRange = defaultRange) {
    const [response] = await analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [range],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }, { name: "sessions" }],
        orderBys: [{ dimension: { dimensionName: "date" } }]
    });
    return response;
}

export async function getTopPages(range: DateRange = defaultRange) {
    const [response] = await analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [range],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 10
    });
    return response;
}

export async function getEventMetrics(range: DateRange = defaultRange) {
    const [response] = await analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [range],
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        orderBys: [{ metric: { metricName: "eventCount" }, desc: true }]
    });
    return response;
}

export async function getTrafficSources(range: DateRange = defaultRange) {
    const [response] = await analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [range],
        dimensions: [{ name: "sessionSourceMedium" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 5
    });
    return response;
}

export async function getDeviceBreakdown(range: DateRange = defaultRange) {
    const [response] = await analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [range],
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "activeUsers" }]
    });
    return response;
}

export async function getTopViewedCars(range: DateRange = defaultRange) {
    const [response] = await analyticsClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [range],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        dimensionFilter: {
            filter: {
                fieldName: "pagePath",
                stringFilter: { matchType: "BEGINS_WITH", value: "/cars/" }
            }
        },
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 10
    });
    return response;
}
