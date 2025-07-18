import React from 'react';
import { ForecastResult } from '../types';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface ForecastResultsProps {
  results: ForecastResult[];
  modelName: string;
}

export const ForecastResults: React.FC<ForecastResultsProps> = ({ results, modelName }) => {
  const totalPredicted = results.reduce((sum, result) => sum + result.predicted, 0);
  const averagePredicted = totalPredicted / results.length;
  const trend = results.length > 1 ? 
    results[results.length - 1].predicted - results[0].predicted : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        {modelName} Results
      </h3>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Total Forecast</span>
          </div>
          <div className="text-2xl font-bold text-blue-800">
            ${totalPredicted.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-emerald-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-600">Average/Period</span>
          </div>
          <div className="text-2xl font-bold text-emerald-800">
            ${averagePredicted.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-600">Trend</span>
          </div>
          <div className={`text-2xl font-bold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '+' : ''}${trend.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Predicted Sales</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{result.date}</td>
                <td className="border border-gray-300 px-4 py-2 text-right font-medium">
                  ${result.predicted.toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {result.confidence ? `${result.confidence.toFixed(1)}%` : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};