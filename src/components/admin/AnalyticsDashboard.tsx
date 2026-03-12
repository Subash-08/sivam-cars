"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Button from "@/components/ui/Button";

interface DashboardProps {
  variant?: "summary" | "detailed";
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function AnalyticsDashboard({ variant = "summary" }: DashboardProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7daysAgo");

  const fetchData = async (range: string) => {
    setLoading(true);
    try {
      // Map dropdown value to simple ranges or keep literal for GA
      let startDate = range;
      let endDate = "today";
      if (range === "yesterday") {
        startDate = "yesterday"; endDate = "yesterday";
      }

      const res = await fetch(`/api/admin/analytics?startDate=${startDate}&endDate=${endDate}`, {
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to load analytics");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Analytics fetch error:", err);
      setData({ error: true });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(dateRange);
  }, [dateRange]);

  const handleExportCSV = () => {
    // Very basic CSV text string combining top lines
    if (!data || !data.ga) return;
    const csvContent = "data:text/csv;charset=utf-8,Type,Metric,Value\n"
      + `Overview,Active Users,${data.ga.overview?.rows?.[0]?.metricValues?.[0]?.value || 0}\n`
      + `Overview,Page Views,${data.ga.overview?.rows?.[0]?.metricValues?.[1]?.value || 0}\n`
      + `Overview,Sessions,${data.ga.overview?.rows?.[0]?.metricValues?.[2]?.value || 0}\n`
      + `Database,Total Cars,${data.database?.totalActiveCars || 0}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse mt-8">
        <div className="h-10 w-48 bg-muted rounded"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div className="h-24 bg-muted rounded"></div>
          <div className="h-24 bg-muted rounded"></div>
          <div className="h-24 bg-muted rounded"></div>
          <div className="h-24 bg-muted rounded"></div>
          <div className="h-24 bg-muted rounded"></div>
          <div className="h-24 bg-muted rounded"></div>
        </div>
        <div className="h-64 bg-muted rounded"></div>
      </div>
    );
  }

  if (!data || data.error) {
    return (
      <Card className="mt-8 border-destructive/50">
        <CardContent className="p-6">
          <p className="text-destructive font-medium">Failed to load advanced Google Analytics data.</p>
        </CardContent>
      </Card>
    );
  }

  // --- Data Extraction ---
  const ga = data.ga;
  const db = data.database;
  const overview = ga.overview?.rows?.[0]?.metricValues || [];

  // Format events to extract specific core actions
  const eventsRaw = ga.events?.rows?.map((row: any) => ({
    name: row.dimensionValues?.[0]?.value || "Unknown",
    count: Number(row.metricValues?.[0]?.value || 0)
  })) || [];

  const getEventCount = (name: string) => eventsRaw.find((e: any) => e.name === name)?.count || 0;
  const totalEnquiries = getEventCount("car_enquiry") + getEventCount("contact_lead");
  const totalPageViews = Number(overview?.[1]?.value || 0);
  const conversionRate = totalPageViews > 0 ? ((totalEnquiries / totalPageViews) * 100).toFixed(2) + "%" : "0%";

  const topCarsData = ga.topCars?.rows?.map((row: any) => ({
    name: row.dimensionValues?.[0]?.value.replace('/cars/', '') || "/",
    views: Number(row.metricValues?.[0]?.value || 0)
  })) || [];

  const trendsData = ga.trends?.rows?.map((row: any) => ({
    date: row.dimensionValues?.[0]?.value.slice(-4), // Just DD format approx
    users: Number(row.metricValues?.[0]?.value || 0),
    sessions: Number(row.metricValues?.[1]?.value || 0)
  })) || [];

  const deviceData = ga.devices?.rows?.map((row: any) => ({
    name: row.dimensionValues?.[0]?.value || "Unknown",
    value: Number(row.metricValues?.[0]?.value || 0)
  })) || [];

  const trafficData = ga.trafficSources?.rows?.map((row: any) => ({
    name: row.dimensionValues?.[0]?.value || "Direct",
    value: Number(row.metricValues?.[0]?.value || 0)
  })) || [];

  return (
    <div className="space-y-6 mt-8">

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Dashboard Intelligence
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Live traffic & database integrations</p>
        </div>

        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="7daysAgo">Last 7 Days</SelectItem>
              <SelectItem value="30daysAgo">Last 30 Days</SelectItem>
              <SelectItem value="90daysAgo">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>

          {variant === "detailed" && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportCSV}>Export CSV</Button>
              <Button variant="secondary" onClick={() => window.print()}>Export PDF</Button>
            </div>
          )}
        </div>
      </div>

      {/* Top Level Metric Cards (For both Summary & Detailed) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: "Visitors", val: overview?.[0]?.value || "0" },
          { label: "Sessions", val: overview?.[2]?.value || "0" },
          { label: "Page Views", val: totalPageViews },
          { label: "Enquiries", val: totalEnquiries, color: "text-primary" },
          { label: "WA Clicks", val: getEventCount("click_whatsapp"), color: "text-success" },
          { label: "Sell Cars", val: getEventCount("sell_car_submit"), color: "text-warning" }
        ].map((m, i) => (
          <Card key={i} className="bg-gradient-to-br from-card to-muted border-border shadow-sm">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
              <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{m.label}</h3>
              <p className={`text-2xl font-black ${m.color || 'text-foreground'}`}>{m.val}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DB Summary Bar */}
      {db && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground bg-muted p-3 rounded-md border border-border">
          <span className="font-semibold text-foreground">Platform Size:</span>
          <span>{db.totalActiveCars} Active Cars</span> &bull;
          <span>{db.totalBrands} Brands</span> &bull;
          <span>{db.totalBlogs} Articles</span> &bull;
          <span className="font-semibold text-primary">Conversion Rate: {conversionRate}</span>
        </div>
      )}

      {/* Detailed Charts View */}
      {variant === "detailed" && (
        <>
          {/* Row 1: Trends & Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Visitor Trends</CardTitle>
                <CardDescription>Daily Active Users vs Sessions</CardDescription>
              </CardHeader>
              <CardContent className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendsData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="sessions" stroke="#94a3b8" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={deviceData} 
                      cx="50%" cy="50%" 
                      innerRadius={60} outerRadius={80} 
                      paddingAngle={5} dataKey="value"
                      label={({ name, percent }: any) => `${name || 'Unknown'} (${((percent || 0) * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {deviceData.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Deep Dives */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Generating Cars</CardTitle>
              </CardHeader>
              <CardContent className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCarsData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" width={80} fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="views" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Event Performance</CardTitle>
              </CardHeader>
              <CardContent className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventsRaw.slice(0, 6)} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" width={80} fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={trafficData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }: any) => `${name?.slice(0, 10) || ''} (${((percent || 0) * 100).toFixed(0)}%)`} labelLine={false} >
                      {trafficData.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}

    </div>
  );
}
