import React from 'react';
import { useRouter } from 'next/navigation';
import { Home, Users, CreditCard, DollarSign, FileText, Settings, LogOut, Shield, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab }) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Admin navigation tabs
  const adminTabs = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3, path: '/admin' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'transactions', label: 'Transactions', icon: CreditCard, path: '/admin/transactions' },
    { id: 'payouts', label: 'Payouts', icon: DollarSign, path: '/admin/payouts' },
    { id: 'reports', label: 'Reports', icon: FileText, path: '/admin/reports' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const handleTabClick = (tab: any) => {
    router.push(tab.path);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Redirect non-admin users
  React.useEffect(() => {
    if (user && !['admin', 'super_admin'].includes(user.role || '')) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user || !['admin', 'super_admin'].includes(user.role || '')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-4">You don&apos;t have permission to access this area.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <nav className="bg-indigo-800 border-b border-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-indigo-300 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-indigo-300">SocialBuzz Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-indigo-300 hover:text-white text-sm font-medium px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Home className="w-4 h-4 inline mr-2" />
                User Dashboard
              </button>
              <div className="text-sm text-indigo-300">
                <span className="font-medium text-white">{user.fullName}</span>
                <br />
                <span className="text-xs capitalize">{user.role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-indigo-300 hover:text-white hover:bg-indigo-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex">
            {/* Admin Sidebar */}
            <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 h-fit">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Administration</h3>
              </div>
              <nav className="p-4 space-y-2">
                {adminTabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab)}
                      className={cn(
                        'w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer',
                        activeTab === tab.id
                          ? 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-500'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      )}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>

              {/* Quick Stats in Sidebar */}
              <div className="p-4 border-t border-gray-200 mt-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quick Stats</h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Online Users</span>
                    <span className="text-green-600 font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending</span>
                    <span className="text-yellow-600 font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Today Revenue</span>
                    <span className="text-blue-600 font-medium">$2.4k</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Content */}
            <div className="flex-1 ml-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
