"use client";

import dynamic from "next/dynamic";

import { Caller } from "@/lib/types/call";

import CallSessionShell from "./call-session-shell";

import DeletingExpiredSessionWarning from "@/components/modals/expired-session-remove-attempt-warning";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useSessionStore } from "@/providers/session";

const SlRelativeTime = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/relative-time/index.js"),
  {
    //  loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

type PageProps = {
  caller: Caller;
  linkName: string;
  callId: string;
  callStartedTime: string;
  callAnsweredTime: string;
  callEndedTime: string;
  duration: number;
  callStatus: string;
  answeredBy: string;
  declinedBy: string;

};

function Details(props: PageProps) {
  const router = useRouter();

  const [attemptingToDeleteSession, setAttemptingToDeleteSessionModalState] =
    useState(false);

  const { removeInactiveCall } = useSessionStore((state) => state);

  const toIso = (value: string) => {
    if (!value) return null;
    const cleaned = value.replace(/(\d+)(st|nd|rd|th)/, "$1");
    const date = new Date(cleaned);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString();
  };

  const startedIso = toIso(props.callStartedTime);
  const endedIso = toIso(props.callEndedTime);
  const answeredIso = toIso(props.callAnsweredTime);

  const statusBadge = () => {
    if (props.callStatus === "ended") {
      return "bg-green-50 text-green-700";
    }
    if (props.callStatus === "declined" || props.callStatus === "missed") {
      return "bg-red-50 text-red-700";
    }
    if (props.callStatus === "waiting" || props.callStatus === "live") {
      return "bg-yellow-50 text-yellow-800";
    }
    return "bg-gray-100 text-gray-700";
  };

  const statusLabel = () => {
    if (props.callStatus === "ended") return "Completed";
    if (props.callStatus === "declined") return "Declined";
    if (props.callStatus === "missed") return "Missed";
    return props.callStatus;
  };

  const deleteSession = async (callId: string) => {
    removeInactiveCall(callId, router);
  };

  return (
    <CallSessionShell
      callId={props.callId}
      activeTab="details"
      actions={
        <>
          <button
            type="button"
            className="inline-flex items-center rounded-lg border border-blue-500 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
            onClick={() => {
              const payload = {
                callId: props.callId,
                linkName: props.linkName,
                callStatus: props.callStatus,
                durationMinutes: props.duration,
                times: {
                  started: props.callStartedTime,
                  answered: props.callAnsweredTime,
                  ended: props.callEndedTime,
                },
                caller: props.caller,
                answeredBy: props.answeredBy,
                declinedBy: props.declinedBy,
              };
              const blob = new Blob([JSON.stringify(payload, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const anchor = document.createElement("a");
              anchor.href = url;
              anchor.download = `call-${props.callId}.json`;
              anchor.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export call
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
            onClick={() => {
              setAttemptingToDeleteSessionModalState(true);
            }}
          >
            Delete details
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-900">Visitor detail</h3>

          <div className="mt-4 flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
              {(props.caller.fullName || "?").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="truncate text-base font-semibold text-gray-900">
                  {props.caller.fullName}
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge()}`}
                >
                  {statusLabel()}
                </span>
              </div>
              {props.caller.email && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {props.caller.email}
                </div>
              )}
              {props.caller.phone && (
                <div className="mt-1 text-sm text-gray-600">
                  <span className="font-medium">Phone:</span> {props.caller.phone}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-gray-100 pt-4 text-sm text-gray-600">
            <div className="flex items-start justify-between gap-3">
              <div className="font-medium text-gray-700">Locations:</div>
              <div className="text-right">{props.caller.country || "—"}</div>
            </div>
            <div className="mt-2 flex items-start justify-between gap-3">
              <div className="font-medium text-gray-700">Identifiers:</div>
              <div className="text-right break-all">{props.callId}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-gray-900">Call summary</h3>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              Inbound • voice
            </span>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="font-medium text-gray-700">Date</div>
              <div className="text-right text-gray-600">
                {startedIso ? <SlRelativeTime date={startedIso} /> : props.callStartedTime}
              </div>
            </div>
            <div className="flex items-start justify-between gap-3">
              <div className="font-medium text-gray-700">Duration</div>
              <div className="text-right text-gray-600">{props.duration} minutes</div>
            </div>
            <div className="flex items-start justify-between gap-3">
              <div className="font-medium text-gray-700">
                {props.callStatus === "declined" ? "Declined by" : "Answered by"}
              </div>
              <div className="text-right text-gray-600">
                {props.callStatus === "declined"
                  ? props.declinedBy || "—"
                  : props.answeredBy || "—"}
              </div>
            </div>
            <div className="flex items-start justify-between gap-3">
              <div className="font-medium text-gray-700">Call ID</div>
              <div className="text-right text-gray-600 break-all">{props.callId}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-900">Call events</h3>

          <ol className="relative mt-4 border-s border-gray-200">
            <li className="ms-4 pb-4">
              <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200"></div>
              <div className="text-xs text-gray-500">
                {props.callStartedTime}
                {startedIso ? <span className="ml-2">(<SlRelativeTime date={startedIso} />)</span> : null}
              </div>
              <div className="text-sm font-medium text-gray-900">Call started</div>
            </li>

            {props.callStatus === "ended" && props.callAnsweredTime && (
              <li className="ms-4 pb-4">
                <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200"></div>
                <div className="text-xs text-gray-500">
                  {props.callAnsweredTime}
                  {answeredIso ? <span className="ml-2">(<SlRelativeTime date={answeredIso} />)</span> : null}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  Answered by {props.answeredBy || "—"}
                </div>
              </li>
            )}

            {props.callStatus === "declined" && (
              <li className="ms-4 pb-4">
                <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200"></div>
                <div className="text-xs text-gray-500">{props.callEndedTime}</div>
                <div className="text-sm font-medium text-gray-900">
                  Declined by {props.declinedBy || "—"}
                </div>
              </li>
            )}

            {props.callEndedTime && (
              <li className="ms-4">
                <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200"></div>
                <div className="text-xs text-gray-500">
                  {props.callEndedTime}
                  {endedIso ? <span className="ml-2">(<SlRelativeTime date={endedIso} />)</span> : null}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {props.callStatus === "declined" ? "Finished" : "Call ended"}
                </div>
              </li>
            )}
          </ol>
        </div>
      </div>

      <DeletingExpiredSessionWarning
        attemptingToDeleteSession={attemptingToDeleteSession}
        cancel={() => {
          setAttemptingToDeleteSessionModalState(false);
        }}
        proceedDeletingSession={() => {
          setAttemptingToDeleteSessionModalState(false);
          deleteSession(props.callId);
        }}
      />
    </CallSessionShell>
  );
}

export default Details;
