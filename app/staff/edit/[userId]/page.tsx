import EditRetailUser from ".";

import Layout from "@/components/layouts/private";
import InternalServerError from "@/components/Presentational/500";

import { retrieveLocationsAction } from "@/lib/actions/location";
import { updateUserAction, retrieveUser } from "@/lib/actions/staff";

async function EditRetailUserPage(props: { params: { userId: string } }) {
  const reponse = await retrieveUser(props.params.userId);
  const user = reponse instanceof Error || reponse == null ? null : reponse;
  if (user == null) {
    return <InternalServerError />;
  }

  return (
    <Layout page="staff" sidebar={true} notifications={true}>
      <EditRetailUser
        updateUserAction={updateUserAction}
        retrieveLocationsAction={retrieveLocationsAction}
        user={user}
      />
    </Layout>
  );
}

export default EditRetailUserPage;
