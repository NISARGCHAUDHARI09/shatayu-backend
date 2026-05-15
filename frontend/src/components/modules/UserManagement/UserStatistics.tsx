import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Crown, 
  Stethoscope, 
  Briefcase, 
  Heart,
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react';
import { apiClient } from '../../../lib/apiClient';

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: Array<{ role: string; count: number }>;
  recentSignups: number;
  activeLastWeek: number;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="p-3 rounded-full" style={{ backgroundColor: color + '20' }}>
        {React.cloneElement(icon as React.ReactElement, { 
          size: 24, 
          style: { color } 
        })}
      </div>
    </div>
  </div>
);

interface RoleCardProps {
  role: string;
  count: number;
  total: number;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, count, total }) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  
  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'admin':
        return { 
          icon: <Crown size={20} />, 
          color: '#ef4444', 
          label: 'Administrators',
          bgColor: 'bg-red-50',
          textColor: 'text-red-800'
        };
      case 'doctor':
        return { 
          icon: <Stethoscope size={20} />, 
          color: '#3b82f6', 
          label: 'Doctors',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800'
        };
      case 'staff':
        return { 
          icon: <Briefcase size={20} />, 
          color: '#10b981', 
          label: 'Staff',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800'
        };
      case 'patient':
        return { 
          icon: <Heart size={20} />, 
          color: '#f59e0b', 
          label: 'Patients',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800'
        };
      default:
        return { 
          icon: <Users size={20} />, 
          color: '#6b7280', 
          label: role,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800'
        };
    }
  };

  const config = getRoleConfig(role);

  return (
    <div className={`${config.bgColor} rounded-lg p-4 border`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div style={{ color: config.color }}>
            {config.icon}
          </div>
          <span className={`text-sm font-medium ${config.textColor}`}>
            {config.label}
          </span>
        </div>
        <span className={`text-lg font-bold ${config.textColor}`}>
          {count}
        </span>
      </div>
      
      <div className="w-full bg-white rounded-full h-2 mb-2">
        <div 
          className="h-2 rounded-full transition-all duration-300"
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: config.color 
          }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs">
        <span className={config.textColor}>
          {percentage}% of total
        </span>
        <span className={config.textColor}>
          {count}/{total}
        </span>
      </div>
    </div>
  );
};

const UserStatistics: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/users/statistics');
      setStats(response.data.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching user statistics:', err);
      setError(err.response?.data?.error || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2">
          <UserX className="text-red-500" size={24} />
          <div>
            <h3 className="text-lg font-medium text-red-800">Error Loading Statistics</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchStatistics}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.total}
          icon={<Users />}
          color="#6b7280"
          subtitle="All registered users"
        />
        
        <StatCard
          title="Active Users"
          value={stats.active}
          icon={<UserCheck />}
          color="#10b981"
          subtitle="Currently active accounts"
        />
        
        <StatCard
          title="Inactive Users"
          value={stats.inactive}
          icon={<UserX />}
          color="#ef4444"
          subtitle="Deactivated accounts"
        />
        
        <StatCard
          title="Recent Signups"
          value={stats.recentSignups}
          icon={<TrendingUp />}
          color="#3b82f6"
          subtitle="Last 30 days"
        />
      </div>

      {/* Activity Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="text-purple-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="text-purple-600" size={20} />
                <div>
                  <p className="font-medium text-purple-900">Active This Week</p>
                  <p className="text-sm text-purple-600">Users with recent activity</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-purple-900">
                {stats.activeLastWeek}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="text-indigo-600" size={20} />
                <div>
                  <p className="font-medium text-indigo-900">Growth Rate</p>
                  <p className="text-sm text-indigo-600">New users this month</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-indigo-900">
                +{stats.recentSignups}
              </span>
            </div>
          </div>
        </div>

        {/* User Role Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="text-gray-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Role Distribution</h3>
          </div>
          
          <div className="space-y-4">
            {stats.byRole.map((roleData) => (
              <RoleCard
                key={roleData.role}
                role={roleData.role}
                count={roleData.count}
                total={stats.active}
              />
            ))}
            
            {stats.byRole.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users size={48} className="mx-auto mb-2 opacity-50" />
                <p>No user roles data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-800">
              {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
            </div>
            <div className="text-sm text-blue-600">Active User Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-800">
              {stats.byRole.find(r => r.role === 'doctor')?.count || 0}
            </div>
            <div className="text-sm text-blue-600">Medical Staff</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-800">
              {stats.recentSignups > 0 ? '+' : ''}{stats.recentSignups}
            </div>
            <div className="text-sm text-blue-600">Monthly Growth</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatistics;