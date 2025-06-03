"use client";

import dynamic from "next/dynamic";

import "@/styles/integrations/mobile.scss";

import { useRouter } from "next/navigation";
import { useState } from "react";

import Integration from "@/components/Form/create/shopify";

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
  createShopifyIntegrationAction: (
    storeDomain: string
  ) => Promise<{ status: number; message: string; authUrl?: string }>;
};

function ShopifyStoreIntegrationPage(props: PageProps) {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setErrorMessage] = useState<string>("");
  const [success, setSuccessMesssage] = useState<string>("");
  const [isAuthRequired, setAuthRequiredState] = useState<boolean>(false);

  const createIntegration = async (storeDomain: string) => {

    setLoading(true);
    const response = await props.createShopifyIntegrationAction(storeDomain);

    if (response.status === 400) {
      setLoading(false);
      setErrorMessage(response.message);

      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }
    setLoading(false);
    if (response.message == "authentification-required") {
      setAuthRequiredState(true);

      setTimeout(() => {
       setAuthRequiredState(false)
      }, 10 * 1000);

      window.open(
        response.authUrl!,
        "popupWindow",
        "width=600,height=400,scrollbars=no,resizable=no"
      );

      return;
    }

    setSuccessMesssage(response.message);
    setTimeout(() => {
      router.push("/integrations");
    }, 2000);
  };




  return (
    <div id="main" className="p-6 mb-20">
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
          display: isAuthRequired ? "block" : "none",
        }}
      >
        <SlAlert variant="success" open={isAuthRequired}>
          <SlIcon slot="icon" name="info-circle"></SlIcon>
          <div className="flex items-center">
            <strong>
              Authentication Required!
              <br />
              Please install and authenticate the app before continuing.
              <br />
              After completing the authentication, return to the main window to
              proceed with integration.
            </strong>
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
      <Integration loading={loading} createIntegration={createIntegration} />
    </div>
  );
}

export default ShopifyStoreIntegrationPage;
