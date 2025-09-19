import React from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Download, 
  Share2, 
  Settings, 
  Plus,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Map,
  TreePine,
  TrendingUp,
  Gauge
} from 'lucide-react';

const DashboardBuilder: React.FC = () => {
  const [selectedTool, setSelectedTool] = React.useState<string | null>(null);

  const chartTypes = [
    { id: 'bar', name: 'Bar Chart', icon: BarChart3, color: 'blue' },
    { id: 'line', name: 'Line Chart', icon: LineChart, color: 'green' },
    { id: 'pie', name: 'Pie Chart', icon: PieChart, color: 'purple' },
    { id: 'kpi', name: 'KPI Card', icon: Activity, color: 'orange' },
    { id: 'map', name: 'Map', icon: Map, color: 'red' },
    { id: 'treemap', name: 'Treemap', icon: TreePine, color: 'emerald' },
    { id: 'waterfall', name: 'Waterfall', icon: TrendingUp, color: 'cyan' },
    { id: 'gauge', name: 'Gauge', icon: Gauge, color: 'indigo' },
  ];

  const mockCharts = [
    { id: 1, type: 'bar', title: 'Sales by Region', x: 0, y: 0, w: 6, h: 4 },
    { id: 2, type: 'line', title: 'Revenue Trend', x: 6, y: 0, w: 6, h: 4 },
    { id: 3, type: 'kpi', title: 'Total Revenue', x: 0, y: 4, w: 3, h: 2 },
    { id: 4, type: 'pie', title: 'Customer Segments', x: 3, y: 4, w: 3, h: 4 },
    { id: 5, type: 'treemap', title: 'Product Categories', x: 6, y: 4, w: 6, h: 4 },
    { id: 6, type: 'waterfall', title: 'Profit Analysis', x: 0, y: 8, w: 6, h: 4 },
    { id: 7, type: 'gauge', title: 'Performance Score', x: 6, y: 8, w: 6, h: 4 },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Builder</h1>
            <p className="text-sm text-gray-600">Sales Performance Q4 - Last saved 2 minutes ago</p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </motion.button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Components</h2>
            <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
              {chartTypes.map((chart) => (
                <motion.button
                  key={chart.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTool(chart.id)}
                  className={`p-3 border-2 border-dashed rounded-lg text-center transition-colors ${
                    selectedTool === chart.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <chart.icon className={`h-6 w-6 mx-auto mb-2 text-${chart.color}-600`} />
                  <span className="text-xs font-medium text-gray-700">{chart.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex-1 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Data Sources</h3>
            <div className="space-y-2">
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">Sales Data Q4</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">15,420 records</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">Customer Demographics</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">8,950 records</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <button className="w-full flex items-center justify-center px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add Data Source
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-gray-50 p-6">
          <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 relative overflow-hidden">
            <div className="absolute inset-0 p-4">
              {/* Grid background */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />

              {/* Mock Charts */}
              {mockCharts.map((chart, index) => (
                <motion.div
                  key={chart.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="absolute bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-move"
                  style={{
                    left: `${(chart.x / 12) * 100}%`,
                    top: `${(chart.y / 8) * 100}%`,
                    width: `${(chart.w / 12) * 100}%`,
                    height: `${(chart.h / 8) * 100}%`,
                  }}
                >
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between p-3 border-b border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900">{chart.title}</h4>
                      <div className="flex items-center space-x-1">
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <Settings className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 p-4 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        {chart.type === 'bar' && <BarChart3 className="h-8 w-8 mx-auto mb-2" />}
                        {chart.type === 'line' && <LineChart className="h-8 w-8 mx-auto mb-2" />}
                        {chart.type === 'pie' && <PieChart className="h-8 w-8 mx-auto mb-2" />}
                        {chart.type === 'treemap' && <TreePine className="h-8 w-8 mx-auto mb-2" />}
                        {chart.type === 'waterfall' && <TrendingUp className="h-8 w-8 mx-auto mb-2" />}
                        {chart.type === 'gauge' && <Gauge className="h-8 w-8 mx-auto mb-2" />}
                        {chart.type === 'kpi' && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">$1.2M</div>
                            <div className="text-sm text-gray-600">+12.5% from last month</div>
                          </div>
                        )}
                        {chart.type !== 'kpi' && chart.type !== 'gauge' && (
                          <span className="text-xs">Chart Preview</span>
                        )}
                        {chart.type === 'gauge' && (
                          <div className="text-center">
                            <div className="text-xl font-bold text-indigo-600">85%</div>
                            <div className="text-xs text-gray-600">Performance</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Add Chart Placeholder */}
              {selectedTool && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-4 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50/50 flex items-center justify-center"
                >
                  <div className="text-center">
                    <Plus className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-blue-600 font-medium">Click to place your {selectedTool} chart</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBuilder;