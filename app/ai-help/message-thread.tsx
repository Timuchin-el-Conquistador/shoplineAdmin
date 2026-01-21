"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState, useTransition } from "react";
import AiHelpMessageBox from "./message-box";

type Author = "Bt" | "user";

type AiHelpMessage = {
  author: Author;
  message: string;
  date: string;
};

type AiHelpMessageThreadProps = {
  sendMessageAction: (message: string) => Promise<string>;
};

const STORAGE_KEY = "aiHelpMessages";



function isValidMessages(value: unknown): value is AiHelpMessage[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item &&
        typeof item === "object" &&
        (item as AiHelpMessage).author &&
        (item as AiHelpMessage).message &&
        (item as AiHelpMessage).date
    )
  );
}

export default function AiHelpMessageThread({
  sendMessageAction,
}: AiHelpMessageThreadProps) {
  const [messages, setMessages] = useState<AiHelpMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const messagesBodyRef = useRef<HTMLDivElement | null>(null);



  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as unknown;
        if (isValidMessages(parsed)) {
          setMessages(parsed);
          return;
        }
      } catch {
        // Ignore and fall back to defaults.
      }
    }
  }, []);

  useEffect(() => {
    const container = messagesBodyRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isPending]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = inputValue.trim();
    if (!trimmed) {
      return;
    }

    const nextMessages: AiHelpMessage[] = [
      ...messages,
      {
        author: "user",
        message: trimmed,
        date: new Date().toISOString(),
      },
    ];

    setMessages(nextMessages);
    setInputValue("");

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextMessages));
    }

    startTransition(() => {
      void sendMessageAction(trimmed)
        .then((response) => {
          const aiMessage: AiHelpMessage = {
            author: "Bt",
            message: response,
            date: new Date().toISOString(),
          };

          setMessages((prev) => {
            const next = [...prev, aiMessage];
            if (typeof window !== "undefined") {
              window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            }
            return next;
          });
        })
        .catch(() => {
          const aiMessage: AiHelpMessage = {
            author: "Bt",
            message: "Sorry, I couldn't process that. Please try again.",
            date: new Date().toISOString(),
          };

          setMessages((prev) => {
            const next = [...prev, aiMessage];
            if (typeof window !== "undefined") {
              window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            }
            return next;
          });
        });
    });
  };

  return (
    <>
      <div className="ai-help-messages">
        <div className="ai-help-messages-header">Conversation</div>
        <div className="ai-help-messages-body" ref={messagesBodyRef}>
          {messages.map((message, index) => (
            <AiHelpMessageBox
              key={`${message.date}-${index}`}
              variant={message.author === "Bt" ? "ai" : "user"}
              message={message.message}
            />
          ))}
          {isPending && (
            <div className="ai-help-message ai ai-help-typing" role="status" aria-live="polite">
              <span className="ai-help-avatar">Bt</span>
              <div className="ai-help-bubble">
                <span className="ai-help-typing-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="sr-only">Generating response…</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <form className="ai-help-input" onSubmit={handleSubmit}>
        <input
          type="text"
          name="message"
          placeholder="Ask or search for anything type @ to tag assistant"
          aria-label="Ask or search"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          disabled={isPending}
        />
        <button className="ai-help-send" type="submit" aria-label="Send" disabled={isPending}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 12l16-8-5.5 8L20 20 4 12z" />
          </svg>
        </button>
      </form>
    </>
  );
}
