"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

import Link from "next/link";

import DeviceIntegrations from "@/components/cards/device-integration";
import ShopifyIntegrations from "@/components/cards/shopify-integration";

import "@/styles/dashboard.scss";

import { type Integration } from "@/lib/types/integration";

type PageProps = {
  integrations: Integration[];
};

function Integrations(props: PageProps) {
  return (
    <div id="pages-grid" className="index-card-grid">
      {props.integrations
        .filter((el) => el.category == "mobile")
        .map((integration) => (
          <Fragment key={integration._id}>
            <DeviceIntegrations integration={integration} />
          </Fragment>
        ))}
      {props.integrations
        .filter((el) => el.category == "store")
        .map((integration) => (
          <Fragment key={integration._id}>
            <ShopifyIntegrations integration={integration} />
          </Fragment>
        ))}
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
          <Link href="/integrations/new" className="block btn btn-blue mt-8">
            New Integration
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Integrations;
