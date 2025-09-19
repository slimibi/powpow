import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  category: string;
  visibility: 'private' | 'team' | 'public';
  template: string;
  tags: string[];
  folder: string;
  createdAt: string;
  updatedAt: string;
  lastModified: string;
  charts: number;
  views: number;
  isPublic: boolean;
  thumbnail?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  widgets: Widget[];
}

export interface Widget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'text';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, any>;
  dataSource?: string;
  query?: string;
}

interface DashboardContextType {
  dashboards: Dashboard[];
  createDashboard: (dashboardData: Partial<Dashboard>) => Promise<Dashboard>;
  updateDashboard: (id: string, updates: Partial<Dashboard>) => Promise<Dashboard>;
  deleteDashboard: (id: string) => Promise<void>;
  getDashboard: (id: string) => Dashboard | undefined;
  addWidget: (dashboardId: string, widget: Partial<Widget>) => Promise<void>;
  updateWidget: (dashboardId: string, widgetId: string, updates: Partial<Widget>) => Promise<void>;
  removeWidget: (dashboardId: string, widgetId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

interface DashboardProviderProps {
  children: React.ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with sample data
  useEffect(() => {
    const sampleDashboards: Dashboard[] = [
      {
        id: '1',
        name: 'Sales Performance Q4',
        description: 'Comprehensive sales analytics and performance metrics',
        category: 'sales',
        visibility: 'team',
        template: 'sales',
        tags: ['sales', 'analytics', 'quarterly'],
        folder: 'sales',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        lastModified: '2 hours ago',
        charts: 8,
        views: 156,
        isPublic: false,
        author: { id: '1', name: 'John Doe' },
        widgets: []
      },
      {
        id: '2',
        name: 'Marketing Analytics',
        description: 'Campaign performance and ROI analysis',
        category: 'marketing',
        visibility: 'public',
        template: 'marketing',
        tags: ['marketing', 'campaigns', 'roi'],
        folder: 'marketing',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        lastModified: '5 hours ago',
        charts: 12,
        views: 89,
        isPublic: true,
        author: { id: '2', name: 'Jane Smith' },
        widgets: []
      },
      {
        id: '3',
        name: 'Customer Insights',
        description: 'Customer behavior and satisfaction metrics',
        category: 'general',
        visibility: 'private',
        template: 'blank',
        tags: ['customers', 'insights', 'satisfaction'],
        folder: 'personal',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        lastModified: '1 day ago',
        charts: 6,
        views: 234,
        isPublic: false,
        author: { id: '1', name: 'John Doe' },
        widgets: []
      },
      {
        id: '4',
        name: 'Financial Overview',
        description: 'Revenue, expenses, and financial health indicators',
        category: 'finance',
        visibility: 'team',
        template: 'financial',
        tags: ['finance', 'revenue', 'expenses'],
        folder: 'finance',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        lastModified: '2 days ago',
        charts: 10,
        views: 167,
        isPublic: false,
        author: { id: '3', name: 'Mike Johnson' },
        widgets: []
      }
    ];

    setDashboards(sampleDashboards);
  }, []);

  const createDashboard = async (dashboardData: Partial<Dashboard>): Promise<Dashboard> => {
    setLoading(true);
    setError(null);
    
    try {
      const newDashboard: Dashboard = {
        id: Date.now().toString(),
        name: dashboardData.name || 'Untitled Dashboard',
        description: dashboardData.description || '',
        category: dashboardData.category || 'general',
        visibility: dashboardData.visibility || 'private',
        template: dashboardData.template || 'blank',
        tags: dashboardData.tags || [],
        folder: dashboardData.folder || 'root',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastModified: 'just now',
        charts: 0,
        views: 0,
        isPublic: dashboardData.visibility === 'public',
        author: { id: '1', name: 'Current User' }, // In real app, get from auth context
        widgets: []
      };

      setDashboards(prev => [newDashboard, ...prev]);
      return newDashboard;
    } catch (err) {
      setError('Failed to create dashboard');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDashboard = async (id: string, updates: Partial<Dashboard>): Promise<Dashboard> => {
    setLoading(true);
    setError(null);
    
    try {
      setDashboards(prev => prev.map(dashboard => {
        if (dashboard.id === id) {
          return {
            ...dashboard,
            ...updates,
            updatedAt: new Date().toISOString(),
            lastModified: 'just now'
          };
        }
        return dashboard;
      }));

      const updatedDashboard = dashboards.find(d => d.id === id);
      if (!updatedDashboard) throw new Error('Dashboard not found');
      
      return updatedDashboard;
    } catch (err) {
      setError('Failed to update dashboard');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDashboard = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      setDashboards(prev => prev.filter(dashboard => dashboard.id !== id));
    } catch (err) {
      setError('Failed to delete dashboard');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDashboard = (id: string): Dashboard | undefined => {
    return dashboards.find(dashboard => dashboard.id === id);
  };

  const addWidget = async (dashboardId: string, widget: Partial<Widget>): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const newWidget: Widget = {
        id: Date.now().toString(),
        type: widget.type || 'chart',
        title: widget.title || 'New Widget',
        position: widget.position || { x: 0, y: 0, w: 6, h: 4 },
        config: widget.config || {},
        dataSource: widget.dataSource,
        query: widget.query
      };

      setDashboards(prev => prev.map(dashboard => {
        if (dashboard.id === dashboardId) {
          return {
            ...dashboard,
            widgets: [...dashboard.widgets, newWidget],
            charts: dashboard.charts + 1,
            updatedAt: new Date().toISOString(),
            lastModified: 'just now'
          };
        }
        return dashboard;
      }));
    } catch (err) {
      setError('Failed to add widget');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateWidget = async (dashboardId: string, widgetId: string, updates: Partial<Widget>): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      setDashboards(prev => prev.map(dashboard => {
        if (dashboard.id === dashboardId) {
          return {
            ...dashboard,
            widgets: dashboard.widgets.map(widget => {
              if (widget.id === widgetId) {
                return { ...widget, ...updates };
              }
              return widget;
            }),
            updatedAt: new Date().toISOString(),
            lastModified: 'just now'
          };
        }
        return dashboard;
      }));
    } catch (err) {
      setError('Failed to update widget');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeWidget = async (dashboardId: string, widgetId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      setDashboards(prev => prev.map(dashboard => {
        if (dashboard.id === dashboardId) {
          return {
            ...dashboard,
            widgets: dashboard.widgets.filter(widget => widget.id !== widgetId),
            charts: Math.max(0, dashboard.charts - 1),
            updatedAt: new Date().toISOString(),
            lastModified: 'just now'
          };
        }
        return dashboard;
      }));
    } catch (err) {
      setError('Failed to remove widget');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: DashboardContextType = {
    dashboards,
    createDashboard,
    updateDashboard,
    deleteDashboard,
    getDashboard,
    addWidget,
    updateWidget,
    removeWidget,
    loading,
    error
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};