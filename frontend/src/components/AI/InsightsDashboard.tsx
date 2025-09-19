import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Zap,
  Search,
  Mic,
  RefreshCw,
  Download,
  Eye,
  MessageSquare,
  ChevronRight,
  Lightbulb,
  BarChart3,
  Activity,
  Sparkles
} from 'lucide-react';
import { AIInsightsEngine } from '../../services/aiInsights';

interface InsightCardProps {
  insight: any;
  onViewDetails: (insight: any) => void;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, onViewDetails }) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'anomaly': return AlertTriangle;
      case 'trend': return TrendingUp;
      case 'correlation': return Target;
      case 'prediction': return Zap;
      case 'summary': return BarChart3;
      default: return Lightbulb;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-800';
      case 'medium': return 'text-yellow-800';
      case 'low': return 'text-blue-800';
      default: return 'text-gray-800';
    }
  };

  const Icon = getInsightIcon(insight.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${getSeverityColor(insight.severity)} hover:shadow-md`}
      onClick={() => onViewDetails(insight)}
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${insight.severity === 'high' ? 'bg-red-100' : insight.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
          <Icon className={`h-5 w-5 ${getSeverityTextColor(insight.severity)}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className={`font-semibold ${getSeverityTextColor(insight.severity)} line-clamp-1`}>
              {insight.title}
            </h3>
            <div className="flex items-center ml-2">
              <span className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded-full">
                {(insight.confidence * 100).toFixed(0)}%
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400 ml-1" />
            </div>
          </div>
          <p className={`text-sm mt-1 line-clamp-2 ${getSeverityTextColor(insight.severity)} opacity-80`}>
            {insight.description}
          </p>
          {insight.actionable && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-60 text-gray-700">
                <Sparkles className="h-3 w-3 mr-1" />
                Actionable
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const InsightsDashboard: React.FC = () => {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [queryResponse, setQueryResponse] = useState('');

  // Sample data for demonstration
  const sampleData = [
    { x: 'Jan', y: 1200 },
    { x: 'Feb', y: 1350 },
    { x: 'Mar', y: 1100 },
    { x: 'Apr', y: 1500 },
    { x: 'May', y: 2800 }, // Anomaly
    { x: 'Jun', y: 1400 },
    { x: 'Jul', y: 1600 },
    { x: 'Aug', y: 1750 },
    { x: 'Sep', y: 1650 },
    { x: 'Oct', y: 1800 },
    { x: 'Nov', y: 1900 },
    { x: 'Dec', y: 2000 }
  ];

  const sampleData2 = [
    { x: 'Jan', y: 800 },
    { x: 'Feb', y: 900 },
    { x: 'Mar', y: 750 },
    { x: 'Apr', y: 1000 },
    { x: 'May', y: 1200 },
    { x: 'Jun', y: 950 },
    { x: 'Jul', y: 1100 },
    { x: 'Aug', y: 1250 },
    { x: 'Sep', y: 1150 },
    { x: 'Oct', y: 1300 },
    { x: 'Nov', y: 1400 },
    { x: 'Dec', y: 1500 }
  ];

  const generateInsights = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const allInsights = [
      ...AIInsightsEngine.detectAnomalies(sampleData),
      ...AIInsightsEngine.analyzeTrends(sampleData),
      ...AIInsightsEngine.analyzeCorrelations([
        { name: 'Sales Revenue', data: sampleData },
        { name: 'Marketing Spend', data: sampleData2 }
      ]),
      AIInsightsEngine.generateSmartSummary(sampleData)
    ];

    // Add predictions insight
    const predictions = AIInsightsEngine.generatePredictions(sampleData, 3);
    allInsights.push({
      type: 'prediction',
      title: `${predictions.trend.charAt(0).toUpperCase() + predictions.trend.slice(1)} trend predicted`,
      description: `Based on current data patterns, we predict a ${predictions.trend} trend for the next 3 periods. ${predictions.seasonality ? 'Seasonal patterns detected.' : 'No strong seasonality found.'} Confidence: ${(predictions.confidence * 100).toFixed(0)}%`,
      confidence: predictions.confidence,
      severity: predictions.confidence > 0.7 ? 'medium' : 'low',
      actionable: true,
      data: predictions
    });

    setInsights(allInsights);
    setLoading(false);
  };

  const handleNaturalLanguageQuery = () => {
    if (!naturalLanguageQuery.trim()) return;
    
    const response = AIInsightsEngine.processNaturalLanguageQuery(
      naturalLanguageQuery,
      ['Sales Revenue', 'Marketing Spend', 'User Activity']
    );
    
    setQueryResponse(response);
  };

  useEffect(() => {
    generateInsights();
  }, []);

  const highPriorityInsights = insights.filter(insight => insight.severity === 'high');
  const mediumPriorityInsights = insights.filter(insight => insight.severity === 'medium');
  const lowPriorityInsights = insights.filter(insight => insight.severity === 'low');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
            <p className="text-gray-600">Intelligent analysis and recommendations for your data</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateInsights}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Analyzing...' : 'Refresh Insights'}
          </motion.button>
        </div>
      </motion.div>

      {/* Natural Language Query */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
      >
        <div className="flex items-center mb-4">
          <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Ask AI About Your Data</h2>
        </div>
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={naturalLanguageQuery}
              onChange={(e) => setNaturalLanguageQuery(e.target.value)}
              placeholder="Ask about trends, anomalies, or predictions... (e.g., 'Show me unusual patterns in sales')"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleNaturalLanguageQuery()}
            />
          </div>
          <button
            onClick={handleNaturalLanguageQuery}
            className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mic className="h-4 w-4 mr-2" />
            Ask AI
          </button>
        </div>
        {queryResponse && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">AI Suggestions:</h3>
            <div className="text-sm text-gray-700 whitespace-pre-line">{queryResponse}</div>
          </div>
        )}
      </motion.div>

      {/* Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{highPriorityInsights.length}</p>
              <p className="text-sm text-gray-600">High Priority</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Activity className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{mediumPriorityInsights.length}</p>
              <p className="text-sm text-gray-600">Medium Priority</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Lightbulb className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{insights.length}</p>
              <p className="text-sm text-gray-600">Total Insights</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Insights Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing your data with AI...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* High Priority Insights */}
          {highPriorityInsights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">High Priority Insights</h2>
                <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  Requires Attention
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highPriorityInsights.map((insight, index) => (
                  <InsightCard
                    key={index}
                    insight={insight}
                    onViewDetails={setSelectedInsight}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Medium Priority Insights */}
          {mediumPriorityInsights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center mb-4">
                <TrendingUp className="h-5 w-5 text-yellow-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Trends & Patterns</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mediumPriorityInsights.map((insight, index) => (
                  <InsightCard
                    key={index}
                    insight={insight}
                    onViewDetails={setSelectedInsight}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Low Priority Insights */}
          {lowPriorityInsights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center mb-4">
                <Lightbulb className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">General Insights</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lowPriorityInsights.map((insight, index) => (
                  <InsightCard
                    key={index}
                    insight={insight}
                    onViewDetails={setSelectedInsight}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {insights.length === 0 && !loading && (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No insights available</h3>
              <p className="text-gray-600">Connect your data sources to get AI-powered insights</p>
            </div>
          )}
        </div>
      )}

      {/* Insight Detail Modal */}
      {selectedInsight && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedInsight(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedInsight.title}</h2>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedInsight.severity === 'high' ? 'bg-red-100 text-red-800' :
                      selectedInsight.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedInsight.severity} priority
                    </span>
                    <span className="text-xs text-gray-600">
                      {(selectedInsight.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInsight(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <p className="text-gray-700 mb-4">{selectedInsight.description}</p>
              
              {selectedInsight.data && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Technical Details:</h3>
                  <pre className="text-xs text-gray-600 overflow-x-auto">
                    {JSON.stringify(selectedInsight.data, null, 2)}
                  </pre>
                </div>
              )}
              
              {selectedInsight.actionable && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
                    <h3 className="font-medium text-blue-900">Recommended Actions</h3>
                  </div>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Investigate the underlying cause of this pattern</li>
                    <li>• Set up monitoring alerts for similar occurrences</li>
                    <li>• Consider adjusting your strategy based on this insight</li>
                  </ul>
                </div>
              )}
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedInsight(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Export Insight
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default InsightsDashboard;