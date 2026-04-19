import {
  createLocationAction,
  retrieveOnlineStoresAction,
} from "@/lib/actions/location";
import NewLocation from ".";

import Layout from "@/components/layouts/private";
import { Session } from "@/lib/types/user";
import { retrieveSession } from "@/lib/session";
import InternalServerError from "@/components/Presentational/500";
import { redirect } from "next/navigation";

async function CreateLoationPage() {
  
    const session = (await retrieveSession()) as Session;

  if (session == null) {
    return <InternalServerError />;
  }

  const storesResponse = await retrieveOnlineStoresAction();
  const stores =
    storesResponse.status !== "OK" || storesResponse == null
      ? []
      : storesResponse.stores;

  if (stores.length === 0) {
    redirect("/integrations/new/shopify");
  }

  return (
    <Layout page="locations" sidebar={true} notifications={true}>
      <NewLocation
        createLocationAction={createLocationAction}
        stores={stores}
      />
    </Layout>
  );
}

export default CreateLoationPage;
