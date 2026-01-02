import Image from "next/image";

import dynamic from "next/dynamic";

import { useState } from "react";

import { type Integration as IIntegration } from "@/lib/types//integration";

import Agents from "../modals/agents";
import Link from "next/link";

import { selectAgentAvatarAction } from "@/lib/actions/user";

const SlRelativeTime = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/relative-time/index.js"),
  {
    //  loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

const SlTooltip = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/tooltip/index.js"),
  {
    loading: () => <>Loading...</>,
    ssr: false,
  }
);

type ComponentProps = {
  removeIntegration: (integrationId: string) => void;
  integration: IIntegration;
};

function Integration(props: ComponentProps) {
  const [isAgentsModalVisible, setAgentsModalVisibility] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean>(
    props.integration?.connected ?? false
  );

  // Step 1: Remove the ordinal suffix (e.g., "nd")

  const cleanedDateString = props.integration.createdOn.replace(
    /(\d+)(st|nd|rd|th)/,
    "$1"
  );

  // Step 2: Parse the date
  const date = new Date(cleanedDateString);

  // Step 3: Convert to ISO 8601 format
  const isoDate = date.toISOString();
  //const isoDate= moment(call.callStartedTime).toISOString();
  return (
    <>
      <div className="index-card item-overflow-visible relative">
        <div className="flex justify-between items-start">
        <Image
          src="/shopify.jpg"
          width={100}
          height={100}
          alt="shopify integration"
          className="mt-1 h-full w-full object-cover"
          style={{width:'50px', height: '50px'}}
        />{" "}
        </div>
        <div className="flex items-center col-span-3"></div>{" "}
        <div className="flex justify-between items-start">
          <div className="mt-6">
            <div className="text-sm text-gray-400">Status</div>{" "}
            <div className="text-sm">{props.integration.status}</div>
          </div>{" "}
          <div className="mt-6">
            <div className="text-sm text-gray-400">Created</div>{" "}
            <div className="text-sm">
              <SlTooltip
                content="Jan 24, 2025 @ 11:31pm"
                placement="bottom"
                className="text-sm"
              >
                <div className="cursor-pointer w-fit">
                  <SlRelativeTime date={isoDate} />
                </div>
              </SlTooltip>
            </div>
          </div>
          <div className="mt-6">
            <div className="text-sm text-gray-400">Store</div>{" "}
            <div className="text-sm">{props.integration.name}</div>
          </div>{" "}
        </div>{" "}
        <div className="index-card-footer integration-footer">
          <div className="connect-left">
            <button className="connect-pill" onClick={() => setIsConnected((s) => !s)}>
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ display: "inline-block" }}
              >
                <use xlinkHref="/feather-sprite.svg#link" />
              </svg>
              <div className="inline-block">{isConnected ? "Connected" : "Connect"}</div>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="toggle">
              <input
                type="checkbox"
                checked={isConnected}
                onChange={(e) => setIsConnected(e.target.checked)}
              />
              <span className="track" />
              <span className="knob" />
            </label>
          </div>
        </div>
      </div>
      <Agents
        isOpen={isAgentsModalVisible}
        closeModal={() => setAgentsModalVisibility(false)}
        useAvatar={(presenterId, driverId, voice) => {
          setAgentsModalVisibility(false)
          selectAgentAvatarAction(
            props.integration._id,
            presenterId,
            driverId,
            voice
          );
        }}
      />
    </>
  );
}

export default Integration;
