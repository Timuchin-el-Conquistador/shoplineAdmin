"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import { type Integration } from "@/lib/types/integration";

const SlButton = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/button/index.js"),
  {
    ssr: false,
  }
);

const SlDrawer = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/drawer/index.js"),
  {
    ssr: false,
  }
);

const SlIcon = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/icon/index.js"),
  {
    ssr: false,
  }
);

const SlRelativeTime = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/relative-time/index.js"),
  {
    ssr: false,
  }
);

type Props = {
  isOpen: boolean;
  integration: Integration | null;
  closeDrawer: () => void;
};

function toIsoDate(value?: string): string | null {
  if (!value) return null;
  const cleaned = value.replace(/(\d+)(st|nd|rd|th)/, "$1");
  const date = new Date(cleaned);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export default function IntegrationDrawer(props: Props) {
  const createdOnIsoDate = useMemo(
    () => toIsoDate(props.integration?.createdOn),
    [props.integration?.createdOn]
  );

  const integratedOnIsoDate = useMemo(
    () => toIsoDate(props.integration?.integratedOn),
    [props.integration?.integratedOn]
  );

  return (
    <SlDrawer
      noHeader
      placement="end"
      className="drawer-overview"
      open={props.isOpen}
      onSlAfterHide={props.closeDrawer}
    >
      <div>
        <div className="mt-4 text-gray-500 text-sm">Integration</div>
        <div>{props.integration?.name ?? ""}</div>

        <div className="mt-4">
          <div className="text-gray-500 text-sm">Status</div>
          <div>{props.integration?.status ?? ""}</div>
        </div>

        <div className="mt-4">
          <div className="text-gray-500 text-sm">Connected</div>
          <div>{props.integration?.connected ? "Yes" : "No"}</div>
        </div>

        <div className="mt-4">
          <div className="text-gray-500 text-sm">Type</div>
          <div>{props.integration?.integrationType ?? ""}</div>
        </div>

        <div className="mt-4">
          <div className="text-gray-500 text-sm">Store domain</div>
          <div>{props.integration?.store?.storeDomain ?? ""}</div>
        </div>

        <div className="mt-4">
          <div className="text-gray-500 text-sm">Created</div>
          <div>
            {createdOnIsoDate ? <SlRelativeTime date={createdOnIsoDate} /> : ""}
          </div>
        </div>

        <div className="mt-4">
          <div className="text-gray-500 text-sm">Integrated</div>
          <div>
            {integratedOnIsoDate ? (
              <SlRelativeTime date={integratedOnIsoDate} />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      <div slot="footer" className="flex justify-between">
        <span>
          <SlButton
            variant="text"
            size="medium"
            data-optional=""
            data-valid=""
            onClick={props.closeDrawer}
          >
            <SlIcon name="arrow-left" aria-hidden="true" library="default" />
            Back
          </SlButton>
        </span>
      </div>
    </SlDrawer>
  );
}
