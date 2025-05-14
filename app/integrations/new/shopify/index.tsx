"use client";

import dynamic from "next/dynamic";

import "@/styles/integrations/mobile.scss";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { socket } from "@/utils/socket";
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

  const [error, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccessMesssage] = useState<string>("");

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
    if (response.message == "authentification") {
 
      window.open(
        response.authUrl!,
        //"https://b6a9-37-61-113-83.ngrok-free.app/auth",
        "popupWindow",
        "width=600,height=400,scrollbars=no,resizable=no"
      );

      window.addEventListener("message", (event) => {
        // 🔐 Optional: Validate the origin
        // if (event.origin !== 'https://your-app.com') return;
        if(event.origin !== `https://${process.env.NEXT_PUBLIC_FRONTEND_URL}`) return

        const {  shop } = event.data;

        if ( shop) {
          socket.emit("shopify-token-validation", { shop });
        } else {
          setErrorMessage('Something went wrong');
          setTimeout(() => {
            setErrorMessage("");
          }, 2000);
        }
      });

      return;
    }

    setSuccessMesssage(response.message);
    setTimeout(() => {
      router.push("/integrations");
    }, 2000);
  };

  useEffect(() => {
    const processShopifyStoreTokenValidationResult = (data: {
      valid: boolean;
      storeDomain?:string
    }) => {
      if (data.valid) {
        setSuccessMesssage("Store authentification is succeseful");
        createIntegration(data.storeDomain!)
        setTimeout(() => {
          router.push("/integrations");
        }, 2000);
      } else {
        setErrorMessage("oauth failed");
      }
      setLoading(false);
    };
    socket.on(
      "shopify-token-validation-result",
      processShopifyStoreTokenValidationResult
    );

    return () => {
      socket.off(
        "shopify-token-validation-result",
        processShopifyStoreTokenValidationResult
      );
    };
  }, [socket]);

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
