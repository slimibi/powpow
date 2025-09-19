import React from 'react';
import { motion } from 'framer-motion';
import { Database, Upload, Plus, Search, FileText, Table } from 'lucide-react';

const DataSources: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const dataSources = [
    {
      id: 1,
      name: 'Sales Data Q4 2023',
      type: 'CSV',
      size: '2.4 MB',
      rows: 15420,
      columns: 12,
      lastModified: '2 hours ago',
      description: 'Quarterly sales performance data with customer segments'
    },
    {
      id: 2,
      name: 'Customer Demographics',
      type: 'Excel',
      size: '5.1 MB',
      rows: 8950,
      columns: 18,
      lastModified: '1 day ago',
      description: 'Customer demographic information and preferences'
    },
    {
      id: 3,
      name: 'Marketing Campaigns',
      type: 'JSON',
      size: '1.8 MB',
      rows: 3420,
      columns: 8,
      lastModified: '3 days ago',
      description: 'Campaign performance metrics and engagement data'
    },
    {
      id: 4,
      name: 'Financial Transactions',
      type: 'CSV',
      size: '12.3 MB',
      rows: 45600,
      columns: 15,
      lastModified: '1 week ago',
      description: 'Transaction history and financial records'
    }
  ];

  const filteredDataSources = dataSources.filter(source =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    source.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'csv':
        return <FileText className="h-5 w-5 text-green-600" />;
      case 'excel':
        return <Table className="h-5 w-5 text-blue-600" />;
      case 'json':
        return <Database className="h-5 w-5 text-purple-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'csv':
        return 'bg-green-100 text-green-800';
      case 'excel':
        return 'bg-blue-100 text-blue-800';
      case 'json':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Data Sources</h1>
          <p className="text-gray-600 mt-1">Manage your data connections and upload new datasets</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Data
        </motion.button>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-card p-8 border-2 border-dashed border-gray-200 hover:border-blue-400 transition-colors"
      >
        <div className="text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload your data</h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your files here, or click to browse
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-500 mb-4">
            <span>Supports CSV, Excel, JSON files</span>
            <span>•</span>
            <span>Max file size: 10MB</span>
          </div>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Choose Files
          </button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg p-4 shadow-card"
      >
        <div className="relative">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search data sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </motion.div>

      {/* Data Sources List */}
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
            <div className="col-span-4">Name</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-2">Records</div>
            <div className="col-span-2">Modified</div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredDataSources.map((source, index) => (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors">
                      {getTypeIcon(source.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {source.name}
                      </h3>
                      <p className="text-sm text-gray-600">{source.description}</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(source.type)}`}>
                    {source.type}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-gray-900">{source.size}</div>
                <div className="col-span-2">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {source.rows.toLocaleString()} rows
                    </div>
                    <div className="text-xs text-gray-600">
                      {source.columns} columns
                    </div>
                  </div>
                </div>
                <div className="col-span-2 text-sm text-gray-600">{source.lastModified}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {filteredDataSources.length === 0 && (
        <div className="text-center py-12">
          <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No data sources found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? `No data sources match "${searchQuery}"` : 'Upload your first dataset to get started'}
          </p>
          <button className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Upload Data
          </button>
        </div>
      )}
    </div>
  );
};

export default DataSources;