import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import CreateDashboardModal from '../Dashboard/CreateDashboardModal';
import {
  Home,
  BarChart3,
  Database,
  Share2,
  Settings,
  Plus,
  Folder,
  Users,
  TrendingUp
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const sidebarItems: SidebarItem[] = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'My Dashboards', href: '/dashboards', icon: BarChart3 },
  { name: 'Data Sources', href: '/data', icon: Database },
  { name: 'Shared with Me', href: '/shared', icon: Share2 },
  { name: 'Public Gallery', href: '/public', icon: Folder },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Team', href: '/team', icon: Users },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { actualTheme } = useTheme();
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  const handleCreateDashboard = (dashboardData: any) => {
    console.log('Creating dashboard:', dashboardData);
    // Here you would typically make an API call to create the dashboard
    // For now, we'll just log the data
  };

  return (
    <div className={`w-64 h-full border-r transition-colors duration-200 ${
      actualTheme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex flex-col h-full">
        <div className="p-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Dashboard
          </motion.button>
        </div>

        <nav className="flex-1 px-4 pb-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.href;
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                      isActive
                        ? actualTheme === 'dark'
                          ? 'bg-blue-900/20 text-blue-400 border-r-2 border-blue-400'
                          : 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : actualTheme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${
                      isActive 
                        ? actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-700'
                        : actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                    }`} />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={`p-4 border-t transition-colors duration-200 ${
          actualTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <Link
            to="/settings"
            className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
              actualTheme === 'dark'
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Settings className={`h-5 w-5 mr-3 ${
              actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-400'
            }`} />
            Settings
          </Link>
        </div>
      </div>

      {/* Create Dashboard Modal */}
      <CreateDashboardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateDashboard}
      />
    </div>
  );
};

export default Sidebar;