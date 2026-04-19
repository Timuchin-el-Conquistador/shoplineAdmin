"use client";

import { useEffect, useState } from "react";

import dynamic from "next/dynamic";

import Table from "@/components/Tables/locations";
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
  deleteLocationAction: (loationId:string) => Promise<{
    status: string;
    message: string;
  }>
  retrieveLocationsAction: () => Promise<{
    status: string;
    message: string;
    locations: any[];
  }>;
};

function Locations(props: PageProps) {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoadingState] = useState(false);
  const [error, setError] = useState<null | string>();

  const handleDeleteLocation = async (locationId: string) => {
    const confirmed = window.confirm("Delete this location?");

    if (!confirmed) return;

    const response = await props.deleteLocationAction(locationId);

    if (response.status !== "OK") {
      setError(response.message);
      return;
    }

    setLocations((currentLocations) =>
      currentLocations.filter((location) => location._id !== locationId)
    );
  };

  useEffect(() => {
    const retrieveLoations = async () => {
      setLoadingState(true);
      const response = await props.retrieveLocationsAction();
      setLoadingState(false);
      if (response.status != "OK") {
        setLocations([]);
        return;
      }
      setLocations(response.locations);
    };
    retrieveLoations();
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
        href="/locations/new"
        className="block btn-create mt-8 mb-3"
      >
        Create New
      </Link>
      {locations.length > 0 && !loading && (
        <Table
          locations={locations}
          onDelete={handleDeleteLocation}
        />
      )}
      {locations.length == 0 && !loading && (
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
