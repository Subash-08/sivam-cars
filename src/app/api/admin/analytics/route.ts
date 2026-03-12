import { NextRequest, NextResponse } from "next/server";
import {
    getAnalyticsOverview,
    getTopPages,
    getEventMetrics,
    getTrafficSources,
    getDeviceBreakdown,
    getTopViewedCars,
    getVisitorTrends
} from "@/lib/googleAnalytics";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Car } from "@/models/Car.model";
import { Brand } from "@/models/Brand.model";
import Blog from "@/models/Blog.model";

export const revalidate = 300; // Cache for 5 minutes

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        // Ensure only authenticated users can access this route
        if (!session) {
            console.log("Analytics Auth Rejected:", session);
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse date range from query string, e.g., ?startDate=7daysAgo&endDate=today
        const searchParams = req.nextUrl.searchParams;
        const startDate = searchParams.get('startDate') || '7daysAgo';
        const endDate = searchParams.get('endDate') || 'today';
        const range = { startDate, endDate };

        // Ensure MongoDB is connected
        await connectDB();

        // Fetch DB metrics & GA metrics in parallel for maximum performance
        const [
            dbStats,
            overview,
            pages,
            events,
            trafficSources,
            devices,
            topCars,
            trends
        ] = await Promise.all([
            Promise.all([
                Car.countDocuments({ isSold: false, isActive: true }), // Active inventory
                Brand.countDocuments({ isActive: true }), // Active brands
                Blog.countDocuments({ status: 'published' }) // Published blogs
            ]),
            getAnalyticsOverview(range),
            getTopPages(range),
            getEventMetrics(range),
            getTrafficSources(range),
            getDeviceBreakdown(range),
            getTopViewedCars(range),
            getVisitorTrends(range)
        ]);

        const [totalActiveCars, totalBrands, totalBlogs] = dbStats;

        return NextResponse.json({
            database: {
                totalActiveCars,
                totalBrands,
                totalBlogs
            },
            ga: {
                overview,
                pages,
                events,
                trafficSources,
                devices,
                topCars,
                trends
            }
        });
    } catch (error) {
        console.error("Analytics API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch analytics" },
            { status: 500 }
        );
    }
}
