import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Share2, 
  Calendar,
  User,
  Clock,
  Eye,
  EyeOff,
  Star,
  MessageSquare,
  Download,
  ExternalLink,
  Users,
  Shield,
  AlertCircle
} from 'lucide-react';

interface SharedDashboard {
  id: number;
  name: string;
  description: string;
  owner: {
    name: string;
    avatar: string;
    email: string;
  };
  sharedDate: string;
  lastViewed?: string;
  permission: 'view' | 'edit' | 'comment';
  views: number;
  isStarred: boolean;
  hasComments: boolean;
  category: string;
  tags: string[];
  thumbnail?: string;
}

const SharedWithMe: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPermission, setFilterPermission] = useState<'all' | 'view' | 'edit' | 'comment'>('all');
  const [sortBy, setSortBy] = useState<'shared' | 'viewed' | 'name' | 'owner'>('shared');

  const sharedDashboards: SharedDashboard[] = [
    {
      id: 1,
      name: 'Q4 Sales Performance',
      description: 'Quarterly sales metrics and team performance analysis',
      owner: {
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/40/40',
        email: 'sarah.johnson@company.com'
      },
      sharedDate: '2024-01-15T10:30:00Z',
      lastViewed: '2024-01-16T14:20:00Z',
      permission: 'edit',
      views: 24,
      isStarred: true,
      hasComments: true,
      category: 'Sales',
      tags: ['quarterly', 'performance', 'sales'],
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: 2,
      name: 'Marketing Campaign Analytics',
      description: 'ROI analysis and campaign performance metrics',
      owner: {
        name: 'Mike Chen',
        avatar: '/api/placeholder/40/40',
        email: 'mike.chen@company.com'
      },
      sharedDate: '2024-01-12T09:15:00Z',
      lastViewed: '2024-01-14T16:45:00Z',
      permission: 'view',
      views: 18,
      isStarred: false,
      hasComments: false,
      category: 'Marketing',
      tags: ['campaigns', 'roi', 'analytics'],
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: 3,
      name: 'Customer Satisfaction Metrics',
      description: 'Customer feedback analysis and satisfaction scores',
      owner: {
        name: 'Emily Rodriguez',
        avatar: '/api/placeholder/40/40',
        email: 'emily.rodriguez@company.com'
      },
      sharedDate: '2024-01-10T11:22:00Z',
      permission: 'comment',
      views: 32,
      isStarred: false,
      hasComments: true,
      category: 'Customer Service',
      tags: ['satisfaction', 'feedback', 'metrics'],
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: 4,
      name: 'Financial Health Dashboard',
      description: 'Revenue, expenses, and financial KPIs overview',
      owner: {
        name: 'David Park',
        avatar: '/api/placeholder/40/40',
        email: 'david.park@company.com'
      },
      sharedDate: '2024-01-08T13:45:00Z',
      lastViewed: '2024-01-15T10:30:00Z',
      permission: 'view',
      views: 45,
      isStarred: true,
      hasComments: false,
      category: 'Finance',
      tags: ['revenue', 'expenses', 'kpis'],
      thumbnail: '/api/placeholder/300/200'
    }
  ];

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'edit': return <Shield className="h-4 w-4 text-green-600" />;
      case 'comment': return <MessageSquare className="h-4 w-4 text-yellow-600" />;
      default: return <Eye className="h-4 w-4 text-blue-600" />;
    }
  };

  const getPermissionText = (permission: string) => {
    switch (permission) {
      case 'edit': return 'Can Edit';
      case 'comment': return 'Can Comment';
      default: return 'View Only';
    }
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'edit': return 'bg-green-100 text-green-800';
      case 'comment': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const filteredDashboards = sharedDashboards
    .filter(dashboard => {
      const matchesSearch = dashboard.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           dashboard.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           dashboard.owner.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPermission = filterPermission === 'all' || dashboard.permission === filterPermission;
      return matchesSearch && matchesPermission;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'shared': return new Date(b.sharedDate).getTime() - new Date(a.sharedDate).getTime();
        case 'viewed': 
          if (!a.lastViewed && !b.lastViewed) return 0;
          if (!a.lastViewed) return 1;
          if (!b.lastViewed) return -1;
          return new Date(b.lastViewed).getTime() - new Date(a.lastViewed).getTime();
        case 'name': return a.name.localeCompare(b.name);
        case 'owner': return a.owner.name.localeCompare(b.owner.name);
        default: return 0;
      }
    });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shared with Me</h1>
          <p className="text-gray-600 mt-1">Dashboards that others have shared with you</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Share2 className="h-4 w-4" />
          <span>{filteredDashboards.length} dashboards shared</span>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search shared dashboards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterPermission}
              onChange={(e) => setFilterPermission(e.target.value as any)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Permissions</option>
              <option value="view">View Only</option>
              <option value="comment">Can Comment</option>
              <option value="edit">Can Edit</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="shared">Date Shared</option>
              <option value="viewed">Last Viewed</option>
              <option value="name">Name</option>
              <option value="owner">Owner</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDashboards.map((dashboard, index) => (
            <motion.div
              key={dashboard.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ExternalLink className="h-6 w-6 text-white" />
                </div>
                <div className="absolute top-3 right-3 flex items-center space-x-1">
                  {dashboard.isStarred && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                  {dashboard.hasComments && (
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {dashboard.name}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPermissionColor(dashboard.permission)}`}>
                    {getPermissionIcon(dashboard.permission)}
                    <span className="ml-1">{getPermissionText(dashboard.permission)}</span>
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {dashboard.description}
                </p>

                {/* Owner Info */}
                <div className="flex items-center mb-3">
                  <img
                    src={dashboard.owner.avatar}
                    alt={dashboard.owner.name}
                    className="h-6 w-6 rounded-full mr-2"
                  />
                  <span className="text-sm text-gray-700">{dashboard.owner.name}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {getRelativeTime(dashboard.sharedDate)}
                    </span>
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {dashboard.views}
                    </span>
                  </div>
                  {dashboard.lastViewed && (
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Viewed {getRelativeTime(dashboard.lastViewed)}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-4">Dashboard</div>
              <div className="col-span-2">Owner</div>
              <div className="col-span-2">Permission</div>
              <div className="col-span-2">Shared</div>
              <div className="col-span-1">Views</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredDashboards.map((dashboard, index) => (
              <motion.div
                key={dashboard.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Share2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 truncate">{dashboard.name}</h3>
                          {dashboard.isStarred && (
                            <Star className="h-3 w-3 text-yellow-500 fill-current flex-shrink-0" />
                          )}
                          {dashboard.hasComments && (
                            <MessageSquare className="h-3 w-3 text-blue-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{dashboard.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <img
                        src={dashboard.owner.avatar}
                        alt={dashboard.owner.name}
                        className="h-6 w-6 rounded-full"
                      />
                      <span className="text-sm text-gray-900">{dashboard.owner.name}</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPermissionColor(dashboard.permission)}`}>
                      {getPermissionIcon(dashboard.permission)}
                      <span className="ml-1">{getPermissionText(dashboard.permission)}</span>
                    </span>
                  </div>
                  <div className="col-span-2 text-sm text-gray-600">
                    {getRelativeTime(dashboard.sharedDate)}
                  </div>
                  <div className="col-span-1 text-sm text-gray-900">{dashboard.views}</div>
                  <div className="col-span-1">
                    <div className="flex items-center space-x-1">
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {filteredDashboards.length === 0 && (
        <div className="text-center py-12">
          <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No shared dashboards found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? `No shared dashboards match "${searchQuery}"` : 'No dashboards have been shared with you yet'}
          </p>
        </div>
      )}
    </div>
  );
};

export default SharedWithMe;