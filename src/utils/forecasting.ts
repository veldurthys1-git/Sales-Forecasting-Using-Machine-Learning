import { SalesData, ForecastResult, ModelMetrics } from '../types';

export class LinearRegression {
  private slope: number = 0;
  private intercept: number = 0;

  fit(data: SalesData[]): void {
    const n = data.length;
    const sumX = data.reduce((sum, item) => sum + item.period, 0);
    const sumY = data.reduce((sum, item) => sum + item.sales, 0);
    const sumXY = data.reduce((sum, item) => sum + item.period * item.sales, 0);
    const sumX2 = data.reduce((sum, item) => sum + item.period * item.period, 0);

    this.slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    this.intercept = (sumY - this.slope * sumX) / n;
  }

  predict(periods: number[]): number[] {
    return periods.map(period => this.slope * period + this.intercept);
  }
}

export class MovingAverage {
  private window: number;

  constructor(window: number = 3) {
    this.window = window;
  }

  predict(data: SalesData[], forecastPeriods: number): number[] {
    const predictions: number[] = [];
    const values = data.map(d => d.sales);

    for (let i = 0; i < forecastPeriods; i++) {
      const start = Math.max(0, values.length - this.window);
      const average = values.slice(start).reduce((sum, val) => sum + val, 0) / 
                     Math.min(this.window, values.length - start);
      predictions.push(average);
      values.push(average);
    }

    return predictions;
  }
}

export class ExponentialSmoothing {
  private alpha: number;

  constructor(alpha: number = 0.3) {
    this.alpha = alpha;
  }

  predict(data: SalesData[], forecastPeriods: number): number[] {
    const predictions: number[] = [];
    let lastSmoothed = data[0].sales;

    // Calculate smoothed values for historical data
    for (let i = 1; i < data.length; i++) {
      lastSmoothed = this.alpha * data[i].sales + (1 - this.alpha) * lastSmoothed;
    }

    // Generate forecasts
    for (let i = 0; i < forecastPeriods; i++) {
      predictions.push(lastSmoothed);
    }

    return predictions;
  }
}

export function calculateMetrics(actual: number[], predicted: number[]): ModelMetrics {
  const n = actual.length;
  let mae = 0, mse = 0, mape = 0;

  for (let i = 0; i < n; i++) {
    const error = Math.abs(actual[i] - predicted[i]);
    mae += error;
    mse += error * error;
    mape += actual[i] !== 0 ? Math.abs(error / actual[i]) : 0;
  }

  mae /= n;
  mse /= n;
  mape = (mape / n) * 100;
  const rmse = Math.sqrt(mse);

  return { mae, mse, rmse, mape };
}

export function generateForecastDates(lastDate: string, periods: number): string[] {
  const dates: string[] = [];
  const date = new Date(lastDate);

  for (let i = 1; i <= periods; i++) {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + i);
    dates.push(newDate.toISOString().split('T')[0]);
  }

  return dates;
}