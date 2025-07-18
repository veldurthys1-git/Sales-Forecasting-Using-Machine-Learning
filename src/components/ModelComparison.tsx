import React from 'react';
import { ForecastModel } from '../types';

interface ModelComparisonProps {
  models: ForecastModel[];
}

export const ModelComparison: React.FC<ModelComparisonProps> = ({ models }) => {
  const getBestModel = (metric: keyof ForecastModel['metrics']) => {
    return models.reduce((best, current) => 
      current.metrics[metric] < best.metrics[metric] ? current : best
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Model Performance Comparison</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-left">Model</th>
              <th className="border border-gray-300 px-4 py-2 text-center">MAE</th>
              <th className="border border-gray-300 px-4 py-2 text-center">RMSE</th>
              <th className="border border-gray-300 px-4 py-2 text-center">MAPE (%)</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-medium">{model.name}</td>
                <td className={`border border-gray-300 px-4 py-2 text-center ${
                  getBestModel('mae').name === model.name ? 'bg-green-100 font-semibold' : ''
                }`}>
                  {model.metrics.mae.toFixed(2)}
                </td>
                <td className={`border border-gray-300 px-4 py-2 text-center ${
                  getBestModel('rmse').name === model.name ? 'bg-green-100 font-semibold' : ''
                }`}>
                  {model.metrics.rmse.toFixed(2)}
                </td>
                <td className={`border border-gray-300 px-4 py-2 text-center ${
                  getBestModel('mape').name === model.name ? 'bg-green-100 font-semibold' : ''
                }`}>
                  {model.metrics.mape.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>MAE:</strong> Mean Absolute Error - Average prediction error</p>
        <p><strong>RMSE:</strong> Root Mean Square Error - Penalty for large errors</p>
        <p><strong>MAPE:</strong> Mean Absolute Percentage Error - Percentage accuracy</p>
        <p className="mt-2 text-green-600"><strong>Green highlight:</strong> Best performing model for each metric</p>
      </div>
    </div>
  );
};