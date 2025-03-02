"use client";

import dynamic from "next/dynamic";

import { socket } from "@/utils/socket";

import { type Caller } from "@/lib/types/call";
import { useMemo } from "react";

const SlButton = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/button/index.js"),
  {
    //loading: () => <>Loading...</>,
    ssr: false,
  }
);

const SlDrawer = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/drawer/index.js"),
  {
    // loading: () => <>Loading...</>,
    ssr: false,
  }
);

const SlIcon = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/icon/index.js"),
  {
    //  loading: () => <>Loading...</>,
    ssr: false,
  }
);
const SlRelativeTime = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/relative-time/index.js"),
  {
    //  loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

type ComponentProps = {
  isOpen: boolean;
  customerId: string;
  fullName: string;
  email: string;
  accountStatus: string;
  createdOn: string;
  lastLogin: string;
  subscription: {
    planName: string;
    subscriptionStatus: string;
  } | null;
  closeDrawer: () => void;
};

function Drawer(props: ComponentProps) {
  // Step 1: Remove the ordinal suffix (e.g., "nd")
  const lastLoginIsoDate = useMemo(() => {
    let cleanedDateString = props.lastLogin.replace(/(\d+)(st|nd|rd|th)/, "$1");

    // Step 2: Parse the date
    const date = new Date(cleanedDateString);

    // Step 3: Convert to ISO 8601 format
    return date.toISOString();
  }, [props.lastLogin]);

  const createdOnIsoDate = useMemo(() => {
    let cleanedDateString = props.createdOn.replace(/(\d+)(st|nd|rd|th)/, "$1");

    // Step 2: Parse the date
    const date = new Date(cleanedDateString);

    // Step 3: Convert to ISO 8601 format
    return date.toISOString();
  }, [props.createdOn]);
console.log(props)
  return (
    <SlDrawer
      noHeader
      placement="end"
      className="drawer-overview"
      open={props.isOpen}
      onSlAfterHide={props.closeDrawer}
    >
      <div>
        <div className="mt-4 text-gray-500 text-sm">Name</div>{" "}
        <div>{props.fullName}</div>{" "}
        <div className="mt-4">
          <div className="text-gray-500 text-sm">Email</div>{" "}
          <div>{props.email}</div>
        </div>{" "}
        <div className="mt-4">
          <div className="mt-4 text-gray-500 text-sm">Account Status</div>{" "}
          <div>
            {props.accountStatus} 
          </div>
        </div>{" "}
        <div className="mt-4">
          <div className="mt-4 text-gray-500 text-sm">Registered</div>{" "}
          <div>
            <SlRelativeTime date={createdOnIsoDate} />{" "}
          </div>
        </div>{" "}
        <div className="mt-4">
          <div className="mt-4 text-gray-500 text-sm">Last login</div>{" "}
          <div>
            <SlRelativeTime date={lastLoginIsoDate} />{" "}
          </div>
        </div>{" "}
        <hr className="my-4" />{" "}
        <div className="mt-4">
          <div className="mt-4 text-gray-500 text-sm">Billing Plan</div>{" "}
          <div>
           {props.subscription?.planName}
          </div>
        </div>{" "}
        <div className="mt-4">
          <div className="mt-4 text-gray-500 text-sm">Billing Status</div>{" "}
          <div>
          {props.subscription?.subscriptionStatus}
          </div>
        </div>{" "}
      </div>{" "}
      <div slot="footer" className="flex justify-between">
        <span>
          <SlButton
            variant="text"
            size="medium"
            data-optional=""
            data-valid=""
            onClick={() => {
              props.closeDrawer();
            }}
          >
            <SlIcon
              name="arrow-left"
              aria-hidden="true"
              library="default"
            ></SlIcon>{" "}
            Back
          </SlButton>
        </span>{" "}
      </div>
    </SlDrawer>
  );
}

export default Drawer;
