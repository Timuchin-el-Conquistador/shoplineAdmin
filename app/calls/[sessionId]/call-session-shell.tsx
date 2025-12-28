"use client";

import Link from "next/link";
import { type ReactNode } from "react";

type Tab = "details" | "recording" | "voicemail";

type Props = {
  callId: string;
  activeTab: Tab;
  children: ReactNode;
  actions?: ReactNode;
};

function tabClass(isActive: boolean) {
  return [
    "inline-flex items-center justify-center",
    "rounded-full border",
    "px-4 py-1.5 text-sm font-medium",
    "transition-colors",
    isActive
      ? "border-blue-500 bg-white text-blue-600"
      : "border-gray-200 bg-white text-gray-500 hover:text-gray-700",
  ].join(" ");
}

export default function CallSessionShell(props: Props) {
  return (
    <div id="call-session" className="p-6">
      <div className="rounded-2xl bg-gray-50 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/calls/${props.callId}`}
            className={tabClass(props.activeTab === "details")}
          >
            Details
          </Link>
          <Link
            href={`/calls/${props.callId}/recording`}
            className={tabClass(props.activeTab === "recording")}
          >
            Recording
          </Link>
          <Link
            href={`/calls/${props.callId}/voicemail`}
            className={tabClass(props.activeTab === "voicemail")}
          >
            Voice mail
          </Link>
        </div>

        <div className="mt-6">{props.children}</div>

        {props.actions && (
          <div className="mt-6 flex justify-end gap-3">{props.actions}</div>
        )}
      </div>
    </div>
  );
}
