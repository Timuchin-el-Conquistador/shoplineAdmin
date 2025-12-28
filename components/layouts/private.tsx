import NotificationsLayout from "./notifications";
import PageHeader from "./page-header";

import {
  hasDeviceIntegrations,
  retrieveAccountInformation,
} from "@/lib/actions/user";
import { retrieveSession } from "@/lib/session";
import {type  Session } from "@/lib/types/user";

import Sidebar from "../sidebar";

import ErrorBoundary from "../error-bound";

import InternalServerError from "../Presentational/500";



async function PrivateLayout({
  children,
  page,
  sidebar,
  notifications,
  pageTitle,
  pageSubtitle,
}: {
  children: React.ReactNode;
  page: string;
  sidebar: boolean;
  notifications: boolean;
  pageTitle?: string;
  pageSubtitle?: string;
}) {
  const session = await retrieveSession() as Session;
  if (session == null) return <InternalServerError />;


  const devicesResponse = await hasDeviceIntegrations();
  const hasActiveDevices =
    devicesResponse instanceof Error || devicesResponse == null
      ? false
      : devicesResponse;

  let response = await retrieveAccountInformation();

  const account =
    response instanceof Error || response == null ? null : response;

  if (account == null) return <InternalServerError />;

  // Get page title from page prop if not provided
  const getPageTitle = () => {
    if (pageTitle) return pageTitle;
    return page.charAt(0).toUpperCase() + page.slice(1);
  };



  return (
    <div className="flex overflow-hidden bg-gray-100 h-screen">
      {sidebar && (
        <Sidebar
          page={page}
          fullName={session.fullName as string}
          email={session.email as string}
        />
      )}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-100">
          <PageHeader
            title={getPageTitle()}
            subtitle={pageSubtitle}
            notificationCount={0}
            userName={session.fullName as string}
          />
          <NotificationsLayout
            hasActiveDevices={hasActiveDevices}
            isNotificationsOn={notifications}
            user={session.fullName}
          />
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default PrivateLayout;
