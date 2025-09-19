import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  BarChart3, 
  Calendar,
  Download,
  Share2,
  Clock,
  Globe,
  Activity,
  Target,
  ArrowUp,
  ArrowDown,
  Filter,
  RefreshCw,
  PieChart,
  LineChart
} from 'lucide-react';
import { TreemapChart, WaterfallChart, GaugeChart } from '../components/Charts';

interface MetricCard {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface DashboardMetric {
  name: string;
  views: number;
  uniqueVisitors: number;
  avgTimeSpent: string;
  lastViewed: string;
  shareCount: number;
}

const Analytics: React.FC = () => {
  const { actualTheme } = useTheme();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'users' | 'engagement'>('views');

  const metricsData: MetricCard[] = [
    {
      title: 'Total Views',
      value: '24,847',
      change: 12.5,
      changeType: 'increase',
      icon: Eye,
      color: 'blue'
    },
    {
      title: 'Unique Visitors',
      value: '8,239',
      change: 8.2,
      changeType: 'increase',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Active Dashboards',
      value: '47',
      change: -2.1,
      changeType: 'decrease',
      icon: BarChart3,
      color: 'purple'
    },
    {
      title: 'Avg. Session Duration',
      value: '4m 32s',
      change: 15.3,
      changeType: 'increase',
      icon: Clock,
      color: 'orange'
    },
    {
      title: 'Shares This Month',
      value: '156',
      change: 23.7,
      changeType: 'increase',
      icon: Share2,
      color: 'pink'
    },
    {
      title: 'Downloads',
      value: '892',
      change: 5.8,
      changeType: 'increase',
      icon: Download,
      color: 'cyan'
    }
  ];

  const dashboardMetrics: DashboardMetric[] = [
    {
      name: 'Sales Performance Q4',
      views: 4567,
      uniqueVisitors: 1234,
      avgTimeSpent: '6m 45s',
      lastViewed: '2 hours ago',
      shareCount: 23
    },
    {
      name: 'Marketing Analytics',
      views: 3421,
      uniqueVisitors: 987,
      avgTimeSpent: '4m 12s',
      lastViewed: '5 hours ago',
      shareCount: 18
    },
    {
      name: 'Customer Insights',
      views: 2890,
      uniqueVisitors: 756,
      avgTimeSpent: '3m 56s',
      lastViewed: '1 day ago',
      shareCount: 15
    },
    {
      name: 'Financial Overview',
      views: 2134,
      uniqueVisitors: 612,
      avgTimeSpent: '5m 23s',
      lastViewed: '3 hours ago',
      shareCount: 31
    },
    {
      name: 'Operations Dashboard',
      views: 1876,
      uniqueVisitors: 445,
      avgTimeSpent: '2m 48s',
      lastViewed: '6 hours ago',
      shareCount: 9
    }
  ];

  // Sample data for charts
  const viewsData = [
    { date: '2024-01-01', views: 1200 },
    { date: '2024-01-02', views: 1350 },
    { date: '2024-01-03', views: 1100 },
    { date: '2024-01-04', views: 1500 },
    { date: '2024-01-05', views: 1750 },
    { date: '2024-01-06', views: 1400 },
    { date: '2024-01-07', views: 1600 }
  ];

  const categoryData = {
    name: 'Dashboard Categories',
    value: 0,
    children: [
      {
        name: 'Sales',
        value: 4567,
        category: 'Sales',
        children: [
          { name: 'Q4 Performance', value: 2800, category: 'Sales' },
          { name: 'Revenue Tracking', value: 1767, category: 'Sales' }
        ]
      },
      {
        name: 'Marketing',
        value: 3421,
        category: 'Marketing',
        children: [
          { name: 'Campaign Analytics', value: 2100, category: 'Marketing' },
          { name: 'Social Media', value: 1321, category: 'Marketing' }
        ]
      },
      {
        name: 'Finance',
        value: 2890,
        category: 'Finance',
        children: [
          { name: 'Budget Overview', value: 1590, category: 'Finance' },
          { name: 'Expense Tracking', value: 1300, category: 'Finance' }
        ]
      },
      {
        name: 'Operations',
        value: 1876,
        category: 'Operations',
        children: [
          { name: 'Process Metrics', value: 1200, category: 'Operations' },
          { name: 'Efficiency Dashboard', value: 676, category: 'Operations' }
        ]
      }
    ]
  };

  const engagementData = [
    { label: 'Initial Views', value: 10000, type: 'total' as const },
    { label: 'Bounced Users', value: -2500, type: 'negative' as const },
    { label: 'Engaged Users', value: 7500, type: 'subtotal' as const },
    { label: 'Shared Content', value: 1200, type: 'positive' as const },
    { label: 'Downloaded', value: 800, type: 'positive' as const },
    { label: 'Final Engagement', value: 9500, type: 'total' as const }
  ];

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
      case '1y': return 'Last year';
      default: return 'Last 30 days';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className={`text-3xl font-bold ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Analytics</h1>
          <p className={`mt-1 ${
            actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>Track your dashboard performance and user engagement</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className={`px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              actualTheme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className={`flex items-center px-3 py-2 text-sm border rounded-lg transition-colors ${
            actualTheme === 'dark'
              ? 'border-gray-600 text-gray-200 hover:bg-gray-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metricsData.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-lg p-4 shadow-sm border transition-colors ${
              actualTheme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${
                actualTheme === 'dark' ? 'bg-gray-700' : `bg-${metric.color}-50`
              }`}>
                <metric.icon className={`h-4 w-4 ${
                  actualTheme === 'dark' ? 'text-blue-400' : `text-${metric.color}-600`
                }`} />
              </div>
              <div className={`flex items-center text-xs font-medium ${
                metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.changeType === 'increase' ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {metric.change}%
              </div>
            </div>
            <div>
              <h3 className={`text-2xl font-bold mb-1 ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{metric.value}</h3>
              <p className={`text-sm ${
                actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>{metric.title}</p>
              <p className={`text-xs mt-1 ${
                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>{getTimeRangeLabel(timeRange)}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Score Gauge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-lg shadow-sm border p-6 transition-colors ${
            actualTheme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-lg font-semibold ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Overall Performance</h2>
              <p className={`text-sm ${
                actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>Your dashboard engagement score</p>
            </div>
          </div>
          <div className="flex justify-center overflow-hidden">
            <div className="w-full max-w-sm">
              <GaugeChart
                value={87}
                min={0}
                max={100}
                width={280}
                height={180}
                unit="%"
                thresholds={[
                  { min: 0, max: 40, color: '#EF4444', label: 'Poor' },
                  { min: 40, max: 70, color: '#F59E0B', label: 'Fair' },
                  { min: 70, max: 90, color: '#10B981', label: 'Good' },
                  { min: 90, max: 100, color: '#059669', label: 'Excellent' }
                ]}
              />
            </div>
          </div>
        </motion.div>

        {/* Top Dashboards Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-lg shadow-sm border p-6 transition-colors ${
            actualTheme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-lg font-semibold ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Top Performing Dashboards</h2>
              <p className={`text-sm ${
                actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>Most viewed dashboards this month</p>
            </div>
          </div>
          <div className="space-y-4">
            {dashboardMetrics.slice(0, 5).map((dashboard, index) => (
              <div key={dashboard.name} className={`flex items-center justify-between p-3 rounded-lg ${
                actualTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                    actualTheme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'
                  }`}>
                    <span className={`text-sm font-semibold ${
                      actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                    }`}>{index + 1}</span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${
                      actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{dashboard.name}</h4>
                    <p className={`text-xs ${
                      actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>Avg. time: {dashboard.avgTimeSpent}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${
                    actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {dashboard.views.toLocaleString()} views
                  </p>
                  <p className={`text-xs ${
                    actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {dashboard.uniqueVisitors.toLocaleString()} unique
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Detailed Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Treemap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`rounded-lg shadow-sm border p-6 transition-colors ${
            actualTheme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-lg font-semibold ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Views by Category</h2>
              <p className={`text-sm ${
                actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>Dashboard views distributed by category</p>
            </div>
          </div>
          <div className="flex justify-center">
            <TreemapChart
              data={categoryData}
              width={400}
              height={300}
              colorScheme={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']}
            />
          </div>
        </motion.div>

        {/* User Engagement Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`rounded-lg shadow-sm border p-6 transition-colors ${
            actualTheme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-lg font-semibold ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>User Engagement Funnel</h2>
              <p className={`text-sm ${
                actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>Track user journey from view to action</p>
            </div>
          </div>
          <div className="flex justify-center">
            <WaterfallChart
              data={engagementData}
              width={400}
              height={300}
              colors={{
                positive: '#10B981',
                negative: '#EF4444',
                total: '#3B82F6',
                subtotal: '#8B5CF6'
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Detailed Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`rounded-lg shadow-sm border p-6 transition-colors ${
          actualTheme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-lg font-semibold ${
              actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Detailed Dashboard Analytics</h2>
            <p className={`text-sm ${
              actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>Performance metrics for all your dashboards</p>
          </div>
          <button className={`flex items-center px-3 py-2 text-sm border rounded-lg transition-colors ${
            actualTheme === 'dark'
              ? 'border-gray-600 text-gray-200 hover:bg-gray-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${
                actualTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <th className={`text-left py-3 px-4 font-medium ${
                  actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Dashboard Name</th>
                <th className={`text-left py-3 px-4 font-medium ${
                  actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Views</th>
                <th className={`text-left py-3 px-4 font-medium ${
                  actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Unique Visitors</th>
                <th className={`text-left py-3 px-4 font-medium ${
                  actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Avg. Time</th>
                <th className={`text-left py-3 px-4 font-medium ${
                  actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Shares</th>
                <th className={`text-left py-3 px-4 font-medium ${
                  actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Last Viewed</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              actualTheme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
            }`}>
              {dashboardMetrics.map((dashboard, index) => (
                <motion.tr
                  key={dashboard.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className={`transition-colors ${
                    actualTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        actualTheme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'
                      }`}>
                        <BarChart3 className={`h-4 w-4 ${
                          actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                        }`} />
                      </div>
                      <span className={`font-medium ${
                        actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{dashboard.name}</span>
                    </div>
                  </td>
                  <td className={`py-3 px-4 ${
                    actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                  }`}>{dashboard.views.toLocaleString()}</td>
                  <td className={`py-3 px-4 ${
                    actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                  }`}>{dashboard.uniqueVisitors.toLocaleString()}</td>
                  <td className={`py-3 px-4 ${
                    actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                  }`}>{dashboard.avgTimeSpent}</td>
                  <td className={`py-3 px-4 ${
                    actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                  }`}>{dashboard.shareCount}</td>
                  <td className={`py-3 px-4 ${
                    actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>{dashboard.lastViewed}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Insights and Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={`rounded-lg p-6 border transition-colors ${
          actualTheme === 'dark'
            ? 'bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-blue-700'
            : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
        }`}
      >
        <div className="flex items-start space-x-4">
          <div className={`p-2 rounded-lg ${
            actualTheme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'
          }`}>
            <Target className={`h-5 w-5 ${
              actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-600'
            }`} />
          </div>
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${
              actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Insights & Recommendations</h3>
            <div className={`space-y-2 text-sm ${
              actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <p>• Your <strong>Sales Performance Q4</strong> dashboard is your top performer with 4,567 views</p>
              <p>• User engagement has increased by <strong>12.5%</strong> compared to last month</p>
              <p>• Consider promoting your <strong>Customer Insights</strong> dashboard as it has high engagement but lower visibility</p>
              <p>• Peak viewing hours are between <strong>9 AM - 11 AM</strong> and <strong>2 PM - 4 PM</strong></p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;