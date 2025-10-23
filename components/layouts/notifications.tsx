"use client";

import dynamic from "next/dynamic";

import { NoDevice } from "../Alerts/warning";



import { socket } from "@/utils/socket";

import { Fragment, useCallback, useEffect, useState } from "react";

import WebCallNotification from "../Notifications/call";


import { type Call } from "@/lib/types/call";
import { Settings } from "@/lib/types/links";

import { useSessionStore } from "@/providers/session";

import { useRouter } from "next/navigation";

import useLinkForm from "@/hooks/link-form";



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

function Notifications({
  hasActiveDevices,
  isNotificationsOn,
  user,
}: {
  isNotificationsOn: boolean;
  hasActiveDevices: boolean;
  user: string;
}) {
  const router = useRouter();

  // const [incommingCalls, setIncommingCalls] = useState<any[]>([]);

  const [
    isNoIntegratedDeviceAlertVisible,
    setNoIntegratedDeviceAlertVisibility,
  ] = useState(!hasActiveDevices);

  const {
    notifications,
    pushNotification,
    pullNotification,
    joinSession,
    declineSession,
    pushSession,
    endSession,
  } = useSessionStore((state) => state);

  //tutorial
  const [error, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccessMesssage] = useState<string>("");





  useEffect(() => {
    if (!isNotificationsOn) return;
    function call(data: { call: Call }) {
      pushNotification(data.call, router);
      pushSession(data.call, router);
      // pushSession(data.call, router);
    }
    socket.on("new-session", call);

    return () => {
      socket.off("new-session", call);
    };
  }, [socket]);

  //notification
  const answerCall = (slug: string, callId: string) => {
    socket.emit("answer", { callId, user });
    window.open(`/session/${slug}/${callId}`, "_blank");
    pullNotification(callId, router);
    joinSession(user,callId, router);
  };

  const declineCall = (callId: string) => {
    socket.emit("decline", { callId, user });
    pullNotification(callId, router);
    declineSession(user,callId, router);
  };

  const closeNoIntegratedDevicesAlert = useCallback(() => {
    setNoIntegratedDeviceAlertVisibility(false);
  }, [setNoIntegratedDeviceAlertVisibility]);

  useEffect(() => {
    function callEnded(data: { callId: string }) {
      endSession(data.callId, router);
    }
    socket.on("call-ended", callEnded);

    return () => {
      socket.off("call-ended", callEnded);
    };
  }, [socket]);

  if (isNotificationsOn) {
    return (
      <>
        <div
          style={{
            position: "fixed",
            right: "15px",
            top: "15px",
            display: success ? "block" : "hidden",
            zIndex: 100,
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
            zIndex: 100,
          }}
        >
          <SlAlert variant="danger" open={!!error}>
            <SlIcon slot="icon" name="info-circle"></SlIcon>
            <div className="flex items-center">
              <strong>{error}</strong>
            </div>
          </SlAlert>
        </div>
     
        <div className="fixed top-2 right-2 z-[9999] space-y-2">
          {notifications.map((call) => (
            <Fragment key={call._id}>
              <WebCallNotification
                email={call.callerInfo.email}
                fullName={call.callerInfo.fullName!}
                phone={call.callerInfo.phone}
                callId={call._id}
                slug={call.slug}
                answer={answerCall}
                decline={declineCall}
              />
            </Fragment>
          ))}
        </div>

   


      </>
    );
  } else {
    return <></>;
  }
}

export default Notifications;
