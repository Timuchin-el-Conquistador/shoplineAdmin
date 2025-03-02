import { retrieveCustomerAccountInformationAction } from "@/lib/actions/user";

import Customers from ".";

import Layout from "@/components/layouts/private";

async function CustomersPage() {
  return (
    <Layout page="customers" sidebar={true} notifications={true}>
      <Customers retrieveCustomerAccountInformationAction={retrieveCustomerAccountInformationAction} />
    </Layout>
  );
}

export default CustomersPage;
