import React, { useState, useEffect } from 'react';
import { BarChart3, Brain, TrendingUp, Settings } from 'lucide-react';
import { SalesData, ForecastModel } from './types';
import { DataInput } from './components/DataInput';
import { ForecastChart } from './components/ForecastChart';
import { ModelComparison } from './components/ModelComparison';
import { ForecastResults } from './components/ForecastResults';
import {
  LinearRegression,
  MovingAverage,
  ExponentialSmoothing,
  calculateMetrics,
  generateForecastDates
} from './utils/forecasting';

function App() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [forecastModels, setForecastModels] = useState<ForecastModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('Linear Regression');
  const [forecastPeriods, setForecastPeriods] = useState<number>(6);
  const [activeTab, setActiveTab] = useState<string>('data');

  // Sample data for demonstration
  useEffect(() => {
    const sampleData: SalesData[] = [
      { date: '2023-01-01', sales: 10000, period: 1 },
      { date: '2023-02-01', sales: 12000, period: 2 },
      { date: '2023-03-01', sales: 11500, period: 3 },
      { date: '2023-04-01', sales: 13000, period: 4 },
      { date: '2023-05-01', sales: 14500, period: 5 },
      { date: '2023-06-01', sales: 13800, period: 6 },
      { date: '2023-07-01', sales: 15200, period: 7 },
      { date: '2023-08-01', sales: 16000, period: 8 },
      { date: '2023-09-01', sales: 15500, period: 9 },
      { date: '2023-10-01', sales: 17000, period: 10 },
      { date: '2023-11-01', sales: 18500, period: 11 },
      { date: '2023-12-01', sales: 19200, period: 12 }
    ];
    setSalesData(sampleData);
  }, []);

  // Generate forecasts when data changes
  useEffect(() => {
    if (salesData.length < 3) return;

    const models: ForecastModel[] = [];
    const forecastDates = generateForecastDates(
      salesData[salesData.length - 1].date,
      forecastPeriods
    );

    // Linear Regression
    const lr = new LinearRegression();
    lr.fit(salesData);
    const futurePeriods = Array.from(
      { length: forecastPeriods },
      (_, i) => salesData.length + i + 1
    );
    const lrPredictions = lr.predict(futurePeriods);
    const lrTrainingPredictions = lr.predict(salesData.map(d => d.period));
    const lrMetrics = calculateMetrics(
      salesData.map(d => d.sales),
      lrTrainingPredictions
    );

    models.push({
      name: 'Linear Regression',
      description: 'Fits a linear trend to historical data',
      forecast: lrPredictions.map((pred, i) => ({
        date: forecastDates[i],
        predicted: Math.max(0, pred),
        confidence: 85
      })),
      metrics: lrMetrics
    });

    // Moving Average
    const ma = new MovingAverage(3);
    const maPredictions = ma.predict(salesData, forecastPeriods);
    const maTrainingPredictions = salesData.slice(2).map((_, i) => {
      const start = Math.max(0, i - 1);
      const end = i + 2;
      return salesData.slice(start, end).reduce((sum, d) => sum + d.sales, 0) / 3;
    });
    const maMetrics = calculateMetrics(
      salesData.slice(2).map(d => d.sales),
      maTrainingPredictions
    );

    models.push({
      name: 'Moving Average',
      description: 'Uses average of recent periods for prediction',
      forecast: maPredictions.map((pred, i) => ({
        date: forecastDates[i],
        predicted: Math.max(0, pred),
        confidence: 70
      })),
      metrics: maMetrics
    });

    // Exponential Smoothing
    const es = new ExponentialSmoothing(0.3);
    const esPredictions = es.predict(salesData, forecastPeriods);
    const esTrainingPredictions = salesData.map((_, i) => {
      if (i === 0) return salesData[0].sales;
      let smoothed = salesData[0].sales;
      for (let j = 1; j <= i; j++) {
        smoothed = 0.3 * salesData[j].sales + 0.7 * smoothed;
      }
      return smoothed;
    });
    const esMetrics = calculateMetrics(
      salesData.map(d => d.sales),
      esTrainingPredictions
    );

    models.push({
      name: 'Exponential Smoothing',
      description: 'Gives more weight to recent observations',
      forecast: esPredictions.map((pred, i) => ({
        date: forecastDates[i],
        predicted: Math.max(0, pred),
        confidence: 75
      })),
      metrics: esMetrics
    });

    setForecastModels(models);
  }, [salesData, forecastPeriods]);

  const selectedModelData = forecastModels.find(m => m.name === selectedModel);

  const tabs = [
    { id: 'data', label: 'Data Input', icon: BarChart3 },
    { id: 'forecast', label: 'Forecast', icon: TrendingUp },
    { id: 'comparison', label: 'Model Comparison', icon: Brain },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Sales Forecasting ML
                </h1>
                <p className="text-sm text-gray-500">
                  Machine Learning Sales Prediction Platform
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Data Points: <span className="font-medium">{salesData.length}</span>
              </div>
              <div className="text-sm text-gray-600">
                Forecast Periods: <span className="font-medium">{forecastPeriods}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'data' && (
          <div className="space-y-6">
            <DataInput data={salesData} onDataChange={setSalesData} />
            {salesData.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Data Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {salesData.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Records</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      ${Math.max(...salesData.map(d => d.sales)).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Highest Sales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      ${Math.min(...salesData.map(d => d.sales)).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Lowest Sales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      ${Math.round(salesData.reduce((sum, d) => sum + d.sales, 0) / salesData.length).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Average Sales</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'forecast' && (
          <div className="space-y-6">
            {/* Model Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Select Forecasting Model
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {forecastModels.map((model) => (
                  <button
                    key={model.name}
                    onClick={() => setSelectedModel(model.name)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedModel === model.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{model.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {model.description}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        MAPE: {model.metrics.mape.toFixed(1)}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chart */}
            {selectedModelData && (
              <ForecastChart
                historicalData={salesData}
                forecastData={selectedModelData.forecast}
                modelName={selectedModelData.name}
              />
            )}

            {/* Results */}
            {selectedModelData && (
              <ForecastResults
                results={selectedModelData.forecast}
                modelName={selectedModelData.name}
              />
            )}
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <ModelComparison models={forecastModels} />
            
            {/* Model Insights */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Model Insights
              </h3>
              <div className="space-y-4">
                {forecastModels.map((model) => (
                  <div key={model.name} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{model.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">MAE:</span>
                        <span className="ml-2 font-medium">{model.metrics.mae.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">RMSE:</span>
                        <span className="ml-2 font-medium">{model.metrics.rmse.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">MAPE:</span>
                        <span className="ml-2 font-medium">{model.metrics.mape.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Avg Forecast:</span>
                        <span className="ml-2 font-medium">
                          ${Math.round(model.forecast.reduce((sum, f) => sum + f.predicted, 0) / model.forecast.length).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Forecast Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Forecast Periods
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={forecastPeriods}
                    onChange={(e) => setForecastPeriods(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    How many periods ahead to forecast (1-24)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Data Export
              </h3>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    const csv = [
                      'Date,Sales,Period',
                      ...salesData.map(d => `${d.date},${d.sales},${d.period}`)
                    ].join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'sales_data.csv';
                    a.click();
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Export Historical Data
                </button>
                
                {selectedModelData && (
                  <button
                    onClick={() => {
                      const csv = [
                        'Date,Predicted_Sales,Confidence',
                        ...selectedModelData.forecast.map(f => 
                          `${f.date},${f.predicted},${f.confidence || 'N/A'}`
                        )
                      ].join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${selectedModelData.name.toLowerCase().replace(/\s+/g, '_')}_forecast.csv`;
                      a.click();
                    }}
                    className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    Export Forecast Results
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;