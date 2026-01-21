import type { ReactNode } from "react";

export type AiHelpMessageVariant = "ai" | "user";

type AiHelpMessageBoxProps = {
  variant: AiHelpMessageVariant;
  message: ReactNode;
  avatarLabel?: string;
};

export default function AiHelpMessageBox({
  variant,
  message,
  avatarLabel = "AI",
}: AiHelpMessageBoxProps) {
  const isAi = variant === "ai";

  return (
    <div className={`ai-help-message ${variant}`}>
      {isAi ? <div className="ai-help-avatar">{avatarLabel}</div> : null}
      <div className="ai-help-bubble">{message}</div>
    </div>
  );
}
