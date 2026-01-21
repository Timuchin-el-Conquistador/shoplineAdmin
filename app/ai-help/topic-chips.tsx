"use client";

export default function TopicChips({ topics, setTopicIndex, activeTopicIndex }: { topics: string[]; setTopicIndex: (index: number) => void; activeTopicIndex: number }) {


  return (
    <div className="ai-help-chips">
      {topics.map((chip, index) => (
        <button
          key={chip}
          className={`ai-help-chip ${index === activeTopicIndex ? "active" : ""}`}
          type="button"
          onClick={() => setTopicIndex(index)}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
