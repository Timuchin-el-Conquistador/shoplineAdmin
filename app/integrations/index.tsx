"use client";

import dynamic from "next/dynamic";

import { Fragment, useEffect, useMemo, useState } from "react";

import Link from "next/link";

import DeviceIntegrations from "@/components/cards/device-integration";
import StoreIntegration from "@/components/cards/store-integration";
import { CardSkeletonPulse } from "@/components/Loaders/pulse";
//import ShopifyOnboarding from "@/components/onboarding";

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

function Integrations(props: PageProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setErrorMessage] = useState<string>("");
  const [success, setSuccessMesssage] = useState<string>("");

  const [onboardingPageState, setOnboardingPageState] = useState({
    visibility: false,
    integrationId: "",
  });

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

  const removeIntegration = async (integrationId: string) => {
    setLoading(true);
    const response = await props.removeIntegration(integrationId);

    setLoading(false);
    if (response.status !== 200) {
      setErrorMessage(response.message);

      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }
    setIntegrations((prevState) =>
      prevState.filter((el) => el._id != integrationId)
    );
    setSuccessMesssage(response.message);

    setTimeout(() => {
      setSuccessMesssage("");
    }, 2000);
  };

  const integrationIndex = useMemo(() => {
    return integrations.findIndex(
      (el) => el._id == onboardingPageState.integrationId
    );
  }, [onboardingPageState.integrationId]);

  return (
  /*  <>
      {integrations.length && onboardingPageState.visibility ? (
        <ShopifyOnboarding
          themes={[{ id: "down", name: "Down" }]}
          store={integrations[integrationIndex].name}
        />
      ) : (*/
        <div id="pages-grid" className="index-card-grid">
          <div
            style={{
              position: "fixed",
              right: "15px",
              top: "15px",
              display: success ? "block" : "hidden",
            }}
          >
            <SlAlert variant="success" open={!!success}>
              <SlIcon slot="icon" name="info-circle"></SlIcon>
              <div className="flex items-center">
                <strong>{success}</strong>
              </div>
            </SlAlert>
          </div>
          <div
            style={{
              position: "fixed",
              right: "15px",
              top: "15px",
              display: error ? "block" : "hidden",
            }}
          >
            <SlAlert variant="danger" open={!!error}>
              <SlIcon slot="icon" name="info-circle"></SlIcon>
              <div className="flex items-center">
                <strong>{error}</strong>
              </div>
            </SlAlert>
          </div>
          {integrations
            .filter((el) => el.category == "mobile")
            .map((integration) => (
              <Fragment key={integration._id}>
                <DeviceIntegrations integration={integration} />
              </Fragment>
            ))}
          {integrations
            .filter((el) => el.category == "store")
            .map((integration) => (
              <Fragment key={integration._id}>
                <StoreIntegration
                  integration={integration}
                  removeIntegration={removeIntegration}
                  setOnboardingState={(integrationId: string) =>
                    setOnboardingPageState((prevState) => ({
                      visibility: !prevState.visibility,
                      integrationId,
                    }))
                  }
                />
              </Fragment>
            ))}
          {loading && <CardSkeletonPulse />}
          <div
            className="index-card bordered"
            style={{
              overflow: "visible",
              position: "relative",
            }}
          >
            <div className="p-6">
              <h4 className="text-lg font-bold">New Integration </h4>{" "}
              <div className="mt-6">
                Click on the button below to create a new integration.
              </div>
              <Link
                href="/integrations/new"
                className="block btn btn-blue mt-8"
              >
                New Integration
              </Link>
            </div>
          </div>
        </div>
    /*  )}
    </>*/
  );
}

export default Integrations;
