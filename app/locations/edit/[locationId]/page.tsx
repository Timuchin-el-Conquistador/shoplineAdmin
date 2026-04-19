import {
  updateLocationAction,
  retrieveLocation,
  retrieveOnlineStoresAction,
} from "@/lib/actions/location";
import EditLocation from ".";
import Layout from "@/components/layouts/private";
import InternalServerError from "@/components/Presentational/500";

async function EditLocationPage(props: { params: { locationId: string } }) {
    const reponse = await retrieveLocation(props.params.locationId);
  const storesResponse = await retrieveOnlineStoresAction();
  const location =
    reponse instanceof Error || reponse == null ? null : reponse;
  const stores =
    storesResponse.status !== "OK" || storesResponse == null
      ? []
      : storesResponse.stores;
  if (location == null) {
    return <InternalServerError />;
  };

  return (
    <Layout page="locations" sidebar={true} notifications={true}>
      <EditLocation
        updateLocationAction={updateLocationAction}
        location={location}
        stores={stores}
      />
    </Layout>
  );
}

export default EditLocationPage;
