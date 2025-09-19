import React from 'react';
import { motion } from 'framer-motion';
import { TreemapChart, WaterfallChart, GaugeChart } from '../components/Charts';
import { ArrowLeft } from 'lucide-react';

const ChartsDemo: React.FC = () => {
  // Sample data for treemap
  const treemapData = {
    name: "Sales",
    value: 0,
    children: [
      {
        name: "Technology",
        value: 450000,
        category: "Technology",
        children: [
          { name: "Laptops", value: 200000, category: "Technology" },
          { name: "Phones", value: 150000, category: "Technology" },
          { name: "Tablets", value: 100000, category: "Technology" }
        ]
      },
      {
        name: "Clothing",
        value: 320000,
        category: "Clothing",
        children: [
          { name: "Men's Wear", value: 180000, category: "Clothing" },
          { name: "Women's Wear", value: 140000, category: "Clothing" }
        ]
      },
      {
        name: "Home & Garden",
        value: 280000,
        category: "Home & Garden",
        children: [
          { name: "Furniture", value: 150000, category: "Home & Garden" },
          { name: "Appliances", value: 80000, category: "Home & Garden" },
          { name: "Garden Tools", value: 50000, category: "Home & Garden" }
        ]
      },
      {
        name: "Sports",
        value: 180000,
        category: "Sports",
        children: [
          { name: "Equipment", value: 120000, category: "Sports" },
          { name: "Apparel", value: 60000, category: "Sports" }
        ]
      }
    ]
  };

  // Sample data for waterfall chart
  const waterfallData = [
    { label: 'Starting Revenue', value: 100000, type: 'total' as const },
    { label: 'New Sales', value: 25000, type: 'positive' as const },
    { label: 'Upsells', value: 15000, type: 'positive' as const },
    { label: 'Refunds', value: -8000, type: 'negative' as const },
    { label: 'Q1 Total', value: 132000, type: 'subtotal' as const },
    { label: 'Marketing', value: -12000, type: 'negative' as const },
    { label: 'Operations', value: -18000, type: 'negative' as const },
    { label: 'Final Profit', value: 102000, type: 'total' as const }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Advanced Charts Demo</h1>
            <p className="text-sm text-gray-600">Treemap, Waterfall, and Gauge chart examples</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Treemap Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Treemap Chart</h2>
            <p className="text-sm text-gray-600 mt-1">
              Hierarchical visualization showing sales by category and product
            </p>
          </div>
          <div className="p-6">
            <div className="flex justify-center">
              <TreemapChart
                data={treemapData}
                width={800}
                height={400}
                colorScheme={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']}
              />
            </div>
          </div>
        </motion.div>

        {/* Waterfall Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Waterfall Chart</h2>
            <p className="text-sm text-gray-600 mt-1">
              Step-by-step breakdown of revenue changes and profit analysis
            </p>
          </div>
          <div className="p-6">
            <div className="flex justify-center">
              <WaterfallChart
                data={waterfallData}
                width={800}
                height={400}
                colors={{
                  positive: '#10B981',
                  negative: '#EF4444',
                  total: '#3B82F6',
                  subtotal: '#8B5CF6'
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Gauges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Gauge Charts</h2>
            <p className="text-sm text-gray-600 mt-1">
              Performance indicators with customizable thresholds and styling
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Performance Score */}
              <div className="flex flex-col items-center">
                <GaugeChart
                  value={85}
                  min={0}
                  max={100}
                  title="Performance Score"
                  width={250}
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

              {/* Customer Satisfaction */}
              <div className="flex flex-col items-center">
                <GaugeChart
                  value={7.8}
                  min={0}
                  max={10}
                  title="Customer Satisfaction"
                  width={250}
                  height={180}
                  unit="/10"
                  thresholds={[
                    { min: 0, max: 4, color: '#EF4444', label: 'Low' },
                    { min: 4, max: 7, color: '#F59E0B', label: 'Medium' },
                    { min: 7, max: 10, color: '#10B981', label: 'High' }
                  ]}
                />
              </div>

              {/* System Load */}
              <div className="flex flex-col items-center">
                <GaugeChart
                  value={42}
                  min={0}
                  max={100}
                  title="System Load"
                  width={250}
                  height={180}
                  unit="%"
                  thresholds={[
                    { min: 0, max: 50, color: '#10B981', label: 'Normal' },
                    { min: 50, max: 80, color: '#F59E0B', label: 'High' },
                    { min: 80, max: 100, color: '#EF4444', label: 'Critical' }
                  ]}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Chart Features</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Treemap Chart</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Hierarchical data visualization</li>
                  <li>• Interactive tooltips</li>
                  <li>• Customizable color schemes</li>
                  <li>• Responsive sizing</li>
                  <li>• Category-based coloring</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Waterfall Chart</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Step-by-step value changes</li>
                  <li>• Connecting lines between bars</li>
                  <li>• Support for positive/negative values</li>
                  <li>• Subtotal and total calculations</li>
                  <li>• Grid lines and axis labels</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Gauge Chart</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Customizable thresholds</li>
                  <li>• Color-coded performance zones</li>
                  <li>• Animated needle indicator</li>
                  <li>• Configurable min/max values</li>
                  <li>• Legend and value display</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChartsDemo;