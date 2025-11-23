"use client";

import dynamic from "next/dynamic";

import { Fragment, useEffect, useMemo, useState } from "react";

import Table from "@/components/Tables/visitors";

import "@/styles/links.scss";

import KPI from "@/components/cards/KPI";
import { CardSkeletonPulse } from "@/components/Loaders/pulse";

import { type ExtendedLink } from "@/lib/types/links";

import DeletingLintWarning from "@/components/modals/link-remove-attempt-warning";

// Dynamically import the chart component to ensure client-side rendering
const MyBarChart = dynamic(() => import("@/components/charts/bar"), {
  ssr: false,
});

type PageProps = {
  retrieveUrlsAction: () => Promise<{
    status: number;
    urls: ExtendedLink[];
    message: string;
  }>;
  removeLinkAction: (
    slug: string
  ) => Promise<{ status: number; message: string }>;
  summary: {
    locations: number;
    staff: number;
    visitors: number;
    sessions: number;
  } | null;
  visitors: {
    _id: string;
    visitor: string;
    location: string;
    staff: string;
    status: string;
    date: string;
    link:string
  }[] | null;
  monthlyVisitors: number[][] | null;
  locations: string[] | null;
};

function Dashboard(props: PageProps) {
  const [links, setLinks] = useState<ExtendedLink[]>([]);
  const [loaded, setLoadedState] = useState(false);

  const [
    attemptingToDeleteLinkWarningModal,
    setAttemptingToDeleteLinkWarningModal,
  ] = useState({
    isOpen: false,
    slug: "",
  });

const [chartData, setChartData] = useState<any>({
  labels: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ],
  datasets: [],
});

useEffect(() => {
  if (!props.locations || !props.monthlyVisitors) return;

  const datasets = props.locations.map((value, index) => {
    // pick a different hue per location
    const hue = (index * 60) % 360; // change 60 to adjust color spacing
    const backgroundColor = `hsla(${hue}, 70%, 60%, 0.5)`;
    const borderColor = `hsl(${hue}, 70%, 50%)`;

    return {
      label: value,
      data: props.monthlyVisitors?.[index],
      backgroundColor,
      borderColor,
      borderWidth: 1,
    };
  });

  setChartData((prev:any) => ({
    ...prev,
    datasets,
  }))

}, [props.locations, props.monthlyVisitors]);



  useEffect(() => {
    const fetchLinks = async () => {
      const response = await props.retrieveUrlsAction();
      if (response.status == 400) {
        setLinks([]);
        return;
      }
      setLinks(response.urls);
      setLoadedState(true);
    };
    fetchLinks();
  }, [props.retrieveUrlsAction]);


  return (
    <div id="pages-grid" className="index-card-grid  ml-3">
      <div className="mb-3">
        {links.map((link) => (
          <Fragment key={link._id}>
            <KPI summary={props.summary}/>
          </Fragment>
        ))}
        {!loaded && <CardSkeletonPulse />}
      </div>
      <Table visitors={props.visitors}/>
      <br />
      <div style={{ width: "700px", height: "500px" }}>
        <MyBarChart data={chartData} />
      </div>

      <DeletingLintWarning
        attemptingToDeleteSession={attemptingToDeleteLinkWarningModal.isOpen}
        cancel={() => {
          setAttemptingToDeleteLinkWarningModal({
            isOpen: false,
            slug: "",
          });
        }}
        proceedDeletingSession={() => {
          const slug = attemptingToDeleteLinkWarningModal.slug;
          setAttemptingToDeleteLinkWarningModal({
            isOpen: false,
            slug: "",
          });
          props.removeLinkAction(slug);
          setLinks((prevState) => prevState.filter((el) => el.slug != slug));
        }}
      />
    </div>
  );
}

export default Dashboard;
