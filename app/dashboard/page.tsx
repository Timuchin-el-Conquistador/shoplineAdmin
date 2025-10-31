import Dashboard from ".";

import { retrieveUrlsAction, removeLinkAction } from "@/lib/actions/link";

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

  const response = await retrieveKPI();
  const kpi = response instanceof Error || response == null ? {
    summary:null, visitors:null,monthlyVisitors:null,locations:null
  } : response;


 
  return (
    <Layout page="dashboard" sidebar={true} notifications={true}>
      <Dashboard
        removeLinkAction={removeLinkAction}
        retrieveUrlsAction={retrieveUrlsAction}
        summary={kpi.summary}
        visitors={kpi.visitors}
        monthlyVisitors={kpi.monthlyVisitors}
        locations={kpi.locations}
      />
    </Layout>
  );
}

export default DashboardPage;
