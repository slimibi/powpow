export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'viewer';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export interface DataSource {
  id: string;
  name: string;
  type: 'file' | 'database' | 'api';
  connectionString?: string;
  filePath?: string;
  userId: string;
  metadata: {
    originalName?: string;
    size?: number;
    mimetype?: string;
    columns: Column[];
    rowCount: number;
    dataType: string;
    public: boolean;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  name: string;
  type: 'string' | 'integer' | 'decimal' | 'boolean' | 'datetime';
  nullable: boolean;
}

export interface Dashboard {
  id: string;
  title: string;
  description?: string;
  userId: string;
  layout: any[];
  filters: Record<string, any>;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Chart {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'kpi' | 'map';
  dashboardId: string;
  dataSourceId: string;
  config: ChartConfig;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ChartConfig {
  xAxis?: string;
  yAxis?: string;
  valueField?: string;
  labelField?: string;
  locationField?: string;
  title?: string;
  showLegend?: boolean;
  colors?: string[];
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DashboardShare {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  permission: 'view' | 'edit';
  createdAt: string;
}

export interface FilterConfig {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: any;
  values?: any[];
}

export interface ExportConfig {
  format: 'pdf' | 'png' | 'csv';
  includeFilters?: boolean;
  paperSize?: 'a4' | 'letter' | 'a3';
  orientation?: 'portrait' | 'landscape';
}