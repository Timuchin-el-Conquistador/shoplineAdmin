import { retrieveUserAccountStatus } from "@/lib/actions/visitor";
import AccountInactive from "../Presentational/account-inactive";

import ErrorBoundary from "../error-bound";

async function PublicLayout({
  children,
  email,
}: {
  children: React.ReactNode;
  email?: string ;
}) {
  if (email) {
    let response = await retrieveUserAccountStatus(email);

    const accountStatus =
      response instanceof Error || response == null ? null : response;

    if (accountStatus != "active") {
      return <AccountInactive />;
    }
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
}

export default PublicLayout;
