import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Zap,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Settings,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  Monitor
} from 'lucide-react';
import { useRealTimeData, streamingService } from '../../services/realTimeStreaming';

interface RealTimeMetricCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  source: string;
  valueKey: string;
  format?: (value: any) => string;
  subtitle?: string;
}

const RealTimeMetricCard: React.FC<RealTimeMetricCardProps> = ({
  title,
  icon: Icon,
  color,
  source,
  valueKey,
  format = (v) => v?.toString() || '0',
  subtitle
}) => {
  const { data, isConnected, error } = useRealTimeData(source);
  const [previousValue, setPreviousValue] = useState<number>(0);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    if (data && data[valueKey] !== undefined) {
      const currentValue = parseFloat(data[valueKey]);
      if (previousValue !== 0) {
        if (currentValue > previousValue) setTrend('up');
        else if (currentValue < previousValue) setTrend('down');
        else setTrend('stable');
      }
      setPreviousValue(currentValue);
    }
  }, [data, valueKey, previousValue]);

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3" />;
      case 'down': return <TrendingDown className="h-3 w-3" />;
      default: return <div className="h-3 w-3" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 relative overflow-hidden"
    >
      {/* Connection Status Indicator */}
      <div className="absolute top-2 right-2">
        {error ? (
          <AlertCircle className="h-4 w-4 text-red-500" />
        ) : isConnected ? (
          <Wifi className="h-4 w-4 text-green-500" />
        ) : (
          <WifiOff className="h-4 w-4 text-gray-400" />
        )}
      </div>

      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg bg-${color}-50`}>
          <Icon className={`h-5 w-5 text-${color}-600`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-end space-x-2">
            <p className="text-2xl font-bold text-gray-900">
              {data ? format(data[valueKey]) : '---'}
            </p>
            <div className={`flex items-center ${getTrendColor()}`}>
              {getTrendIcon()}
            </div>
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Pulse animation for live updates */}
      {isConnected && data && (
        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-${color}-500`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        />
      )}
    </motion.div>
  );
};

interface LiveChartProps {
  title: string;
  source: string;
  dataKey: string;
  maxDataPoints?: number;
  color?: string;
}

const LiveChart: React.FC<LiveChartProps> = ({
  title,
  source,
  dataKey,
  maxDataPoints = 20,
  color = 'blue'
}) => {
  const { data, isConnected } = useRealTimeData(source);
  const [chartData, setChartData] = useState<{ time: string; value: number }[]>([]);

  useEffect(() => {
    if (data && data[dataKey] !== undefined) {
      const newPoint = {
        time: new Date().toLocaleTimeString(),
        value: parseFloat(data[dataKey])
      };
      
      setChartData(prev => {
        const updated = [...prev, newPoint];
        return updated.slice(-maxDataPoints);
      });
    }
  }, [data, dataKey, maxDataPoints]);

  const maxValue = Math.max(...chartData.map(d => d.value), 0) || 100;
  const minValue = Math.min(...chartData.map(d => d.value), 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">Live data stream</p>
        </div>
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              <span className="text-xs">Live</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
              <span className="text-xs">Disconnected</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-48 relative">
        {chartData.length > 0 ? (
          <svg className="w-full h-full" viewBox="0 0 400 200">
            <defs>
              <linearGradient id={`gradient-${source}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" className={`text-${color}-400`} stopOpacity="0.6" />
                <stop offset="100%" className={`text-${color}-400`} stopOpacity="0.1" />
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <line
                key={i}
                x1="0"
                y1={i * 40}
                x2="400"
                y2={i * 40}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            ))}

            {/* Line chart */}
            <polyline
              fill="none"
              stroke={color === 'blue' ? '#3b82f6' : color === 'green' ? '#10b981' : '#ef4444'}
              strokeWidth="2"
              points={chartData.map((point, index) => {
                const x = (index / (maxDataPoints - 1)) * 400;
                const y = 180 - ((point.value - minValue) / (maxValue - minValue)) * 160;
                return `${x},${y}`;
              }).join(' ')}
            />

            {/* Area fill */}
            <polygon
              fill={`url(#gradient-${source})`}
              points={`0,180 ${chartData.map((point, index) => {
                const x = (index / (maxDataPoints - 1)) * 400;
                const y = 180 - ((point.value - minValue) / (maxValue - minValue)) * 160;
                return `${x},${y}`;
              }).join(' ')} 400,180`}
            />

            {/* Data points */}
            {chartData.map((point, index) => {
              const x = (index / (maxDataPoints - 1)) * 400;
              const y = 180 - ((point.value - minValue) / (maxValue - minValue)) * 160;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="3"
                  fill={color === 'blue' ? '#3b82f6' : color === 'green' ? '#10b981' : '#ef4444'}
                  className="animate-pulse"
                />
              );
            })}
          </svg>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <Activity className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Waiting for data...</p>
            </div>
          </div>
        )}
      </div>

      {chartData.length > 0 && (
        <div className="mt-4 flex justify-between text-xs text-gray-500">
          <span>{chartData[0]?.time}</span>
          <span>Current: {chartData[chartData.length - 1]?.value.toFixed(2)}</span>
          <span>{chartData[chartData.length - 1]?.time}</span>
        </div>
      )}
    </motion.div>
  );
};

const RealTimeDashboard: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [activeStreams, setActiveStreams] = useState<string[]>([]);

  useEffect(() => {
    const updateActiveStreams = () => {
      setActiveStreams(streamingService.getActiveConnections());
    };

    // Update every second
    const interval = setInterval(updateActiveStreams, 1000);
    updateActiveStreams();

    return () => clearInterval(interval);
  }, []);

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    // In a real implementation, you would pause/resume the streams here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Real-Time Dashboard</h1>
            <p className="text-gray-600">Live data streams and monitoring</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              <span>{activeStreams.length} Active Streams</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePauseResume}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              isPaused
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-yellow-600 text-white hover:bg-yellow-700'
            }`}
          >
            {isPaused ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                Resume
              </>
            ) : (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            )}
          </motion.button>
          <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </button>
        </div>
      </motion.div>

      {/* Real-Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RealTimeMetricCard
          title="Revenue"
          icon={DollarSign}
          color="green"
          source="sales-metrics"
          valueKey="revenue"
          format={(v) => `$${parseFloat(v).toFixed(0)}`}
          subtitle="Per minute"
        />
        <RealTimeMetricCard
          title="Active Users"
          icon={Users}
          color="blue"
          source="user-activity"
          valueKey="active_users"
          format={(v) => parseFloat(v).toFixed(0)}
          subtitle="Currently online"
        />
        <RealTimeMetricCard
          title="Orders"
          icon={ShoppingCart}
          color="purple"
          source="sales-metrics"
          valueKey="orders"
          format={(v) => parseFloat(v).toFixed(0)}
          subtitle="Last 5 minutes"
        />
        <RealTimeMetricCard
          title="System Load"
          icon={Monitor}
          color="orange"
          source="system-metrics"
          valueKey="cpu_usage"
          format={(v) => `${parseFloat(v).toFixed(1)}%`}
          subtitle="CPU Usage"
        />
      </div>

      {/* Live Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveChart
          title="Revenue Stream"
          source="sales-metrics"
          dataKey="revenue"
          color="green"
        />
        <LiveChart
          title="Active Users"
          source="user-activity"
          dataKey="active_users"
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveChart
          title="System Performance"
          source="system-metrics"
          dataKey="cpu_usage"
          color="orange"
        />
        <LiveChart
          title="Page Views"
          source="user-activity"
          dataKey="page_views"
          color="purple"
        />
      </div>

      {/* Stream Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
      >
        <div className="flex items-center mb-4">
          <Activity className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Data Stream Status</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Sales Metrics', source: 'sales-metrics', status: 'connected' },
            { name: 'User Activity', source: 'user-activity', status: 'connected' },
            { name: 'System Metrics', source: 'system-metrics', status: 'connected' },
            { name: 'Financial Data', source: 'financial-data', status: 'connected' }
          ].map((stream, index) => (
            <div key={stream.source} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{stream.name}</p>
                <p className="text-sm text-gray-600">{stream.source}</p>
              </div>
              <div className="flex items-center">
                {activeStreams.includes(stream.source) ? (
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                    <span className="text-xs">Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                    <span className="text-xs">Disconnected</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Connection Quality Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Wifi className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Connection Quality: Excellent</p>
              <p className="text-sm text-gray-600">All streams operating normally • Latency: ~50ms</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-1 h-6 bg-green-500 rounded-full"></div>
            <div className="w-1 h-8 bg-green-500 rounded-full"></div>
            <div className="w-1 h-6 bg-green-500 rounded-full"></div>
            <div className="w-1 h-4 bg-green-300 rounded-full"></div>
            <div className="w-1 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RealTimeDashboard;