"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";

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
  closeDrawer: () => void;
  submit:(id:string, password:string) => void
};

function Drawer(props: ComponentProps) {
  const accountID = useRef<HTMLInputElement | null>(null);
  const accountPassword = useRef<HTMLInputElement | null>(null);


  return (
    <SlDrawer
      noHeader
      placement="end"
      className="drawer-overview"
      open={props.isOpen}
      onSlAfterHide={props.closeDrawer}
    >
      <div className="p-6 bg-white">
        <div className="flex flex-col max-w-3xl w-full">
          <h2 className="font-semibold text-xl mb-12">Account</h2>{" "}
          <div className="md:flex w-full">
            <div className="md:w-1/2">
              <label className="font-medium text-md">ID</label>{" "}
            </div>{" "}
            <div className="md:w-1/2 relative">
              <div className="flex relative">
                <input
                  name="Slug"
                  placeholder="ID"
                  className="rounded-none rounded-e-md border border-gray-300 text-gray-700 focus:border-blue-300 focus:outline-none block w-full text-sm py-2 pl-3 pr-10 !truncate"
                  ref={accountID}
                />{" "}
              </div>
            </div>
          </div>{" "}
          <hr className="my-4" />{" "}
          <div className="md:flex w-full">
            <div className="md:w-1/2">
              <label className="font-medium text-md">Password</label>{" "}
            </div>{" "}
            <div className="md:w-1/2 relative">
              <div className="flex relative">
                <input
                  name="Slug"
                  placeholder="Password"
                  className="rounded-none rounded-e-md border border-gray-300 text-gray-700 focus:border-blue-300 focus:outline-none block w-full text-sm py-2 pl-3 pr-10 !truncate"
                  ref={accountPassword}
                />{" "}
              </div>
            </div>
          </div>{" "}
        </div>
      </div>
      <hr className="my-4" />{" "}
      <div>
        <SlButton
          size="medium"
          variant="success"
          data-optional=""
          data-valid=""
          className="mt-4 block animation-pulse"
          onClick={() => {
                          const id = accountID?.current?.value || "";
    const password = accountPassword?.current?.value || "";
            props.submit(id, password)
          }}
        >
          Create
        </SlButton>{" "}
        <SlButton
          size="medium"
          variant="warning"
          outline
          data-optional=""
          className="mt-4 block"
          data-valid=""
          data-user-valid=""
          onClick={props.closeDrawer}
        >
          <div>Cancel</div>
        </SlButton>
      </div>
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
