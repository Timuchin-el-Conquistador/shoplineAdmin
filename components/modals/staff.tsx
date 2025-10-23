"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Fragment } from "react";

const SlDialog = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/dialog/index.js"),
  {
    // loading: () => <>Loading...</>,
    ssr: false,
  }
);

const SlButton = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/button/index.js"),
  {
    // loading: () => <>Loading...</>,
    ssr: false,
  }
);

const SlCheckbox = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/checkbox/index.js"),
  {
    // loading: () => <>Loading...</>,
    ssr: false,
  }
);
type ComponentProps = {
  closeModal: () => void;
  check: (user: { name: string; _id: string }) => void;
  uncheck: (userId: string) => void;
  isOpen: boolean;
  staff: { name: string; _id: string }[];
  selected: { name: string; _id: string }[];
};
function StaffModal(props: ComponentProps) {
  return (
    <SlDialog
      label="Staff"
      className="dialog-overview with-header"
      open={props.isOpen}
      onSlAfterHide={props.closeModal}
    >
      <div className="bg-white rounded-md border border-gray-200">
        <div className="divide-y divide-gray-200 max-h-[40vh] overflow-scroll">
          <div className="flex flex-col pl-3 py-3 hover:bg-stone-100 text-sm h-16 cursor-pointer">
            {props.staff.map((user: { name: string; _id: string }) => (
              <Fragment key={user._id}>
                <SlCheckbox
                  size="small"
                  form=""
                  data-optional=""
                  data-valid=""
                  className="mx-2 small-checkbox"
                  checked={props.selected.some((su) => su._id === user._id)}
                  onSlChange={(event) => {
                    const checked = (event.target as HTMLInputElement).checked;
                    checked ? props.check(user) : props.uncheck(user._id);
                  }}
                >
                  <div className="flex flex-col w-full truncate ml-1">
                    <p className="text-gray-900 truncate font-medium">
                      {user.name}
                    </p>{" "}
                  </div>
                </SlCheckbox>{" "}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      <SlButton
        slot="footer"
        variant="primary"
        size="medium"
        data-optional=""
        data-valid=""
        onClick={() => props.closeModal()}
      >
        Save
      </SlButton>
    </SlDialog>
  );
}

export default StaffModal;
