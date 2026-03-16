import Dashboard from ".";
import { retrieveKPI } from "@/lib/actions/location";
import { retrieveSession } from "@/lib/session";
import { type Session } from "@/lib/types/user";
import InternalServerError from "@/components/Presentational/500";
import Layout from "@/components/layouts/private";

async function DashboardPage() {
  const session = (await retrieveSession()) as Session;

  if (session == null) {
    return <InternalServerError />;
  }

  const response: any = await retrieveKPI();
  const kpi: any = response instanceof Error || response == null ? {
    summary: null,
    retailsSessions: null,
    monthlyVisitors: null,
    locations: null,
    cartCheckoutAnalytics: null,
  } : response;
  
  return (
    <Layout page="dashboard" sidebar={true} notifications={true}>
      <Dashboard
        summary={kpi.summary}
        retailsSessions={kpi.retailsSessions}
        monthlyVisitors={kpi.monthlyVisitors}
        locations={kpi.locations}
        topMetrics={kpi.topMetrics}
        topPerformingProducts={kpi.recommendedProducts}
        topPerformingRetailLinks={kpi.topPerformingRetailLinks}
        aiInteractions={kpi.aiInteractions}
        regionData={kpi.regionData}
        countryCount={kpi.countryCount}
        recentRecommendations={kpi.recentRecommendations}
        recentTransactions={kpi.recentTransactions}
        totalEngagementViaAI={kpi.totalEngagementViaAI}
        barChartData={kpi.barChartData}
        lineChartData={kpi.lineChartData}
        doughnutData={kpi.doughnutData}
        weeklyEngagement={kpi.weeklyEngagement}
        monthlyEngagement={kpi.monthlyEngagement}
        cartCheckoutAnalytics={kpi.cartCheckoutAnalytics}
      />
    </Layout>
  );
}

export default DashboardPage;
