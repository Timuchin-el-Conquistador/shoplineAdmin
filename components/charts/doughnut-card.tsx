"use client";

import dynamic from "next/dynamic";
import React from "react";

const MyDoughnutChart = dynamic(() => import("./doughnut"), { ssr: false });

type Props = {
  data: any;
  valueText?: string;
  subText?: string;
  className?: string;
};

export default function DoughnutCard({ data, valueText, subText, className }: Props) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
  };

  const colors: string[] = (data?.datasets?.[0]?.backgroundColor) || [];
  const labels: string[] = data?.labels || [];

  return (
    <div className={className}>
      <div className="flex items-center gap-6">
        <div className="relative w-56 h-56">
          <MyDoughnutChart data={data} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-2xl md:text-3xl font-bold">{valueText}</div>
            {subText && <div className="text-sm text-gray-500 mt-1">{subText}</div>}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col gap-3">
            {labels.map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <span style={{ backgroundColor: colors[i] }} className="w-3 h-3 rounded-full inline-block" />
                <div className="text-sm text-gray-700">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
