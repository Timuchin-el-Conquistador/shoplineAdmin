// components/MyBarChart.tsx
import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MyBarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
  options?: any; // You can define a more specific type for options if needed
}

const MyBarChart: React.FC<MyBarChartProps> = ({ data, options }) => {
  const chartRef = useRef<any>(null);
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
        labels: {
          color: '#6b7280',
          boxWidth: 12,
          padding: 12,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(17,24,39,0.95)',
        titleColor: '#fff',
        bodyColor: '#e5e7eb',
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: any) => {
            const v = context.parsed?.y ?? context.parsed?.x ?? null;
            const dsLabel = context.dataset && context.dataset.label ? `${context.dataset.label}: ` : '';
            const value = typeof v === 'number' ? (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`) : '';
            return `${dsLabel}${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
        },
        // make bars wider and add some spacing
        stacked: false,
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(203,213,225,0.5)',
          borderDash: [4, 4],
        },
        ticks: {
          color: '#9ca3af',
          stepSize: 1,
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 10,
        borderSkipped: false,
        maxBarThickness: 28,
        barPercentage: 0.56,
        categoryPercentage: 0.6,
      },
    },
    layout: {
      padding: {
        top: 6,
        right: 6,
        left: 6,
        bottom: 6,
      },
    },
  };

  // Use a scriptable backgroundColor so we can create a responsive vertical gradient
  const processedData = {
    labels: data.labels,
    datasets: data.datasets.map((ds: any, i: number) => ({
      ...ds,
      backgroundColor: (ctx: any) => {
        const chart = ctx.chart;
        const c = chart.ctx;
        const area = chart.chartArea;
        if (!area) return ds.backgroundColor || 'rgba(99,102,241,0.6)';
        const grad = c.createLinearGradient(0, area.top, 0, area.bottom);
        // fallback to the provided color or default indigo tones
        grad.addColorStop(0, (ds.backgroundColor && typeof ds.backgroundColor === 'string') ? ds.backgroundColor : 'rgba(99,102,241,0.95)');
        grad.addColorStop(1, 'rgba(99,102,241,0.45)');
        return grad;
      },
      // subtle border to separate bars
      borderColor: ds.borderColor ?? 'rgba(15,23,42,0.06)',
      borderWidth: ds.borderWidth ?? 0,
    })),
  };

  return <Bar ref={chartRef} data={processedData} options={options || defaultOptions} />;
};

export default MyBarChart;