export interface SalesData {
  date: string;
  sales: number;
  period: number;
}

export interface ForecastResult {
  date: string;
  predicted: number;
  confidence?: number;
}

export interface ModelMetrics {
  mae: number; // Mean Absolute Error
  mse: number; // Mean Squared Error
  rmse: number; // Root Mean Squared Error
  mape: number; // Mean Absolute Percentage Error
}

export interface ForecastModel {
  name: string;
  description: string;
  forecast: ForecastResult[];
  metrics: ModelMetrics;
}