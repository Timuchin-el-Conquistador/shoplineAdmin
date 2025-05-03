import Voicemail from ".";

import Layout from "@/components/layouts/private";


import { retrieveVoicemail } from "@/lib/actions/call";

async function VoicemailPage(props: { params: { sessionId: string } }) {


  return (
    <Layout page="calls" sidebar={true} notifications={true}>
      <Voicemail
        callId={props.params.sessionId}
        retrieveVoicemail={retrieveVoicemail}
      />
    </Layout>
  );
}

export default VoicemailPage;