import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit,
  Trash2,
  UserPlus,
  Crown,
  Settings,
  Eye,
  MessageSquare,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Award,
  Target,
  BarChart3,
  Share2,
  Download,
  RefreshCw
} from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastActive: string;
  dashboardsOwned: number;
  dashboardsShared: number;
  permissions: {
    canCreate: boolean;
    canEdit: boolean;
    canShare: boolean;
    canDelete: boolean;
    canInvite: boolean;
  };
  recentActivity: {
    action: string;
    timestamp: string;
    target: string;
  }[];
}

interface TeamInvite {
  id: number;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  invitedBy: string;
  inviteDate: string;
  status: 'pending' | 'expired';
}

const Team: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'members' | 'invites' | 'roles'>('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'admin' | 'editor' | 'viewer'>('all');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      avatar: '/api/placeholder/40/40',
      role: 'admin',
      status: 'active',
      joinDate: '2023-08-15T00:00:00Z',
      lastActive: '2 minutes ago',
      dashboardsOwned: 12,
      dashboardsShared: 8,
      permissions: {
        canCreate: true,
        canEdit: true,
        canShare: true,
        canDelete: true,
        canInvite: true
      },
      recentActivity: [
        { action: 'Created', timestamp: '2 hours ago', target: 'Q4 Sales Dashboard' },
        { action: 'Shared', timestamp: '1 day ago', target: 'Marketing Analytics' },
        { action: 'Edited', timestamp: '2 days ago', target: 'Customer Insights' }
      ]
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      avatar: '/api/placeholder/40/40',
      role: 'editor',
      status: 'active',
      joinDate: '2023-09-22T00:00:00Z',
      lastActive: '1 hour ago',
      dashboardsOwned: 8,
      dashboardsShared: 15,
      permissions: {
        canCreate: true,
        canEdit: true,
        canShare: true,
        canDelete: false,
        canInvite: false
      },
      recentActivity: [
        { action: 'Edited', timestamp: '3 hours ago', target: 'Revenue Tracking' },
        { action: 'Commented on', timestamp: '1 day ago', target: 'Financial Overview' },
        { action: 'Shared', timestamp: '3 days ago', target: 'Operations Dashboard' }
      ]
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      avatar: '/api/placeholder/40/40',
      role: 'editor',
      status: 'active',
      joinDate: '2023-10-10T00:00:00Z',
      lastActive: '30 minutes ago',
      dashboardsOwned: 6,
      dashboardsShared: 12,
      permissions: {
        canCreate: true,
        canEdit: true,
        canShare: true,
        canDelete: false,
        canInvite: false
      },
      recentActivity: [
        { action: 'Created', timestamp: '1 hour ago', target: 'Customer Satisfaction' },
        { action: 'Edited', timestamp: '4 hours ago', target: 'Support Metrics' },
        { action: 'Shared', timestamp: '1 day ago', target: 'Team Performance' }
      ]
    },
    {
      id: 4,
      name: 'David Park',
      email: 'david.park@company.com',
      avatar: '/api/placeholder/40/40',
      role: 'viewer',
      status: 'active',
      joinDate: '2023-11-05T00:00:00Z',
      lastActive: '2 hours ago',
      dashboardsOwned: 2,
      dashboardsShared: 3,
      permissions: {
        canCreate: false,
        canEdit: false,
        canShare: true,
        canDelete: false,
        canInvite: false
      },
      recentActivity: [
        { action: 'Viewed', timestamp: '2 hours ago', target: 'Sales Performance' },
        { action: 'Downloaded', timestamp: '1 day ago', target: 'Monthly Report' },
        { action: 'Commented on', timestamp: '2 days ago', target: 'Budget Overview' }
      ]
    },
    {
      id: 5,
      name: 'Lisa Wang',
      email: 'lisa.wang@company.com',
      avatar: '/api/placeholder/40/40',
      role: 'viewer',
      status: 'inactive',
      joinDate: '2023-12-01T00:00:00Z',
      lastActive: '5 days ago',
      dashboardsOwned: 1,
      dashboardsShared: 1,
      permissions: {
        canCreate: false,
        canEdit: false,
        canShare: true,
        canDelete: false,
        canInvite: false
      },
      recentActivity: [
        { action: 'Viewed', timestamp: '5 days ago', target: 'HR Dashboard' },
        { action: 'Shared', timestamp: '1 week ago', target: 'Recruitment Metrics' }
      ]
    }
  ];

  const pendingInvites: TeamInvite[] = [
    {
      id: 1,
      email: 'john.doe@company.com',
      role: 'editor',
      invitedBy: 'Sarah Johnson',
      inviteDate: '2024-01-15T10:30:00Z',
      status: 'pending'
    },
    {
      id: 2,
      email: 'jane.smith@company.com',
      role: 'viewer',
      invitedBy: 'Mike Chen',
      inviteDate: '2024-01-12T14:20:00Z',
      status: 'pending'
    },
    {
      id: 3,
      email: 'old.invite@company.com',
      role: 'editor',
      invitedBy: 'Sarah Johnson',
      inviteDate: '2023-12-01T09:15:00Z',
      status: 'expired'
    }
  ];

  const roleDefinitions = {
    admin: {
      name: 'Admin',
      description: 'Full access to all features and team management',
      color: 'red',
      permissions: ['Create dashboards', 'Edit all dashboards', 'Delete dashboards', 'Manage team', 'Invite members', 'Access analytics']
    },
    editor: {
      name: 'Editor',
      description: 'Can create and edit dashboards, share with team',
      color: 'blue',
      permissions: ['Create dashboards', 'Edit own dashboards', 'Share dashboards', 'Comment on dashboards']
    },
    viewer: {
      name: 'Viewer',
      description: 'Can view and comment on shared dashboards',
      color: 'green',
      permissions: ['View shared dashboards', 'Comment on dashboards', 'Download reports', 'Share dashboard links']
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Crown;
      case 'editor': return Edit;
      default: return Eye;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'inactive': return XCircle;
      case 'pending': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    const months = Math.floor(diffInDays / 30);
    if (months === 1) return '1 month ago';
    if (months < 12) return `${months} months ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-1">Manage team members, roles, and permissions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInviteModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </motion.button>
      </motion.div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{teamMembers.filter(m => m.status === 'active').length}</p>
              <p className="text-sm text-gray-600">Active Members</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{pendingInvites.filter(i => i.status === 'pending').length}</p>
              <p className="text-sm text-gray-600">Pending Invites</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <BarChart3 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {teamMembers.reduce((sum, member) => sum + member.dashboardsOwned, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Dashboards</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Share2 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {teamMembers.reduce((sum, member) => sum + member.dashboardsShared, 0)}
              </p>
              <p className="text-sm text-gray-600">Shared Dashboards</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { key: 'members', label: 'Team Members', count: teamMembers.length },
            { key: 'invites', label: 'Pending Invites', count: pendingInvites.filter(i => i.status === 'pending').length },
            { key: 'roles', label: 'Roles & Permissions', count: 3 }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeTab === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'members' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Filters */}
          <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-80 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>

          {/* Members List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                <div className="col-span-4">Member</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Dashboards</div>
                <div className="col-span-1">Last Active</div>
                <div className="col-span-1">Actions</div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredMembers.map((member, index) => {
                const RoleIcon = getRoleIcon(member.role);
                const StatusIcon = getStatusIcon(member.status);
                
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="h-10 w-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-600">{member.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm text-gray-900">
                          <p>{member.dashboardsOwned} owned</p>
                          <p className="text-gray-600">{member.dashboardsShared} shared</p>
                        </div>
                      </div>
                      <div className="col-span-1 text-sm text-gray-600">
                        {member.lastActive}
                      </div>
                      <div className="col-span-1">
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'invites' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                <div className="col-span-4">Email</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Invited By</div>
                <div className="col-span-2">Date Sent</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Actions</div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {pendingInvites.map((invite, index) => (
                <motion.div
                  key={invite.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Mail className="h-4 w-4 text-gray-600" />
                        </div>
                        <p className="font-medium text-gray-900">{invite.email}</p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(invite.role)}`}>
                        {invite.role.charAt(0).toUpperCase() + invite.role.slice(1)}
                      </span>
                    </div>
                    <div className="col-span-2 text-sm text-gray-900">
                      {invite.invitedBy}
                    </div>
                    <div className="col-span-2 text-sm text-gray-600">
                      {getRelativeTime(invite.inviteDate)}
                    </div>
                    <div className="col-span-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invite.status)}`}>
                        {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <div className="flex items-center space-x-1">
                        {invite.status === 'pending' && (
                          <>
                            <button className="p-1 text-blue-600 hover:text-blue-700 transition-colors">
                              <Mail className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:text-red-700 transition-colors">
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {invite.status === 'expired' && (
                          <button className="p-1 text-green-600 hover:text-green-700 transition-colors">
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'roles' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(roleDefinitions).map(([key, role], index) => {
              const RoleIcon = getRoleIcon(key);
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-2 rounded-lg ${role.color === 'red' ? 'bg-red-50' : role.color === 'blue' ? 'bg-blue-50' : 'bg-green-50'}`}>
                      <RoleIcon className={`h-5 w-5 ${role.color === 'red' ? 'text-red-600' : role.color === 'blue' ? 'text-blue-600' : 'text-green-600'}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                      <p className="text-sm text-gray-600">{teamMembers.filter(m => m.role === key).length} members</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{role.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Permissions:</h4>
                    <ul className="space-y-1">
                      {role.permissions.map((permission, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          {permission}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Team;