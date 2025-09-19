interface DataPoint {
  x: number | string;
  y: number;
  timestamp?: string;
}

interface InsightResult {
  type: 'anomaly' | 'trend' | 'correlation' | 'prediction' | 'summary';
  title: string;
  description: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  actionable: boolean;
  data?: any;
  chartType?: string;
}

interface PredictionResult {
  predictions: DataPoint[];
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  seasonality: boolean;
}

export class AIInsightsEngine {
  // Anomaly Detection using Statistical Methods
  static detectAnomalies(data: DataPoint[], threshold: number = 2.5): InsightResult[] {
    const insights: InsightResult[] = [];
    
    if (data.length < 10) return insights;

    const values = data.map(d => typeof d.y === 'number' ? d.y : 0);
    const mean = this.calculateMean(values);
    const stdDev = this.calculateStandardDeviation(values, mean);
    
    const anomalies = data.filter((point, index) => {
      const zScore = Math.abs((values[index] - mean) / stdDev);
      return zScore > threshold;
    });

    if (anomalies.length > 0) {
      insights.push({
        type: 'anomaly',
        title: `${anomalies.length} Anomal${anomalies.length === 1 ? 'y' : 'ies'} Detected`,
        description: `Found ${anomalies.length} data point${anomalies.length === 1 ? '' : 's'} that deviate significantly from the normal pattern. ${anomalies.length > 5 ? 'This could indicate data quality issues or significant events.' : 'This could indicate unusual activity or events.'}`,
        confidence: Math.min(0.95, 0.7 + (anomalies.length * 0.05)),
        severity: anomalies.length > 5 ? 'high' : anomalies.length > 2 ? 'medium' : 'low',
        actionable: true,
        data: anomalies
      });
    }

    return insights;
  }

  // Trend Analysis
  static analyzeTrends(data: DataPoint[]): InsightResult[] {
    const insights: InsightResult[] = [];
    
    if (data.length < 5) return insights;

    const values = data.map(d => typeof d.y === 'number' ? d.y : 0);
    const trendSlope = this.calculateTrendSlope(values);
    const correlation = this.calculateTrendCorrelation(values);
    
    if (Math.abs(correlation) > 0.7) {
      const direction = trendSlope > 0 ? 'increasing' : 'decreasing';
      const strength = Math.abs(correlation) > 0.9 ? 'strong' : 'moderate';
      const changePercent = ((values[values.length - 1] - values[0]) / values[0] * 100).toFixed(1);
      
      insights.push({
        type: 'trend',
        title: `${strength.charAt(0).toUpperCase() + strength.slice(1)} ${direction} trend detected`,
        description: `Data shows a ${strength} ${direction} trend with ${Math.abs(parseFloat(changePercent))}% change overall. Correlation coefficient: ${correlation.toFixed(3)}.`,
        confidence: Math.abs(correlation),
        severity: Math.abs(parseFloat(changePercent)) > 20 ? 'high' : 'medium',
        actionable: true,
        data: { slope: trendSlope, correlation, changePercent }
      });
    }

    return insights;
  }

  // Predictive Analytics
  static generatePredictions(data: DataPoint[], periods: number = 5): PredictionResult {
    const values = data.map(d => typeof d.y === 'number' ? d.y : 0);
    const trendSlope = this.calculateTrendSlope(values);
    const lastValue = values[values.length - 1];
    const seasonality = this.detectSeasonality(values);
    
    const predictions: DataPoint[] = [];
    
    for (let i = 1; i <= periods; i++) {
      let prediction = lastValue + (trendSlope * i);
      
      // Add seasonal adjustment if detected
      if (seasonality.detected) {
        const seasonalIndex = (data.length + i - 1) % seasonality.period;
        prediction *= seasonality.factors[seasonalIndex];
      }
      
      // Add some realistic variance
      const variance = this.calculateVariance(values);
      const noise = (Math.random() - 0.5) * Math.sqrt(variance) * 0.3;
      prediction += noise;
      
      predictions.push({
        x: `Prediction ${i}`,
        y: Math.max(0, prediction) // Ensure non-negative predictions
      });
    }
    
    const confidence = Math.max(0.3, 0.9 - (Math.abs(trendSlope) * 0.1));
    const trend = trendSlope > 0.1 ? 'increasing' : trendSlope < -0.1 ? 'decreasing' : 'stable';
    
    return {
      predictions,
      confidence,
      trend,
      seasonality: seasonality.detected
    };
  }

  // Correlation Analysis
  static analyzeCorrelations(datasets: { name: string; data: DataPoint[] }[]): InsightResult[] {
    const insights: InsightResult[] = [];
    
    if (datasets.length < 2) return insights;

    for (let i = 0; i < datasets.length; i++) {
      for (let j = i + 1; j < datasets.length; j++) {
        const correlation = this.calculateCorrelationBetweenDatasets(
          datasets[i].data,
          datasets[j].data
        );
        
        if (Math.abs(correlation) > 0.6) {
          const strength = Math.abs(correlation) > 0.8 ? 'strong' : 'moderate';
          const direction = correlation > 0 ? 'positive' : 'negative';
          
          insights.push({
            type: 'correlation',
            title: `${strength.charAt(0).toUpperCase() + strength.slice(1)} ${direction} correlation found`,
            description: `${datasets[i].name} and ${datasets[j].name} show a ${strength} ${direction} correlation (${correlation.toFixed(3)}). ${direction === 'positive' ? 'They tend to move in the same direction.' : 'They tend to move in opposite directions.'}`,
            confidence: Math.abs(correlation),
            severity: Math.abs(correlation) > 0.8 ? 'high' : 'medium',
            actionable: true,
            data: { datasets: [datasets[i].name, datasets[j].name], correlation }
          });
        }
      }
    }

    return insights;
  }

  // Smart Summaries
  static generateSmartSummary(data: DataPoint[]): InsightResult {
    const values = data.map(d => typeof d.y === 'number' ? d.y : 0);
    const mean = this.calculateMean(values);
    const median = this.calculateMedian(values);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const stdDev = this.calculateStandardDeviation(values, mean);
    
    const summary = {
      count: data.length,
      mean: mean.toFixed(2),
      median: median.toFixed(2),
      min,
      max,
      range: range.toFixed(2),
      stdDev: stdDev.toFixed(2),
      coefficient_of_variation: ((stdDev / mean) * 100).toFixed(1)
    };

    let description = `Dataset contains ${data.length} points with an average of ${mean.toFixed(2)}. `;
    
    if (Math.abs(mean - median) / mean > 0.1) {
      description += `Data is ${mean > median ? 'right' : 'left'}-skewed. `;
    } else {
      description += `Data is fairly normally distributed. `;
    }
    
    const cv = (stdDev / mean) * 100;
    if (cv > 30) {
      description += `High variability detected (CV: ${cv.toFixed(1)}%).`;
    } else if (cv < 10) {
      description += `Low variability - data is quite consistent.`;
    } else {
      description += `Moderate variability in the data.`;
    }

    return {
      type: 'summary',
      title: 'Data Summary & Statistics',
      description,
      confidence: 1.0,
      severity: 'low',
      actionable: false,
      data: summary
    };
  }

  // Natural Language Query Processing
  static processNaturalLanguageQuery(query: string, availableData: string[]): string {
    const lowercaseQuery = query.toLowerCase();
    
    // Intent recognition patterns
    const patterns = {
      trend: /\b(trend|trending|increase|decrease|growth|decline)\b/,
      comparison: /\b(compare|vs|versus|against|difference)\b/,
      anomaly: /\b(anomaly|anomalies|unusual|strange|odd|outlier)\b/,
      prediction: /\b(predict|forecast|future|next|upcoming)\b/,
      summary: /\b(summary|overview|total|average|mean)\b/,
      correlation: /\b(correlation|relationship|related|connected)\b/
    };

    let suggestedActions = [];

    if (patterns.trend.test(lowercaseQuery)) {
      suggestedActions.push("📈 Analyze trends in your data");
      suggestedActions.push("🔍 Look for growth patterns");
    }

    if (patterns.anomaly.test(lowercaseQuery)) {
      suggestedActions.push("🚨 Run anomaly detection");
      suggestedActions.push("📊 Check for data quality issues");
    }

    if (patterns.prediction.test(lowercaseQuery)) {
      suggestedActions.push("🔮 Generate forecasts");
      suggestedActions.push("📅 Create predictive models");
    }

    if (patterns.correlation.test(lowercaseQuery)) {
      suggestedActions.push("🔗 Analyze correlations between datasets");
      suggestedActions.push("📈 Find related metrics");
    }

    if (suggestedActions.length === 0) {
      suggestedActions.push("📊 Try: 'Show me trends in sales data'");
      suggestedActions.push("🔍 Try: 'Find anomalies in user activity'");
      suggestedActions.push("🔮 Try: 'Predict next month's revenue'");
    }

    return suggestedActions.join('\n');
  }

  // Statistical Helper Methods
  private static calculateMean(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private static calculateMedian(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  }

  private static calculateStandardDeviation(values: number[], mean: number): number {
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(avgSquaredDiff);
  }

  private static calculateVariance(values: number[]): number {
    const mean = this.calculateMean(values);
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private static calculateTrendSlope(values: number[]): number {
    const n = values.length;
    const xValues = Array.from({ length: n }, (_, i) => i);
    
    const sumX = xValues.reduce((sum, x) => sum + x, 0);
    const sumY = values.reduce((sum, y) => sum + y, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * values[i], 0);
    const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);
    
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  private static calculateTrendCorrelation(values: number[]): number {
    const n = values.length;
    const xValues = Array.from({ length: n }, (_, i) => i);
    
    const meanX = this.calculateMean(xValues);
    const meanY = this.calculateMean(values);
    
    const numerator = xValues.reduce((sum, x, i) => sum + (x - meanX) * (values[i] - meanY), 0);
    const denominatorX = Math.sqrt(xValues.reduce((sum, x) => sum + Math.pow(x - meanX, 2), 0));
    const denominatorY = Math.sqrt(values.reduce((sum, y) => sum + Math.pow(y - meanY, 2), 0));
    
    return numerator / (denominatorX * denominatorY);
  }

  private static calculateCorrelationBetweenDatasets(data1: DataPoint[], data2: DataPoint[]): number {
    const minLength = Math.min(data1.length, data2.length);
    const values1 = data1.slice(0, minLength).map(d => typeof d.y === 'number' ? d.y : 0);
    const values2 = data2.slice(0, minLength).map(d => typeof d.y === 'number' ? d.y : 0);
    
    const mean1 = this.calculateMean(values1);
    const mean2 = this.calculateMean(values2);
    
    const numerator = values1.reduce((sum, val, i) => sum + (val - mean1) * (values2[i] - mean2), 0);
    const denominator1 = Math.sqrt(values1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0));
    const denominator2 = Math.sqrt(values2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0));
    
    return numerator / (denominator1 * denominator2);
  }

  private static detectSeasonality(values: number[]): { detected: boolean; period: number; factors: number[] } {
    if (values.length < 12) {
      return { detected: false, period: 0, factors: [] };
    }

    // Simple seasonal detection for common periods
    const periods = [4, 7, 12, 24]; // quarterly, weekly, monthly, daily
    let bestPeriod = 0;
    let bestCorrelation = 0;

    for (const period of periods) {
      if (values.length >= period * 2) {
        const correlation = this.calculateSeasonalCorrelation(values, period);
        if (correlation > bestCorrelation) {
          bestCorrelation = correlation;
          bestPeriod = period;
        }
      }
    }

    if (bestCorrelation > 0.3) {
      const factors = this.calculateSeasonalFactors(values, bestPeriod);
      return { detected: true, period: bestPeriod, factors };
    }

    return { detected: false, period: 0, factors: [] };
  }

  private static calculateSeasonalCorrelation(values: number[], period: number): number {
    const cycles = Math.floor(values.length / period);
    if (cycles < 2) return 0;

    const seasonalAverages = new Array(period).fill(0);
    
    for (let i = 0; i < cycles; i++) {
      for (let j = 0; j < period; j++) {
        seasonalAverages[j] += values[i * period + j];
      }
    }
    
    seasonalAverages.forEach((_, i) => seasonalAverages[i] /= cycles);
    
    // Calculate correlation between actual values and seasonal pattern
    let correlation = 0;
    let count = 0;
    
    for (let i = 0; i < values.length - period; i++) {
      const actual = values[i];
      const seasonal = seasonalAverages[i % period];
      correlation += Math.abs(actual - seasonal);
      count++;
    }
    
    return 1 - (correlation / count / this.calculateMean(values));
  }

  private static calculateSeasonalFactors(values: number[], period: number): number[] {
    const cycles = Math.floor(values.length / period);
    const factors = new Array(period).fill(0);
    const overallMean = this.calculateMean(values);
    
    for (let i = 0; i < cycles; i++) {
      for (let j = 0; j < period; j++) {
        factors[j] += values[i * period + j];
      }
    }
    
    return factors.map(factor => (factor / cycles) / overallMean);
  }
}