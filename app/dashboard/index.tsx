"use client";

import dynamic from "next/dynamic";
import "@/styles/links.scss";

const Sparkline = dynamic(() => import("@/components/charts/sparkline"), { ssr: false });

// Dynamically import chart components
const MyBarChart = dynamic(() => import("@/components/charts/bar"), {
  ssr: false,
});

const MyLineChart = dynamic(() => import("@/components/charts/line"), {
  ssr: false,
});

const DoughnutCard = dynamic(() => import("@/components/charts/doughnut-card"), { ssr: false });

type PageProps = {
  summary: {
    locations: number;
    staff: number;
    visitors: number;
    sessions: number;
  } | null;
  retailsSessions: any[] | null;
  monthlyVisitors: number[][] | null;
  locations: string[] | null;
};

type DashboardProps = PageProps & {
  topMetrics?: any[];
  topPerformingProducts?: any[];
  totalEngagementViaAI?: any;
  topPerformingRetailLinks?: any;
  regionData?: any[];
  recentRecommendations?: any[];
  recentTransactions?: any[];
  barChartData?: any;
  lineChartData?: any;
  doughnutData?: any;
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
  }
];

const DEFAULT_TOP_PERFORMING = [
  { name: "Training", progress: 98 },
  { name: "Coaching", progress: 85 },
  { name: "Consulting", progress: 75 },
  { name: "Software", progress: 68 },
  { name: "Analytics", progress: 45 },
];

const DEFAULT_REGION = [
  { country: "US", progress: 85 },
  { country: "India", progress: 75 },
  { country: "Russia", progress: 68 },
  { country: "Canada", progress: 60 },
  { country: "Germany", progress: 45 },
];

const DEFAULT_REC_RECS = [
  { id: 1, action: "Boost speed", impact: "High", date: "Jan 4, 2021" },
  { id: 2, action: "Fix the navigation", impact: "Medium", date: "Dec 2, 2020" },
  { id: 3, action: "Enhance summary cards", impact: "Medium", date: "Nov 5, 2020" },
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

function Dashboard(props: DashboardProps) {
  const topMetrics = props.topMetrics ?? DEFAULT_TOP_METRICS;
  const topPerformingProducts = props.topPerformingProducts ?? DEFAULT_TOP_PERFORMING;
  const regionData = props.regionData ?? DEFAULT_REGION;
  const recentRecommendations = props.recentRecommendations ?? DEFAULT_REC_RECS;
  const recentTransactions = props.recentTransactions ?? DEFAULT_TRANSACTIONS;
  const totalEngagementViaAI = props.totalEngagementViaAI ?? DEFAULT_BAR;
  const lineChartData = props.lineChartData ?? DEFAULT_LINE;
  const topPerformingRetailLinks = props.topPerformingRetailLinks ?? DEFAULT_DOUGHNUT;



  return (
    <div className="mx-4 px-6 py-6 bg-gradient-to-br from-indigo-50 via-white to-violet-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Analytics Overview</h1>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg border border-gray-200 bg-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {topMetrics.map((metric, index) => (
          <div key={index} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm text-gray-500 truncate">{metric.label}</div>
                <div className="mt-2 text-3xl font-semibold text-gray-900">{metric.value}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Sparkline points={metric.points} colorClass={metric.colorClass} />
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
          <h3 className="text-lg font-semibold mb-4">Top performing sales links </h3>
          <div className="flex items-center justify-center">
            <DoughnutCard data={topPerformingRetailLinks} valueText={topPerformingRetailLinks.total} subText="Unique visitors" className="w-full" />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Total engagement via AI</h3>
          </div>
          <div style={{ height: "200px" }}>
            <MyBarChart data={totalEngagementViaAI} />
          </div>
        </div>
      </div>

      {/* Second Row 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Top Performing Products 
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Top performing products</h3>
          <div className="space-y-4">
            {topPerformingProducts.map((product, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">{product.name}</span>
                  <span className="text-sm font-semibold">{product.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{
                      width: `${product.progress}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Revenue vs Expenses</h3>
          <div style={{ height: "250px" }}>
            <MyLineChart data={lineChartData} />
          </div>
        </div>
      </div>

      {/* Bottom Row 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Recommendations 
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent recommendations</h3>
            <a href="#" className="text-blue-600 text-sm hover:underline">View all</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-gray-600 font-medium">Action</th>
                  <th className="text-left py-2 text-gray-600 font-medium">Impact</th>
                  <th className="text-left py-2 text-gray-600 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentRecommendations.map((rec) => (
                  <tr key={rec.id} className="border-b">
                    <td className="py-3">{rec.action}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        rec.impact === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                      }`}>
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

        {/* Region Data with Map 
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Visitors by country</h3>
          <div className="space-y-3">
            {regionData.map((region, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">{region.country}</span>
                  <span className="text-sm font-semibold">{region.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-indigo-500"
                    style={{ width: `${region.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions 
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <a href="#" className="text-blue-600 text-sm hover:underline">View all</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-gray-600 font-medium">Customer</th>
                <th className="text-left py-2 text-gray-600 font-medium">Amount</th>
                <th className="text-left py-2 text-gray-600 font-medium">Date</th>
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
      </div>*/}
    </div>
  );
}

export default Dashboard;
