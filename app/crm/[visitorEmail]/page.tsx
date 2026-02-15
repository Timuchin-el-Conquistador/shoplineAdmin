import PrivateLayout from "@/components/layouts/private";
import {
  retrieveCrmOfflineSessions,
  retrieveCrmVisitor,
} from "@/lib/actions/crm";
import InteractionTabs from "./interaction-tabs";
import React from "react";

// InitialsAvatar component: displays initials from first and last name
function InitialsAvatar({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const getInitials = (first: string, last: string) => {
    const firstInitial = first?.trim().split(" ")[0][0]?.toUpperCase() || "";
    const lastInitial = last?.trim().split(" ")[0][0]?.toUpperCase() || "";
    return firstInitial + lastInitial;
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        background: "#e0e4ea",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 26,
        fontWeight: 600,
        color: "#222",
        border: "2px solid #fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        margin: "0 auto",
      }}
    >
      {getInitials(firstName, lastName)}
    </div>
  );
}

type PageProps = {
  params: { visitorEmail: string };
};

type VisitorDetail = {
  _id?: string;
  visitorId?: string;
  visitorName?: string;
  visitorEmail?: string;
  visitorPhoneNumber?: string;
  visitDate?: string;
  onlineSession?: string | null;
  offlineSession?: string | null;
  storeId?: string;
  aiInteractionCount?: number;
  lastAiInteraction?: unknown;
  aiInteractions?: AiInteraction[];
};

type AiInteraction = {
  title?: string;
  summary?: string;
  message?: string;
  question?: string;
  userQuestion?: string;
  prompt?: string;
  questions?: string;
  response?: string;
  aiResponse?: string;
  answer?: string;
  type?: string;
  label?: string;
  createdOn?: string;
  createdAt?: string;
  date?: string;
  time?: string;
  timeAgo?: string;
  messagesCount?: number;
  count?: number;
  recommendations?: Array<
    | string
    | { title?: string; name?: string; label?: string; description?: string }
  >;
  dialogue?: Array<{
    speaker?: string;
    text?: string;
    _id?: string;
  }>;
};

type OfflineSession = {
  _id?: string;
  id?: string;
  title?: string;
  summary?: string;
  message?: string;
  type?: string;
  label?: string;
  createdOn?: string;
  createdAt?: string;
  date?: string;
  time?: string;
  timeAgo?: string;
  messagesCount?: number;
  count?: number;
  dialogue?: Array<{
    speaker?: string;
    text?: string;
    _id?: string;
  }>;
};

function splitName(fullName?: string) {
  const [first = "", ...rest] = (fullName || "").trim().split(" ");
  return { firstName: first, lastName: rest.join(" ") };
}

function getInteractionDateLabel(interaction?: AiInteraction) {
  const normalizeDateLabel = (value?: string) => {
    if (!value) return value;
    return value.includes("T") ? value.split("T")[0] : value;
  };
  return (
    normalizeDateLabel(interaction?.createdOn) ||
    normalizeDateLabel(interaction?.date) ||
    normalizeDateLabel(interaction?.createdAt) ||
    normalizeDateLabel(interaction?.timeAgo) ||
    normalizeDateLabel(interaction?.time) ||
    "No date"
  );
}

function getInteractionChannel(interaction: AiInteraction) {
  const channelSource = `${interaction.type || interaction.label || ""}`
    .toLowerCase()
    .trim();
  if (channelSource.includes("offline")) return "offline";
  if (channelSource.includes("online")) return "online";
  if (channelSource.includes("call") || channelSource.includes("voicemail")) {
    return "offline";
  }
  return "online";
}

function groupInteractionsByDate(interactions: AiInteraction[]) {
  return interactions.reduce(
    (acc, interaction) => {
      const dateLabel = getInteractionDateLabel(interaction);
      const existing = acc.find((block) => block.dateLabel === dateLabel);
      if (existing) {
        existing.items.push(interaction);
      } else {
        acc.push({ dateLabel, items: [interaction] });
      }
      return acc;
    },
    [] as Array<{ dateLabel: string; items: AiInteraction[] }>,
  );
}

function mapOfflineSessionToInteraction(session: OfflineSession): AiInteraction {
  return {
    title: session.title || session.summary || session.message || "Offline session",
    summary: session.summary,
    message: session.message,
    type: session.type || session.label || "offline",
    label: session.label,
    createdOn: session.createdOn,
    createdAt: session.createdAt,
    date: session.date,
    time: session.time,
    timeAgo: session.timeAgo,
    messagesCount: session.messagesCount,
    count: session.count,
    dialogue: session.dialogue,
  };
}

export default async function CrmPage({ params }: PageProps) {
  const visitor = await retrieveCrmVisitor(params.visitorEmail);
  const offlineSessionsResponse = await retrieveCrmOfflineSessions(
    params.visitorEmail,
  );
  const safeVisitor =
    visitor instanceof Error ? null : (visitor as VisitorDetail);
  const offlineSessionsRaw =
    offlineSessionsResponse instanceof Error
      ? []
      : (offlineSessionsResponse as
          | OfflineSession[]
          | { sessions?: OfflineSession[]; data?: OfflineSession[]; offlineSessions?: OfflineSession[] }
        );
  const offlineSessions = Array.isArray(offlineSessionsRaw)
    ? offlineSessionsRaw
    : offlineSessionsRaw.sessions ||
      offlineSessionsRaw.offlineSessions ||
      offlineSessionsRaw.data ||
      [];
  const { firstName, lastName } = splitName(safeVisitor?.visitorName);
  const totalSessions =
    (safeVisitor?.onlineSession ? 1 : 0) +
    (safeVisitor?.offlineSession ? 1 : 0);
  const channelValue = safeVisitor?.onlineSession
    ? "Online"
    : safeVisitor?.offlineSession
      ? "Offline"
      : "—";
  const lastAiInteractionText = safeVisitor?.lastAiInteraction
    ? "Available"
    : "—";
  const aiInteractions = safeVisitor?.aiInteractions ?? [];
  const onlineInteractions = aiInteractions.filter(
    (interaction) => getInteractionChannel(interaction) === "online",
  );
  const offlineInteractions = offlineSessions.map(mapOfflineSessionToInteraction);
  const onlineBlocks = groupInteractionsByDate(onlineInteractions);
  const offlineBlocks = groupInteractionsByDate(offlineInteractions);

  return (
    <PrivateLayout
      page="crm"
      sidebar={true}
      notifications={true}
      pageTitle="CRM"
    >
      {/* Main Content */}
      <main>
        {/*  <div className="flex justify-end items-center gap-3 pr-8">
          <button className="flex items-center gap-2 px-5 py-2 rounded-full border border-blue-400 bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition shadow-none">
            <svg width="20" height="20" fill="none" stroke="#3B82F6" strokeWidth="2" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path d="M4 4h16v16H4V4zm0 0l8 8 8-8"/></svg>
            Send email
          </button>
          <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#6D8CFF] text-white font-medium shadow-none hover:bg-[#5276e9] transition">
            Actions
            <span className="inline-block text-xl align-middle">&#8230;</span>
          </button>
        </div>*/}
        {/* Sidebar */}
        <div className="flex flex-1 overflow-hidden items-start mt-4">
          <aside className="w-[340px] bg-white border-r border-[#e5e7eb] p-6 flex flex-col gap-6 min-h-0 ">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center relative w-full">
              <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1 rounded-full">
                <span className="material-icons text-lg">edit</span>
              </button>
              <div className="w-24 h-24 rounded-full bg-gray-200 mb-2 overflow-hidden border-4 border-white shadow">
                <InitialsAvatar firstName={firstName} lastName={lastName} />
              </div>
              <div className="font-semibold text-lg flex items-center gap-1">
                {safeVisitor?.visitorName || "—"}
                <span className="text-blue-500 material-icons text-base align-middle">
                  verified
                </span>
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {safeVisitor?.visitDate || "—"} · Store{" "}
                {safeVisitor?.storeId || "—"}
              </div>
              <div className="flex items-center gap-1 mb-2">
                <span className="text-yellow-400 text-base">★ ★ ★ ★ ★</span>
                <span className="text-xs text-gray-400 ml-1">
                  {safeVisitor?.aiInteractionCount ?? 0} interactions
                </span>
              </div>
              <div className="w-full text-xs text-gray-600 space-y-2 mb-3">
                <div className="flex items-center gap-2 bg-[#f6f7fb] rounded-lg px-3 py-2">
                  <span className="material-icons text-base text-gray-400"></span>
                  <span className="font-medium text-gray-700">Email:</span>{" "}
                  {safeVisitor?.visitorEmail || "—"}
                </div>
                <div className="flex items-center gap-2 bg-[#f6f7fb] rounded-lg px-3 py-2">
                  <span className="material-icons text-base text-gray-400"></span>
                  <span className="font-medium text-gray-700">Phone:</span>{" "}
                  {safeVisitor?.visitorPhoneNumber || "—"}
                </div>
                <div className="flex items-center gap-2 bg-[#f6f7fb] rounded-lg px-3 py-2">
                  <span className="material-icons text-base text-gray-400"></span>
                  <span className="font-medium text-gray-700">Channel:</span>{" "}
                  {channelValue}
                </div>
                <div className="flex items-center gap-2 bg-[#f6f7fb] rounded-lg px-3 py-2">
                  <span className="material-icons text-base text-gray-400"></span>
                  <span className="font-medium text-gray-700">
                    Total sessions:
                  </span>{" "}
                  {totalSessions}
                </div>
                <div className="flex items-center gap-2 bg-[#f6f7fb] rounded-lg px-3 py-2">
                  <span className="material-icons text-base text-gray-400"></span>
                  <span className="font-medium text-gray-700">
                    Last engagement:
                  </span>{" "}
                  {safeVisitor?.visitDate || "—"}
                </div>
                <div className="flex items-center gap-2 bg-[#f6f7fb] rounded-lg px-3 py-2">
                  <span className="material-icons text-base text-gray-400"></span>
                  <span className="font-medium text-gray-700">
                    Last AI interaction:
                  </span>{" "}
                  {lastAiInteractionText}
                </div>
                <div className="flex items-center gap-2 bg-[#f6f7fb] rounded-lg px-3 py-2">
                  <span className="material-icons text-base text-gray-400"></span>
                  <span className="font-medium text-gray-700">
                    AI interactions:
                  </span>{" "}
                  {safeVisitor?.aiInteractions?.length ?? 0}
                </div>
              </div>
              <div className="w-full bg-green-50 border-l-4 border-green-400 p-3 rounded-xl text-xs text-green-700 mb-3">
                <b>AI suggestions:</b>
                <br />
                Based on recent activity, send a curated lookbook with 3
                recommendations. Leads with similar patterns converted 2.1x more
                often.
              </div>
              <div className="flex w-full gap-2">
                <button className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                  Message
                </button>
                <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition">
                  Let AI draft follow up
                </button>
              </div>
            </div>
          </aside>

          {/* Timeline and Tabs */}
          <section className="flex-1  pr-8 pb-8 pl-8 overflow-y-auto flex flex-col gap-6">
            {/* Tabs and actions */}
            {/*<div className="flex items-center justify-between mb-4">
            <div className="w-full flex items-center justify-between bg-white rounded-2xl px-8 py-4 shadow-sm">
              <div className="flex gap-8">
                <button className="relative px-2 pb-1 text-blue-600 font-medium bg-transparent border-none outline-none focus:outline-none">
                  Timeline
                  <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-500 rounded" />
                </button>
                <button className="text-gray-500 font-medium bg-transparent border-none outline-none focus:outline-none">Notes</button>
                <button className="text-gray-500 font-medium bg-transparent border-none outline-none focus:outline-none">Mails</button>
                <button className="text-gray-500 font-medium bg-transparent border-none outline-none focus:outline-none">Documents</button>
              </div>
              <div className="flex gap-2 items-center">
                <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-[#f6f7fb] text-gray-300 cursor-not-allowed" disabled>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.2">
                      <path d="M8.02148 11.9999L12.2906 16.269M8.02148 11.9999L12.2906 7.73082M8.02148 11.9999L15.5009 12M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C22 17.5228 22 12Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                  </svg>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-black hover:bg-gray-100 transition">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.9785 11.9999L11.7094 16.269M15.9785 11.9999L11.7094 7.73082M15.9785 11.9999L8.49907 12M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>*/}
            {/* Timeline Feed */}
            <InteractionTabs
              onlineBlocks={onlineBlocks}
              offlineBlocks={offlineBlocks}
              fallbackDate={safeVisitor?.visitDate}
            />
          </section>
        </div>
      </main>
    </PrivateLayout>
  );
}
