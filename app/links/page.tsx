
import dynamic from "next/dynamic";

import { retrieveUrlsAction, removeLinkAction } from "@/lib/actions/link";

import { retrieveSession } from "@/lib/session";


import { type Session } from "@/lib/types/user";

import InternalServerError from "@/components/Presentational/500";
import Layout from "@/components/layouts/private";

const Links = dynamic(() => import('.'));

async function LinksPage() {
  const session = await retrieveSession() as Session;

  if (session == null) {
    return <InternalServerError/>
  }
  return (
    <Layout page="links" sidebar={true} notifications={true} pageTitle="Call Support">
      <Links
        removeLinkAction={removeLinkAction}
        retrieveUrlsAction={retrieveUrlsAction}
      />
    </Layout>
  );
}

export default LinksPage;
