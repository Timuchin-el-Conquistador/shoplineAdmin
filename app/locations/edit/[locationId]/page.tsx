import { updateLocationAction, retrieveLocation } from "@/lib/actions/location";
import EditLocation from ".";
import Layout from "@/components/layouts/private";
import InternalServerError from "@/components/Presentational/500";

async function EditLocationPage(props: { params: { locationId: string } }) {
    const reponse = await retrieveLocation(props.params.locationId);
  const location =
    reponse instanceof Error || reponse == null ? null : reponse;
  if (location == null) {
    return <InternalServerError />;
  };

  return (
    <Layout page="locations" sidebar={true} notifications={true}>
      <EditLocation
        updateLocationAction={updateLocationAction}
        location={location} 
      />
    </Layout>
  );
}

export default EditLocationPage;
