import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  X, 
  Upload, 
  FileText, 
  BarChart3, 
  Database,
  Users,
  Globe,
  Lock,
  Folder,
  Tag,
  Calendar
} from 'lucide-react';

interface CreateDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dashboardData: any) => void;
}

const CreateDashboardModal: React.FC<CreateDashboardModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { actualTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    visibility: 'private',
    template: 'blank',
    tags: '',
    folder: 'root'
  });

  const templates = [
    {
      id: 'blank',
      name: 'Blank Dashboard',
      description: 'Start from scratch with an empty canvas',
      icon: FileText,
      preview: '/api/placeholder/200/120'
    },
    {
      id: 'sales',
      name: 'Sales Analytics',
      description: 'Pre-built template for sales performance tracking',
      icon: BarChart3,
      preview: '/api/placeholder/200/120'
    },
    {
      id: 'marketing',
      name: 'Marketing Metrics',
      description: 'Track campaigns, ROI, and customer acquisition',
      icon: Users,
      preview: '/api/placeholder/200/120'
    },
    {
      id: 'financial',
      name: 'Financial Overview',
      description: 'Revenue, expenses, and financial health indicators',
      icon: Database,
      preview: '/api/placeholder/200/120'
    }
  ];

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' },
    { value: 'hr', label: 'Human Resources' }
  ];

  const folders = [
    { value: 'root', label: 'Root Folder' },
    { value: 'sales', label: 'Sales Dashboards' },
    { value: 'marketing', label: 'Marketing Analytics' },
    { value: 'finance', label: 'Financial Reports' },
    { value: 'personal', label: 'Personal Projects' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dashboardData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      id: Date.now() // Temporary ID generation
    };
    onSubmit(dashboardData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className={`rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden ${
              actualTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b ${
                  actualTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div>
                    <h2 className={`text-2xl font-bold ${
                      actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Create New Dashboard</h2>
                    <p className={`mt-1 ${
                      actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>Set up your dashboard with templates and configurations</p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className={`p-2 rounded-lg transition-colors ${
                      actualTheme === 'dark'
                        ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                    {/* Left Column - Form */}
                    <div className="space-y-6">
                      {/* Basic Information */}
                      <div>
                        <h3 className={`text-lg font-semibold mb-4 ${
                          actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>Basic Information</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Dashboard Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              placeholder="Enter dashboard name..."
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description
                            </label>
                            <textarea
                              value={formData.description}
                              onChange={(e) => handleInputChange('description', e.target.value)}
                              placeholder="Describe what this dashboard will show..."
                              rows={3}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Category
                            </label>
                            <select
                              value={formData.category}
                              onChange={(e) => handleInputChange('category', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {categories.map(category => (
                                <option key={category.value} value={category.value}>
                                  {category.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <Folder className="h-4 w-4 inline mr-1" />
                              Folder
                            </label>
                            <select
                              value={formData.folder}
                              onChange={(e) => handleInputChange('folder', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {folders.map(folder => (
                                <option key={folder.value} value={folder.value}>
                                  {folder.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <Tag className="h-4 w-4 inline mr-1" />
                              Tags (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={formData.tags}
                              onChange={(e) => handleInputChange('tags', e.target.value)}
                              placeholder="sales, analytics, quarterly..."
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Visibility Settings */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Visibility & Permissions</h3>
                        <div className="space-y-3">
                          <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name="visibility"
                              value="private"
                              checked={formData.visibility === 'private'}
                              onChange={(e) => handleInputChange('visibility', e.target.value)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <div className="ml-3">
                              <div className="flex items-center">
                                <Lock className="h-4 w-4 text-gray-500 mr-2" />
                                <span className="text-sm font-medium text-gray-900">Private</span>
                              </div>
                              <p className="text-xs text-gray-600">Only you can access this dashboard</p>
                            </div>
                          </label>

                          <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name="visibility"
                              value="team"
                              checked={formData.visibility === 'team'}
                              onChange={(e) => handleInputChange('visibility', e.target.value)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <div className="ml-3">
                              <div className="flex items-center">
                                <Users className="h-4 w-4 text-gray-500 mr-2" />
                                <span className="text-sm font-medium text-gray-900">Team</span>
                              </div>
                              <p className="text-xs text-gray-600">Accessible to your team members</p>
                            </div>
                          </label>

                          <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name="visibility"
                              value="public"
                              checked={formData.visibility === 'public'}
                              onChange={(e) => handleInputChange('visibility', e.target.value)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <div className="ml-3">
                              <div className="flex items-center">
                                <Globe className="h-4 w-4 text-gray-500 mr-2" />
                                <span className="text-sm font-medium text-gray-900">Public</span>
                              </div>
                              <p className="text-xs text-gray-600">Anyone with the link can view</p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Templates */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Template</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {templates.map((template) => (
                          <motion.label
                            key={template.id}
                            whileHover={{ scale: 1.02 }}
                            className={`flex p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                              formData.template === template.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="template"
                              value={template.id}
                              checked={formData.template === template.id}
                              onChange={(e) => handleInputChange('template', e.target.value)}
                              className="sr-only"
                            />
                            <div className="flex items-center space-x-4 w-full">
                              <div className={`p-3 rounded-lg ${
                                formData.template === template.id ? 'bg-blue-100' : 'bg-gray-100'
                              }`}>
                                <template.icon className={`h-6 w-6 ${
                                  formData.template === template.id ? 'text-blue-600' : 'text-gray-600'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{template.name}</h4>
                                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                              </div>
                            </div>
                          </motion.label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Create Dashboard
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateDashboardModal;