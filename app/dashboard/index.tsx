"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "@/styles/links.scss";

const Sparkline = dynamic(() => import("@/components/charts/sparkline"), {
  ssr: false,
});

const MyLineChart = dynamic(() => import("@/components/charts/line"), {
  ssr: false,
});

const DoughnutCard = dynamic(
  () => import("@/components/charts/doughnut-card"),
  { ssr: false },
);

// Dynamically import chart components
const MyBarChart = dynamic(() => import("@/components/charts/bar"), {
  ssr: false,
});

type PageProps = {
  summary: {
    locations: number;
    staff: number;
    visitors: number;
    sessions: number;
  } | null;
  retailsSessions: any[] | null;
  monthlyVisitors: any;
  locations: string[] | null;
};

type DashboardProps = PageProps & {
  topMetrics?: any[];
  topPerformingProducts?: any[];
  totalEngagementViaAI?: any;
  dailyEngagement?: any;
  weeklyEngagement?: any;
  monthlyEngagement?: any;
  topPerformingRetailLinks?: any;
  regionData?: any[];
  countryCount?: { country: string; percent: number }[];
  recentRecommendations?: any[];
  recentTransactions?: any[];
  barChartData?: any;
  lineChartData?: any;
  doughnutData?: any;
  aiInteractions?: any;
  cartCheckoutAnalytics?: {
    totals?: {
      carts?: number;
      checkouts?: number;
      cartOperations?: number;
      checkoutOperations?: number;
      conversionRate?: number;
    };
    byDay?: {
      labels?: string[];
      carts?: number[];
      checkouts?: number[];
      operations?: number[];
      conversionRate?: number[];
    };
    byWeek?: {
      labels?: string[];
      carts?: number[];
      checkouts?: number[];
      operations?: number[];
      conversionRate?: number[];
    };
    byMonth?: {
      labels?: string[];
      carts?: number[];
      checkouts?: number[];
      operations?: number[];
      conversionRate?: number[];
    };
    byYear?: {
      labels?: string[];
      carts?: number[];
      checkouts?: number[];
      operations?: number[];
      conversionRate?: number[];
    };
  };
};

const DEFAULT_TOP_METRICS = [
  {
    label: "Recurring 3-day ARR",
    value: "106",
    trend: "+23%",
    isPositive: true,
    colorClass: "text-blue-500",
    points: [12, 18, 16, 22, 20, 26, 24, 28, 0],
  },
  {
    label: "Users",
    value: "1,248",
    trend: "+15.3%",
    isPositive: true,
    colorClass: "text-orange-500",
    points: [10, 12, 11, 14, 16, 15, 18, 19, 21],
  },
  {
    label: "New visits this month",
    value: "32.4k",
    trend: "+18%",
    isPositive: true,
    colorClass: "text-emerald-500",
    points: [8, 9, 11, 13, 12, 14, 16, 17, 18],
  },
];

const DEFAULT_TOP_PERFORMING = [
  { title: "Training", percent: 98 },
  { title: "Coaching", percent: 85 },
  { title: "Consulting", percent: 75 },
  { title: "Software", percent: 68 },
  { title: "Analytics", percent: 45 },
];

const DEFAULT_REGION = [
  { country: "US", percent: 85 },
  { country: "India", percent: 75 },
  { country: "Russia", percent: 68 },
  { country: "Canada", percent: 60 },
  { country: "Germany", percent: 45 },
];

const DEFAULT_REC_RECS = [
  { id: 1, action: "Boost speed", impact: "High", date: "Jan 4, 2021" },
  {
    id: 2,
    action: "Fix the navigation",
    impact: "Medium",
    date: "Dec 2, 2020",
  },
  {
    id: 3,
    action: "Enhance summary cards",
    impact: "Medium",
    date: "Nov 5, 2020",
  },
  { id: 4, action: "Optimize for SEO", impact: "High", date: "Oct 8, 2020" },
];

const DEFAULT_TRANSACTIONS = [
  { id: 1, customer: "John Doe", amount: "$250", date: "Jan 5, 2021" },
  { id: 2, customer: "Jane Smith", amount: "$180", date: "Jan 4, 2021" },
  { id: 3, customer: "Bob Johnson", amount: "$320", date: "Jan 3, 2021" },
];

const DEFAULT_BAR = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Daily Views",
      data: [12, 19, 15, 25, 22, 18, 24],
      backgroundColor: "rgba(99, 102, 241, 0.5)",
      borderColor: "rgba(99, 102, 241, 1)",
      borderWidth: 1,
    },
  ],
};

const WEEKLY_BAR = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    {
      label: "Weekly Views",
      data: [120, 190, 150, 250],
      backgroundColor: "rgba(99, 102, 241, 0.9)",
      borderColor: "rgba(99, 102, 241, 1)",
      borderWidth: 1,
    },
  ],
};

const MONTHLY_BAR = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Monthly Views",
      data: [420, 520, 480, 600, 580, 640],
      backgroundColor: "rgba(99, 102, 241, 0.9)",
      borderColor: "rgba(99, 102, 241, 1)",
      borderWidth: 1,
    },
  ],
};

const DEFAULT_LINE = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Revenue",
      data: [30, 45, 38, 55, 50, 65],
      borderColor: "#10b981",
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      tension: 0.4,
    },
    {
      label: "Expenses",
      data: [20, 30, 28, 40, 35, 45],
      borderColor: "#8b5cf6",
      backgroundColor: "rgba(139, 92, 246, 0.1)",
      tension: 0.4,
    },
  ],
};

const DEFAULT_DOUGHNUT = {
  labels: ["Active", "Idle", "Offline"],
  datasets: [
    {
      label: "Visits",
      data: [66, 20, 14],
      backgroundColor: ["#6366f1", "#10b981", "#f59e0b"],
    },
  ],
};

const DEFAULT_CART_CHECKOUT_ANALYTICS = {
  totals: {
    carts: 1,
    checkouts: 4,
    cartOperations: 1,
    checkoutOperations: 5,
    conversionRate: 400,
  },
  byDay: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    carts: [1, 1, 2, 1, 2, 1, 1],
    checkouts: [2, 3, 2, 4, 3, 4, 4],
    operations: [3, 4, 4, 5, 5, 5, 5],
    conversionRate: [200, 300, 100, 400, 150, 400, 400],
  },
  byWeek: {
    labels: ["W1", "W2", "W3", "W4"],
    carts: [3, 4, 2, 5],
    checkouts: [6, 8, 5, 10],
    operations: [9, 12, 7, 15],
    conversionRate: [200, 200, 250, 200],
  },
  byMonth: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    carts: [10, 14, 9, 16, 12, 18],
    checkouts: [20, 28, 18, 34, 24, 40],
    operations: [30, 42, 27, 50, 36, 58],
    conversionRate: [200, 200, 200, 213, 200, 222],
  },
  byYear: {
    labels: ["2021", "2022", "2023", "2024", "2025", "2026"],
    carts: [80, 95, 110, 130, 145, 160],
    checkouts: [140, 175, 210, 250, 290, 340],
    operations: [220, 270, 320, 380, 435, 500],
    conversionRate: [175, 184, 191, 192, 200, 213],
  },
};

const normalizeNumericArray = (value: unknown): number[] => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const parsed = Number(item);
    return Number.isFinite(parsed) ? parsed : 0;
  });
};

const toCartCheckoutLineData = (source?: {
  labels?: string[];
  carts?: number[];
  checkouts?: number[];
  conversionRate?: number[];
}) => ({
  labels: Array.isArray(source?.labels) ? source!.labels : [],
  datasets: [
    {
      label: "Carts",
      data: normalizeNumericArray(source?.carts),
      borderColor: "#6366f1",
      backgroundColor: "rgba(99, 102, 241, 0.12)",
      tension: 0.35,
    },
    {
      label: "Checkouts",
      data: normalizeNumericArray(source?.checkouts),
      borderColor: "#10b981",
      backgroundColor: "rgba(16, 185, 129, 0.12)",
      tension: 0.35,
    },
    {
      label: "Conversion rate (%)",
      data: normalizeNumericArray(source?.conversionRate),
      borderColor: "#f59e0b",
      backgroundColor: "rgba(245, 158, 11, 0.12)",
      tension: 0.35,
    },
  ],
});

const toEngagementLineData = (source: any) => ({
  labels: Array.isArray(source?.labels) ? source.labels : [],
  datasets: Array.isArray(source?.datasets)
    ? source.datasets.map((ds: any, index: number) => {
        const fallbackColors = ["#6366f1", "#10b981", "#8b5cf6", "#f59e0b"];
        const color =
          ds?.borderColor || fallbackColors[index % fallbackColors.length];
        return {
          label: ds?.label || `Series ${index + 1}`,
          data: normalizeNumericArray(ds?.data),
          borderColor: color,
          backgroundColor: "transparent",
          tension: 0.35,
        };
      })
    : [],
});

function Dashboard(props: DashboardProps) {
  const topMetrics = props.topMetrics ?? DEFAULT_TOP_METRICS;
  const topPerformingProducts =
    props.topPerformingProducts ?? DEFAULT_TOP_PERFORMING;
  const countryCount = props.countryCount ?? DEFAULT_REGION;
  const recentRecommendations = props.recentRecommendations ?? DEFAULT_REC_RECS;
  const recentTransactions = props.recentTransactions ?? DEFAULT_TRANSACTIONS;
  const totalEngagementViaAI = props.totalEngagementViaAI ?? DEFAULT_BAR;
  const dailyEngagement = props.dailyEngagement ?? totalEngagementViaAI;
  const weeklyEngagement = props.weeklyEngagement ?? WEEKLY_BAR;
  const monthlyEngagement = props.monthlyEngagement ?? MONTHLY_BAR;
  const topPerformingRetailLinks =
    props.topPerformingRetailLinks ?? DEFAULT_DOUGHNUT;
  const cartCheckoutAnalytics =
    props.cartCheckoutAnalytics ?? DEFAULT_CART_CHECKOUT_ANALYTICS;

  const [range, setRange] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const [cartCheckoutRange, setCartCheckoutRange] = useState<
    "Weekly" | "Monthly" | "Yearly"
  >("Weekly");
  const chartData =
    range === "Daily"
      ? dailyEngagement
      : range === "Weekly"
        ? weeklyEngagement
        : monthlyEngagement;
  const selectedCartCheckoutData =
    cartCheckoutRange === "Weekly"
        ? cartCheckoutAnalytics.byWeek
      : cartCheckoutRange === "Monthly"
        ? cartCheckoutAnalytics.byMonth
        : cartCheckoutAnalytics.byYear;
  const cartCheckoutLineData = toCartCheckoutLineData(selectedCartCheckoutData);
  const engagementLineData = toEngagementLineData(chartData);

  return (
    <div className="mx-4 px-6 py-6 bg-gradient-to-br from-indigo-50 via-white to-violet-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">
          Analytics Overview
        </h1>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg border border-gray-200 bg-white">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {topMetrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm text-gray-500 truncate">
                  {metric.label}
                </div>
                <div className="mt-2 text-3xl font-semibold text-gray-900">
                  {metric.value}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Sparkline
                  points={metric.points}
                  colorClass={metric.colorClass}
                />
                <div
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    metric.isPositive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {metric.trend}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Circular Progress (Doughnut) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Top performing sales links{" "}
          </h3>
          <div className="flex items-center justify-center">
            <DoughnutCard
              data={topPerformingRetailLinks}
              valueText={topPerformingRetailLinks.total}
              subText="Unique visitors"
              className="w-full"
            />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Total engagement via AI</h3>
            <div className="flex items-center gap-2">
              {(["Daily", "Weekly", "Monthly"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`text-sm px-3 py-1 rounded-full transition-colors border ${
                    range === r
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div style={{ height: "220px" }}>
            <MyBarChart data={chartData} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Visitors by country</h3>
          <div className="space-y-3">
            {countryCount.length === 0 ? (
              <div className="text-gray-400 text-sm">No data available.</div>
            ) : (
              countryCount.map((region, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">
                      {region.country}
                    </span>
                    <span className="text-sm font-semibold">
                      {region.percent}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-indigo-500"
                      style={{ width: `${region.percent}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Top performing products
          </h3>
          <div className="space-y-4">
            {topPerformingProducts.map((product, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">{product.title}</span>
                  <span className="text-sm font-semibold">
                    {product.percent}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{
                      width: `${product.percent}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Cart vs Checkout vs Conversion Rate
            </h3>
            <div className="flex items-center gap-2">
              {(["Weekly", "Monthly", "Yearly"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setCartCheckoutRange(r)}
                  className={`text-sm px-3 py-1 rounded-full transition-colors border ${
                    cartCheckoutRange === r
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div style={{ height: "250px" }}>
            <MyLineChart
              data={cartCheckoutLineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-3">
          <h3 className="text-lg font-semibold mb-2">Coming soon</h3>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent recommendations</h3>
            <a href="#" className="text-blue-600 text-sm hover:underline">
              View all
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-gray-600 font-medium">
                    Action
                  </th>
                  <th className="text-left py-2 text-gray-600 font-medium">
                    Impact
                  </th>
                  <th className="text-left py-2 text-gray-600 font-medium">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentRecommendations.map((rec) => (
                  <tr key={rec.id} className="border-b">
                    <td className="py-3">{rec.action}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          rec.impact === "High"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {rec.impact}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">{rec.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <a href="#" className="text-blue-600 text-sm hover:underline">
            View all
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-gray-600 font-medium">
                  Customer
                </th>
                <th className="text-left py-2 text-gray-600 font-medium">
                  Amount
                </th>
                <th className="text-left py-2 text-gray-600 font-medium">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b">
                  <td className="py-3">{transaction.customer}</td>
                  <td className="py-3 font-semibold">{transaction.amount}</td>
                  <td className="py-3 text-gray-500">{transaction.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
