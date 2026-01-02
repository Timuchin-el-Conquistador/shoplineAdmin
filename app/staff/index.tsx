"use client";

import { useEffect, useState } from "react";

import dynamic from "next/dynamic";

import Table from "@/components/Tables/staff";
import { TableSkeletonPulse } from "@/components/Loaders/pulse";

import "@/styles/calls/index.scss";
import Link from "next/link";

const SlAlert = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/alert/index.js"),
  {
    //  loading: () => <>Loading...</>,
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
type PageProps = {
  retrieveUsersAction: (
  ) => Promise<{ status: string; message: string; staff: any[] }>;
};

function Locations(props: PageProps) {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoadingState] = useState(false);
  const [error, setError] = useState<null | string>();

  useEffect(() => {
    const retrieveUsers = async () => {
      setLoadingState(true);
      const response = await props.retrieveUsersAction();
      setLoadingState(false);
      if (response.status != "OK") {
        setStaff([]);
        return;
      }
      setStaff(response.staff);
    };

    retrieveUsers();
  }, []);

  return (
    <div id="main" className="mt-0 sm:mt-0 relative p-6">
      <div
        style={{
          position: "fixed",
          right: "15px",
          top: "15px",
          display: error ? "block" : "hidden",
        }}
      >
        <SlAlert variant="danger" open={error != null}>
          <SlIcon slot="icon" name="exclamation-octagon"></SlIcon>
          <strong>{error}</strong>
        </SlAlert>
      </div>
      <Link
        href="/staff/new"
        className="block btn-create mt-8 mb-3"
      >
        Create New
      </Link>
      {staff.length > 0 && !loading && (
        <Table
          staff={staff}
        />
      )}
      {staff.length == 0 && !loading && (
        <div className="dotted-container sm:h-80 mt-4 py-12 px-6">
          <div className="text-gray-400">
            <svg
              width="45"
              height="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              id=""
              style={{ display: "inline-block" }}
            >
              <use xlinkHref="/feather-sprite.svg#coffee"></use>
            </svg>{" "}
            <h2 className="text-l mt-4 sm:mt-6 text-gray-400">Nothing Found</h2>{" "}
            <h3 className="text-sm mt-2 text-gray-400">
              Clear search field or page filter
            </h3>
          </div>
        </div>
      )}
      {loading && <TableSkeletonPulse />}
    </div>
  );
}

export default Locations;
