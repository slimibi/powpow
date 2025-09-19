import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Plus, Search, Filter, Grid, List, Edit, Trash2, MoreVertical, Eye } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useDashboard } from '../contexts/DashboardContext';
import CreateDashboardModal from '../components/Dashboard/CreateDashboardModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Dashboards: React.FC = () => {
  const { actualTheme } = useTheme();
  const { dashboards, createDashboard, deleteDashboard, loading } = useDashboard();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showCreateModal, setShowCreateModal] = React.useState(false);


  const filteredDashboards = dashboards.filter(dashboard =>
    dashboard.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dashboard.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDashboard = async (dashboardData: any) => {
    try {
      const newDashboard = await createDashboard(dashboardData);
      toast.success('Dashboard created successfully!');
      setShowCreateModal(false);
      // Optionally navigate to the new dashboard
      // navigate(`/dashboards/${newDashboard.id}`);
    } catch (error) {
      toast.error('Failed to create dashboard');
    }
  };

  const handleDeleteDashboard = async (dashboardId: string, dashboardName: string) => {
    if (window.confirm(`Are you sure you want to delete "${dashboardName}"? This action cannot be undone.`)) {
      try {
        await deleteDashboard(dashboardId);
        toast.success('Dashboard deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete dashboard');
      }
    }
  };

  const handleEditDashboard = (dashboardId: string) => {
    navigate(`/dashboards/${dashboardId}`);
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
          }`}>My Dashboards</h1>
          <p className={`mt-1 ${
            actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>Manage and organize your data visualizations</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Dashboard
        </motion.button>
      </motion.div>

      {/* Filters and Search */}
      <div className={`flex items-center justify-between rounded-lg p-4 shadow-card ${
        actualTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dashboards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 w-80 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                actualTheme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
          <button className={`flex items-center px-3 py-2 text-sm border rounded-lg transition-colors ${
            actualTheme === 'dark'
              ? 'border-gray-600 text-gray-200 hover:bg-gray-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
        
        <div className={`flex items-center space-x-2 rounded-lg p-1 ${
          actualTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' 
                ? actualTheme === 'dark' ? 'bg-gray-600 text-blue-400 shadow-sm' : 'bg-white text-blue-600 shadow-sm'
                : actualTheme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' 
                ? actualTheme === 'dark' ? 'bg-gray-600 text-blue-400 shadow-sm' : 'bg-white text-blue-600 shadow-sm'
                : actualTheme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Dashboard Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDashboards.map((dashboard, index) => (
            <motion.div
              key={dashboard.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-lg shadow-card hover:shadow-card-hover transition-all cursor-pointer group relative ${
                actualTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="p-4">
                {/* Action Menu */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="relative">
                    <button className={`p-1 rounded-md transition-colors ${
                      actualTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}>
                      <MoreVertical className={`h-4 w-4 ${
                        actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`} />
                    </button>
                    {/* Dropdown would go here */}
                  </div>
                </div>

                <div className={`aspect-video rounded-lg mb-4 flex items-center justify-center ${
                  actualTheme === 'dark' 
                    ? 'bg-gradient-to-br from-gray-700 to-gray-800' 
                    : 'bg-gradient-to-br from-blue-50 to-indigo-100'
                }`}>
                  <BarChart3 className={`h-12 w-12 ${
                    actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className={`text-lg font-semibold transition-colors ${
                      actualTheme === 'dark' 
                        ? 'text-white group-hover:text-blue-400' 
                        : 'text-gray-900 group-hover:text-blue-600'
                    }`}>
                      {dashboard.name}
                    </h3>
                    {dashboard.isPublic && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        actualTheme === 'dark' 
                          ? 'bg-green-900 text-green-300' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        Public
                      </span>
                    )}
                  </div>
                  
                  <p className={`text-sm line-clamp-2 ${
                    actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {dashboard.description}
                  </p>
                  
                  <div className={`flex items-center justify-between pt-2 text-xs ${
                    actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <span>Modified {dashboard.lastModified}</span>
                    <div className="flex items-center space-x-3">
                      <span>{dashboard.charts} charts</span>
                      <span>{dashboard.views} views</span>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex items-center space-x-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditDashboard(dashboard.id);
                      }}
                      className={`flex items-center px-2 py-1 text-xs rounded transition-colors ${
                        actualTheme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDashboard(dashboard.id, dashboard.name);
                      }}
                      className={`flex items-center px-2 py-1 text-xs rounded transition-colors ${
                        actualTheme === 'dark'
                          ? 'text-red-400 hover:bg-red-900/20'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className={`rounded-lg shadow-card overflow-hidden ${
          actualTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className={`px-6 py-3 border-b ${
            actualTheme === 'dark' 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className={`grid grid-cols-12 gap-4 text-sm font-medium ${
              actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <div className="col-span-5">Name</div>
              <div className="col-span-2">Charts</div>
              <div className="col-span-2">Views</div>
              <div className="col-span-2">Modified</div>
              <div className="col-span-1">Status</div>
            </div>
          </div>
          <div className={`divide-y ${
            actualTheme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
          }`}>
            {filteredDashboards.map((dashboard, index) => (
              <motion.div
                key={dashboard.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`px-6 py-4 cursor-pointer transition-colors ${
                  actualTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        actualTheme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'
                      }`}>
                        <BarChart3 className={`h-4 w-4 ${
                          actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className={`font-medium ${
                          actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{dashboard.name}</h3>
                        <p className={`text-sm ${
                          actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>{dashboard.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className={`col-span-2 text-sm ${
                    actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                  }`}>{dashboard.charts}</div>
                  <div className={`col-span-2 text-sm ${
                    actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                  }`}>{dashboard.views}</div>
                  <div className={`col-span-2 text-sm ${
                    actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>{dashboard.lastModified}</div>
                  <div className="col-span-1">
                    {dashboard.isPublic ? (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        actualTheme === 'dark' 
                          ? 'bg-green-900 text-green-300' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        Public
                      </span>
                    ) : (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        actualTheme === 'dark' 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        Private
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {filteredDashboards.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No dashboards found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? `No dashboards match "${searchQuery}"` : 'Get started by creating your first dashboard'}
          </p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Dashboard
          </button>
        </div>
      )}

      {/* Create Dashboard Modal */}
      <CreateDashboardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateDashboard}
      />
    </div>
  );
};

export default Dashboards;