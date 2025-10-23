import NewRetailUser from ".";

import Layout from "@/components/layouts/private";
import InternalServerError from "@/components/Presentational/500";

import { retrieveLocationsAction } from "@/lib/actions/location";
import { createUserAction } from "@/lib/actions/staff";
import { retrieveAccountInformation } from "@/lib/actions/user";
import { retrieveSession } from "@/lib/session";
import { Session } from "@/lib/types/user";
import { redirect } from "next/navigation";

async function StaffPage() {
  const session = (await retrieveSession()) as Session;

  if (session == null) {
    return <InternalServerError />;
  }

  const response = await retrieveAccountInformation();
  const account =
    response instanceof Error || response == null ? null : response;

  if (account == null) {
    return <InternalServerError />;
  }

  if (account.store == null) {
    redirect("/integrations/new/shopify");
  }
  return (
    <Layout page="staff" sidebar={true} notifications={true}>
      <NewRetailUser
        createUserAction={createUserAction}
        retrieveStaffAction={retrieveLocationsAction}
      />
    </Layout>
  );
}

export default StaffPage;
