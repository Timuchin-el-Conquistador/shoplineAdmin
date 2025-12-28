"use client";

import React from "react";

export default function Sparkline({
  points,
  colorClass,
}: {
  points: number[];
  colorClass: string;
}) {
  const width = 96;
  const height = 28;
  const padding = 2;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = Math.max(1, max - min);

  const d = points
    .map((value, index) => {
      const x = (index / (points.length - 1)) * (width - padding * 2) + padding;
      const y =
        height -
        padding -
        ((value - min) / range) * (height - padding * 2);
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className={colorClass}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={d}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
