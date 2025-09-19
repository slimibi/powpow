import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  BarChart3, 
  Users, 
  Database, 
  TrendingUp, 
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { actualTheme } = useTheme();
  const stats = [
    {
      name: 'Total Dashboards',
      value: '12',
      change: '+2.1%',
      changeType: 'increase',
      icon: BarChart3,
    },
    {
      name: 'Data Sources',
      value: '8',
      change: '+4.2%',
      changeType: 'increase',
      icon: Database,
    },
    {
      name: 'Team Members',
      value: '24',
      change: '+1.5%',
      changeType: 'increase',
      icon: Users,
    },
    {
      name: 'Total Views',
      value: '1,234',
      change: '+12.3%',
      changeType: 'increase',
      icon: TrendingUp,
    },
  ];

  const recentDashboards = [
    { id: 1, name: 'Sales Performance Q4', lastModified: '2 hours ago', views: 156 },
    { id: 2, name: 'Marketing Analytics', lastModified: '5 hours ago', views: 89 },
    { id: 3, name: 'Customer Insights', lastModified: '1 day ago', views: 234 },
    { id: 4, name: 'Financial Overview', lastModified: '2 days ago', views: 167 },
  ];

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
          }`}>Dashboard Overview</h1>
          <p className={`mt-1 ${
            actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>Welcome back! Here's what's happening with your data.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Dashboard
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow ${
              actualTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${
                actualTheme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'
              }`}>
                <stat.icon className={`h-6 w-6 ${
                  actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                }`} />
              </div>
            </div>
            <div className="mt-4">
              <h3 className={`text-lg font-semibold ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{stat.value}</h3>
              <p className={`text-sm ${
                actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>{stat.name}</p>
            </div>
            <div className="mt-2 flex items-center text-sm">
              {stat.changeType === 'increase' ? (
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}>
                {stat.change}
              </span>
              <span className={`ml-1 ${
                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>from last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Dashboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-lg p-6 shadow-card ${
            actualTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${
              actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Recent Dashboards</h2>
            <button className={`text-sm font-medium ${
              actualTheme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
            }`}>
              View all
            </button>
          </div>
          <div className="space-y-3">
            {recentDashboards.map((dashboard) => (
              <div key={dashboard.id} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                actualTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    actualTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <BarChart3 className={`h-4 w-4 ${
                      actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <p className={`font-medium ${
                      actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{dashboard.name}</p>
                    <p className={`text-sm ${
                      actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>Modified {dashboard.lastModified}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{dashboard.views}</p>
                  <p className={`text-xs ${
                    actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>views</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-lg p-6 shadow-card ${
            actualTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${
              actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Quick Actions</h2>
          </div>
          <div className="space-y-3">
            <button className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors text-left ${
              actualTheme === 'dark'
                ? 'border-gray-600 hover:bg-gray-700'
                : 'border-gray-200 hover:bg-gray-50'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  actualTheme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'
                }`}>
                  <Plus className={`h-4 w-4 ${
                    actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <p className={`font-medium ${
                    actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Create New Dashboard</p>
                  <p className={`text-sm ${
                    actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>Start building from scratch</p>
                </div>
              </div>
              <ArrowUpRight className={`h-4 w-4 ${
                actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-400'
              }`} />
            </button>

            <button className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors text-left ${
              actualTheme === 'dark'
                ? 'border-gray-600 hover:bg-gray-700'
                : 'border-gray-200 hover:bg-gray-50'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  actualTheme === 'dark' ? 'bg-green-900' : 'bg-green-50'
                }`}>
                  <Database className={`h-4 w-4 ${
                    actualTheme === 'dark' ? 'text-green-300' : 'text-green-600'
                  }`} />
                </div>
                <div>
                  <p className={`font-medium ${
                    actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Upload Data Source</p>
                  <p className={`text-sm ${
                    actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>Import CSV, Excel, or connect to API</p>
                </div>
              </div>
              <ArrowUpRight className={`h-4 w-4 ${
                actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-400'
              }`} />
            </button>

            <button className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors text-left ${
              actualTheme === 'dark'
                ? 'border-gray-600 hover:bg-gray-700'
                : 'border-gray-200 hover:bg-gray-50'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  actualTheme === 'dark' ? 'bg-purple-900' : 'bg-purple-50'
                }`}>
                  <Users className={`h-4 w-4 ${
                    actualTheme === 'dark' ? 'text-purple-300' : 'text-purple-600'
                  }`} />
                </div>
                <div>
                  <p className={`font-medium ${
                    actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Invite Team Members</p>
                  <p className={`text-sm ${
                    actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>Collaborate on dashboards</p>
                </div>
              </div>
              <ArrowUpRight className={`h-4 w-4 ${
                actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-400'
              }`} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;