import React from 'react';
import { SalesData, ForecastResult } from '../types';

interface ForecastChartProps {
  historicalData: SalesData[];
  forecastData: ForecastResult[];
  modelName: string;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  historicalData,
  forecastData,
  modelName
}) => {
  const allData = [...historicalData, ...forecastData];
  const maxValue = Math.max(
    ...historicalData.map(d => d.sales),
    ...forecastData.map(d => d.predicted)
  );
  const minValue = Math.min(
    ...historicalData.map(d => d.sales),
    ...forecastData.map(d => d.predicted)
  );

  const range = maxValue - minValue;
  const padding = range * 0.1;
  const chartHeight = 300;
  const chartWidth = 800;

  const getY = (value: number) => {
    return chartHeight - ((value - minValue + padding) / (range + 2 * padding)) * chartHeight;
  };

  const getX = (index: number) => {
    return (index / (allData.length - 1)) * chartWidth;
  };

  // Create path for historical data
  const historicalPath = historicalData
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.sales)}`)
    .join(' ');

  // Create path for forecast data
  const forecastPath = forecastData
    .map((d, i) => {
      const xPos = getX(historicalData.length - 1 + i);
      return `${i === 0 ? 'M' : 'L'} ${xPos} ${getY(d.predicted)}`;
    })
    .join(' ');

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        {modelName} Forecast
      </h3>
      
      <div className="overflow-x-auto">
        <svg width={chartWidth} height={chartHeight + 40} className="border border-gray-200 rounded">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1={0}
              y1={i * (chartHeight / 4)}
              x2={chartWidth}
              y2={i * (chartHeight / 4)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}

          {/* Historical data line */}
          <path
            d={historicalPath}
            stroke="#2563eb"
            strokeWidth="2"
            fill="none"
          />

          {/* Forecast data line */}
          <path
            d={forecastPath}
            stroke="#f59e0b"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />

          {/* Historical data points */}
          {historicalData.map((d, i) => (
            <circle
              key={i}
              cx={getX(i)}
              cy={getY(d.sales)}
              r="4"
              fill="#2563eb"
            />
          ))}

          {/* Forecast data points */}
          {forecastData.map((d, i) => (
            <circle
              key={i}
              cx={getX(historicalData.length - 1 + i)}
              cy={getY(d.predicted)}
              r="4"
              fill="#f59e0b"
            />
          ))}

          {/* Separation line */}
          <line
            x1={getX(historicalData.length - 1)}
            y1={0}
            x2={getX(historicalData.length - 1)}
            y2={chartHeight}
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="3,3"
          />
        </svg>
      </div>

      <div className="mt-4 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-blue-600"></div>
          <span>Historical Data</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-orange-500" style={{ backgroundImage: 'repeating-linear-gradient(to right, #f59e0b 0px, #f59e0b 5px, transparent 5px, transparent 10px)' }}></div>
          <span>Forecast</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-emerald-500" style={{ backgroundImage: 'repeating-linear-gradient(to right, #10b981 0px, #10b981 3px, transparent 3px, transparent 6px)' }}></div>
          <span>Forecast Start</span>
        </div>
      </div>
    </div>
  );
};