import { retrieveUsersAction } from "@/lib/actions/staff";
import Loations from ".";

import Layout from "@/components/layouts/private";
import { retrieveSession } from "@/lib/session";
import { retrieveAccountInformation } from "@/lib/actions/user";
import InternalServerError from "@/components/Presentational/500";
import { Session } from "@/lib/types/user";
import { redirect } from "next/navigation";

async function CustomersPage() {
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
      <Loations
        retrieveUsersAction={retrieveUsersAction}
      />
    </Layout>
  );
}

export default CustomersPage;
