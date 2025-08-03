"use client";

import dynamic from "next/dynamic";

import { Fragment, useEffect, useMemo, useState } from "react";

import ShopifyOnboarding from "@/components/onboarding";

import "@/styles/dashboard.scss";

import { type Integration } from "@/lib/types/integration";

const SlIcon = dynamic(
  // Notice how we use the full path to the component. If you only do `import("@shoelace-style/shoelace/dist/react")` you will load the entire component library and not get tree shaking.
  () => import("@shoelace-style/shoelace/dist/react/icon/index.js"),
  {
    //   loading: () => <p>Loading...</p>,
    ssr: false,
  }
);
const SlAlert = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/alert/index.js"),
  {
    //  loading: () => <>Loading...</>,
    ssr: false,
  }
);

type PageProps = {
  retrieveIntegrationsActions: () => Promise<{
    status: number;
    integrations: Integration[];
    message: string;
  }>;
  removeIntegration: (
    integrationId: string
  ) => Promise<{ status: number; message: string }>;
};

function Onboarding(props: PageProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setErrorMessage] = useState<string>("");
  const [success, setSuccessMesssage] = useState<string>("");


  useEffect(() => {
    const fetchLinks = async () => {
      setLoading(true);
      const response = await props.retrieveIntegrationsActions();
      if (response.status !== 200) {
        setIntegrations([]);
        return;
      }
      setIntegrations(response.integrations);
      setLoading(false);
    };
    fetchLinks();
  }, [props.retrieveIntegrationsActions]);





  return (
    <>
   {integrations.length ? <ShopifyOnboarding
      themes={[{ id: "down", name: "Down" }]}
      store={integrations[0].name}
    /> : <p></p>}
    </>
  );
}

export default Onboarding;
