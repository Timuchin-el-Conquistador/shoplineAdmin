"use client";

import { useState } from "react";
import TopicChips from "./topic-chips";
import AiHelpMessageThread from "./message-thread";


export default function AiHelpClient({
  firstName,
  topics,
  messageAi
}: {
  firstName: string;
  topics: string[];
  messageAi: (topic: string, message: string) =>  Promise<string | Error> ;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  async function sendAiHelpMessage(message: string ) {
    const explanation = await messageAi(topics[activeIndex], message);
    return explanation instanceof Error ? "Sorry, I couldn't process that. Please try again." : explanation;
  }
  return (
    <section className="ai-help-page">
      <div className="ai-help-hero">
        <h2>Hi {firstName}</h2>
        <p>How I can help you?</p>
      </div>

      <div className="ai-help-panel">
        <div className="ai-help-topics">
          <span className="ai-help-label">AI topics</span>
          <TopicChips
            topics={topics}
            activeTopicIndex={activeIndex}
            setTopicIndex={setActiveIndex}
          />
        </div>

        <div className="ai-help-body">
          <div className="ai-help-pick-row">
            <div className="ai-help-pick-title">
              <span className="ai-help-dot" />
              <span>Pick a topic</span>
              <span className="ai-help-live">Live</span>
            </div>
            <button className="ai-help-more" type="button" aria-label="More options">
              ...
            </button>
          </div>

          <AiHelpMessageThread  sendMessageAction={sendAiHelpMessage} />
        </div>
      </div>
    </section>
  );
}
