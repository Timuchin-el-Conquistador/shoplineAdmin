import { createLocationAction } from "@/lib/actions/location";
import NewLocation from ".";

import Layout from "@/components/layouts/private";
import { Session } from "@/lib/types/user";
import { retrieveSession } from "@/lib/session";
import InternalServerError from "@/components/Presentational/500";
import { retrieveAccountInformation } from "@/lib/actions/user";
import { redirect } from "next/navigation";

async function CreateLoationPage() {
  
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
    <Layout page="locations" sidebar={true} notifications={true}>
      <NewLocation
        createLocationAction={createLocationAction}
        storeId={account.store._id}
      />
    </Layout>
  );
}

export default CreateLoationPage;
