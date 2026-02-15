"use client";

import { useMemo, useState } from "react";

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

type InteractionBlock = {
  dateLabel: string;
  items: AiInteraction[];
};

type InteractionTabsProps = {
  onlineBlocks: InteractionBlock[];
  offlineBlocks: InteractionBlock[];
  fallbackDate?: string;
};

function getInteractionTitle(interaction: AiInteraction) {
  return (
    interaction.title ||
    interaction.summary ||
    interaction.message ||
    interaction.type ||
    interaction.label ||
    "AI interaction"
  );
}

function getInteractionMeta(interaction: AiInteraction, fallbackDate?: string) {
  const time =
    interaction.timeAgo ||
    interaction.createdOn ||
    interaction.createdAt ||
    interaction.time ||
    interaction.date ||
    fallbackDate ||
    "—";
  const typeLabel = interaction.type || interaction.label || "AI conversation";
  const count = interaction.messagesCount ?? interaction.count;
  const countText =
    count !== undefined && count !== null ? ` · ${count} messages` : "";
  return `${time} · ${typeLabel}${countText}`;
}

function getInteractionDotClass(interaction: AiInteraction) {
  const typeValue =
    `${interaction.type || interaction.label || ""}`.toLowerCase();
  if (typeValue.includes("handoff")) return "bg-purple-500";
  if (typeValue.includes("browse") || typeValue.includes("visit"))
    return "bg-pink-400";
  return "bg-blue-500";
}

function getInteractionQuestion(interaction: AiInteraction) {
  return (
    interaction.question ||
    interaction.questions ||
    interaction.userQuestion ||
    interaction.prompt ||
    ""
  );
}

function getInteractionResponse(interaction: AiInteraction) {
  return (
    interaction.response || interaction.aiResponse || interaction.answer || ""
  );
}

function getInteractionRecommendations(interaction: AiInteraction) {
  return interaction.recommendations || [];
}

function getInteractionDialogue(interaction: AiInteraction) {
  return interaction.dialogue || [];
}

export default function InteractionTabs({
  onlineBlocks,
  offlineBlocks,
  fallbackDate,
}: InteractionTabsProps) {
  const [activeTab, setActiveTab] = useState<"online" | "offline">("online");
  const activeBlocks = useMemo(
    () => (activeTab === "online" ? onlineBlocks : offlineBlocks),
    [activeTab, onlineBlocks, offlineBlocks],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("online")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeTab === "online"
              ? "bg-blue-600 text-white shadow"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Online
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("offline")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeTab === "offline"
              ? "bg-blue-600 text-white shadow"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Offline
        </button>
      </div>

      {activeBlocks.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-6 text-sm text-gray-500">
          No interactions yet.
        </div>
      ) : (
        activeBlocks.map((block, blockIndex) => (
          <div
            className="bg-white rounded-2xl shadow p-6"
            key={`${activeTab}-interaction-block-${blockIndex}`}
          >
            <div className="font-semibold text-gray-700 mb-4">
              {block.dateLabel}
            </div>
            {block.items.length === 0 ? (
              <div className="text-sm text-gray-500">No interactions yet.</div>
            ) : (
              <div className="space-y-6">
                {block.items.map((interaction, index) => (
                  <div
                    className="flex gap-3 items-start"
                    key={`${interaction.createdAt || interaction.date || index}-${activeTab}-block-${blockIndex}`}
                  >
                    <div
                      className={`w-2 h-2 mt-2 rounded-full ${getInteractionDotClass(interaction)}`}
                    />
                    <div>
                      <div className="font-medium">
                        {getInteractionTitle(interaction)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {getInteractionMeta(interaction, fallbackDate)}
                      </div>
                      {activeTab === "offline" &&
                        getInteractionDialogue(interaction).length > 0 && (
                          <div className="mt-3 space-y-2">
                            <div className="text-xs uppercase tracking-wider text-gray-400">
                              Dialogue
                            </div>
                            <div className="space-y-2">
                              {getInteractionDialogue(interaction).map(
                                (turn, turnIndex) => (
                                  <div
                                    key={`${turn._id || turnIndex}-${activeTab}-dialogue-${blockIndex}-${index}`}
                                    className={`rounded-xl px-3 py-2 text-sm text-gray-700 ${
                                      turnIndex % 2 === 0
                                        ? "bg-indigo-50"
                                        : "bg-emerald-50"
                                    }`}
                                  >
                                    <div className="text-xs uppercase tracking-wider text-gray-400">
                                      {turn.speaker || "Unknown"}
                                    </div>
                                    <div className="mt-1 text-gray-700">
                                      {turn.text || "—"}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      {(getInteractionQuestion(interaction) ||
                        getInteractionResponse(interaction)) && (
                        <div className="mt-3 space-y-2">
                          {getInteractionQuestion(interaction) && (
                            <div className="rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-700">
                              <span className="text-xs uppercase tracking-wider text-gray-400">
                                Question
                              </span>
                              <div className="mt-1">
                                {getInteractionQuestion(interaction)}
                              </div>
                            </div>
                          )}
                          {getInteractionResponse(interaction) && (
                            <div className="rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-900">
                              <span className="text-xs uppercase tracking-wider text-blue-400">
                                AI Response
                              </span>
                              <div className="mt-1">
                                {getInteractionResponse(interaction)}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {getInteractionRecommendations(interaction).length > 0 && (
                        <div className="mt-3 rounded-xl border border-green-100 bg-green-50 px-3 py-2 text-sm text-green-800">
                          <div className="text-xs uppercase tracking-wider text-green-500">
                            Recommendations
                          </div>
                          <ul className="mt-2 list-disc pl-5 space-y-1">
                            {getInteractionRecommendations(interaction).map(
                              (rec, recIndex) => (
                                <li
                                  key={`${interaction.createdAt || interaction.date || index}-rec-${recIndex}-${activeTab}-block-${blockIndex}`}
                                >
                                  {typeof rec === "string"
                                    ? rec
                                    : rec.title ||
                                      rec.name ||
                                      rec.label ||
                                      rec.description ||
                                      "Recommendation"}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
