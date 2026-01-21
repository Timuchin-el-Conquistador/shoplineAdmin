import "@/styles/ai-help.scss";

import Layout from "@/components/layouts/private";
import InternalServerError from "@/components/Presentational/500";
import { retrieveSession } from "@/lib/session";
import { type Session } from "@/lib/types/user";
import AiHelpClient from "./ai-help-client";
import { messageAi } from "@/lib/actions/ai-help";

const topicChips = [
  "About Shoporia",
  "Teams / Staff",
  "Links",
  "Stores and products",
  "Integrations",
];
// const topicCards = [
//   {
//     title: "Links & QR flows",
//     description:
//       "Fuga ut blanditiis et reprehenderit omnis architecto. Nemo quod adipisci. Vellit aut nemo et possimus at sit.",
//   },
//   {
//     title: "eCommerce & Avatar",
//     description:
//       "Fuga ut blanditiis et reprehenderit omnis architecto. Nemo quod adipisci. Vellit aut nemo et possimus at sit.",
//   },
//   {
//     title: "Reports & CRM",
//     description:
//       "Fuga ut blanditiis et reprehenderit omnis architecto. Nemo quod adipisci. Vellit aut nemo et possimus at sit.",
//   },
//   {
//     title: "Call & support",
//     description:
//       "Fuga ut blanditiis et reprehenderit omnis architecto. Nemo quod adipisci. Vellit aut nemo et possimus at sit.",
//   },
// ];

export default async function AiHelpPage() {
  const session = (await retrieveSession()) as Session;

  if (session == null) {
    return <InternalServerError />;
  }

  const firstName = session.fullName?.split(" ")[0] || "there";



  return (
    <Layout page="ai-help" sidebar={true} notifications={true} pageTitle="AI help center">
      <AiHelpClient firstName={firstName} topics={topicChips} messageAi={messageAi} />
    </Layout>
  );
}
