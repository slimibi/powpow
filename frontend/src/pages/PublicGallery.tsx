import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Globe, 
  Star,
  Eye,
  Download,
  Heart,
  MessageSquare,
  TrendingUp,
  Award,
  Users,
  Calendar,
  Tag,
  ExternalLink,
  Copy,
  Share2,
  Bookmark,
  Clock
} from 'lucide-react';

interface PublicDashboard {
  id: number;
  name: string;
  description: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  createdDate: string;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  downloads: number;
  rating: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isFeatured: boolean;
  thumbnail: string;
  previewImages: string[];
}

const PublicGallery: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'trending' | 'rating'>('popular');

  const categories = [
    { value: 'all', label: 'All Categories', count: 156 },
    { value: 'sales', label: 'Sales', count: 42 },
    { value: 'marketing', label: 'Marketing', count: 38 },
    { value: 'finance', label: 'Finance', count: 29 },
    { value: 'operations', label: 'Operations', count: 24 },
    { value: 'hr', label: 'Human Resources', count: 15 },
    { value: 'education', label: 'Education', count: 8 }
  ];

  const publicDashboards: PublicDashboard[] = [
    {
      id: 1,
      name: 'E-commerce Analytics Pro',
      description: 'Comprehensive e-commerce dashboard with sales, traffic, and conversion metrics. Perfect for online retailers looking to optimize their performance.',
      author: {
        name: 'Sarah Chen',
        avatar: '/api/placeholder/40/40',
        verified: true
      },
      createdDate: '2024-01-10T08:30:00Z',
      category: 'sales',
      tags: ['ecommerce', 'sales', 'conversion', 'analytics'],
      views: 2847,
      likes: 156,
      comments: 23,
      downloads: 89,
      rating: 4.8,
      isLiked: true,
      isBookmarked: false,
      isFeatured: true,
      thumbnail: '/api/placeholder/400/250',
      previewImages: ['/api/placeholder/200/150', '/api/placeholder/200/150', '/api/placeholder/200/150']
    },
    {
      id: 2,
      name: 'Social Media Marketing Hub',
      description: 'Track your social media performance across all platforms with engagement metrics, follower growth, and content analysis.',
      author: {
        name: 'Mike Rodriguez',
        avatar: '/api/placeholder/40/40',
        verified: false
      },
      createdDate: '2024-01-08T14:22:00Z',
      category: 'marketing',
      tags: ['social media', 'marketing', 'engagement', 'analytics'],
      views: 1934,
      likes: 92,
      comments: 18,
      downloads: 67,
      rating: 4.6,
      isLiked: false,
      isBookmarked: true,
      isFeatured: false,
      thumbnail: '/api/placeholder/400/250',
      previewImages: ['/api/placeholder/200/150', '/api/placeholder/200/150']
    },
    {
      id: 3,
      name: 'Financial KPI Dashboard',
      description: 'Monitor your companys financial health with key performance indicators, revenue tracking, and expense analysis.',
      author: {
        name: 'Emily Watson',
        avatar: '/api/placeholder/40/40',
        verified: true
      },
      createdDate: '2024-01-05T11:15:00Z',
      category: 'finance',
      tags: ['finance', 'kpi', 'revenue', 'expenses'],
      views: 3421,
      likes: 203,
      comments: 31,
      downloads: 124,
      rating: 4.9,
      isLiked: false,
      isBookmarked: false,
      isFeatured: true,
      thumbnail: '/api/placeholder/400/250',
      previewImages: ['/api/placeholder/200/150', '/api/placeholder/200/150', '/api/placeholder/200/150']
    },
    {
      id: 4,
      name: 'HR Analytics Suite',
      description: 'Human resources dashboard featuring employee metrics, recruitment analytics, and performance tracking.',
      author: {
        name: 'David Kim',
        avatar: '/api/placeholder/40/40',
        verified: false
      },
      createdDate: '2024-01-03T16:45:00Z',
      category: 'hr',
      tags: ['hr', 'employees', 'recruitment', 'performance'],
      views: 1245,
      likes: 67,
      comments: 12,
      downloads: 34,
      rating: 4.4,
      isLiked: false,
      isBookmarked: false,
      isFeatured: false,
      thumbnail: '/api/placeholder/400/250',
      previewImages: ['/api/placeholder/200/150', '/api/placeholder/200/150']
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

  const filteredDashboards = publicDashboards
    .filter(dashboard => {
      const matchesSearch = dashboard.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           dashboard.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           dashboard.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || dashboard.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular': return b.views - a.views;
        case 'recent': return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
        case 'trending': return b.likes - a.likes;
        case 'rating': return b.rating - a.rating;
        default: return 0;
      }
    });

  const featuredDashboards = publicDashboards.filter(d => d.isFeatured);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Public Gallery</h1>
          <p className="text-gray-600 mt-1">Discover and explore dashboards created by the community</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Globe className="h-4 w-4" />
          <span>{filteredDashboards.length} public dashboards</span>
        </div>
      </motion.div>

      {/* Featured Section */}
      {featuredDashboards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200"
        >
          <div className="flex items-center mb-4">
            <Award className="h-5 w-5 text-yellow-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Featured Dashboards</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredDashboards.slice(0, 3).map((dashboard) => (
              <div key={dashboard.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg mb-3"></div>
                <h3 className="font-semibold text-gray-900 mb-1">{dashboard.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{dashboard.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {dashboard.views.toLocaleString()}
                  </span>
                  <span className="flex items-center">
                    <Star className="h-3 w-3 mr-1 text-yellow-500" />
                    {dashboard.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dashboards, tags, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label} ({category.count})
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="popular">Most Popular</option>
              <option value="recent">Most Recent</option>
              <option value="trending">Trending</option>
              <option value="rating">Highest Rated</option>
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

      {/* Dashboard Grid/List */}
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
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
                    <ExternalLink className="h-4 w-4 text-white" />
                  </button>
                  <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
                    <Copy className="h-4 w-4 text-white" />
                  </button>
                  <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
                    <Download className="h-4 w-4 text-white" />
                  </button>
                </div>
                <div className="absolute top-3 right-3 flex items-center space-x-1">
                  {dashboard.isFeatured && (
                    <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {dashboard.name}
                  </h3>
                  <div className="flex items-center space-x-1 ml-2">
                    <button className={`p-1 rounded ${dashboard.isBookmarked ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
                      <Bookmark className="h-4 w-4" />
                    </button>
                    <button className={`p-1 rounded ${dashboard.isLiked ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'}`}>
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {dashboard.description}
                </p>

                {/* Author Info */}
                <div className="flex items-center mb-3">
                  <img
                    src={dashboard.author.avatar}
                    alt={dashboard.author.name}
                    className="h-6 w-6 rounded-full mr-2"
                  />
                  <span className="text-sm text-gray-700">{dashboard.author.name}</span>
                  {dashboard.author.verified && (
                    <Award className="h-3 w-3 text-blue-500 ml-1" />
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {dashboard.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                  {dashboard.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{dashboard.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {dashboard.views.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      {dashboard.likes}
                    </span>
                    <span className="flex items-center">
                      <Download className="h-3 w-3 mr-1" />
                      {dashboard.downloads}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 mr-1 text-yellow-500" />
                    <span>{dashboard.rating}</span>
                  </div>
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
              <div className="col-span-2">Author</div>
              <div className="col-span-1">Rating</div>
              <div className="col-span-2">Stats</div>
              <div className="col-span-2">Created</div>
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
                        <Globe className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 truncate">{dashboard.name}</h3>
                          {dashboard.isFeatured && (
                            <Award className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{dashboard.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dashboard.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <img
                        src={dashboard.author.avatar}
                        alt={dashboard.author.name}
                        className="h-6 w-6 rounded-full"
                      />
                      <span className="text-sm text-gray-900">{dashboard.author.name}</span>
                      {dashboard.author.verified && (
                        <Award className="h-3 w-3 text-blue-500" />
                      )}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="text-sm text-gray-900">{dashboard.rating}</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {dashboard.views.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {dashboard.likes}
                      </span>
                      <span className="flex items-center">
                        <Download className="h-3 w-3 mr-1" />
                        {dashboard.downloads}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm text-gray-600">
                    {getRelativeTime(dashboard.createdDate)}
                  </div>
                  <div className="col-span-1">
                    <div className="flex items-center space-x-1">
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <Copy className="h-4 w-4" />
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
          <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No public dashboards found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? `No dashboards match "${searchQuery}"` : 'No public dashboards available'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PublicGallery;