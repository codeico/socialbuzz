import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  User,
  CreditCard,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
}) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  // User dashboard tabs only
  const userTabs = [
    { id: 'overview', label: 'Overview', icon: Home, path: '/dashboard' },
    { id: 'profile', label: 'Profile', icon: User, path: '/dashboard/profile' },
    { id: 'transactions', label: 'Transactions', icon: CreditCard, path: '/dashboard/transactions' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  const handleTabClick = (tab: any) => {
    router.push(tab.path);
    if (onTabChange) {
      onTabChange(tab.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                SocialBuzz
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Show admin panel link for admins */}
              {user && ['admin', 'super_admin'].includes(user.role || '') && (
                <button
                  onClick={() => router.push('/admin')}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium px-3 py-2 rounded-md hover:bg-indigo-50 transition-colors"
                >
                  <Shield className="w-4 h-4 inline mr-2" />
                  Admin Panel
                </button>
              )}
              <span className="text-sm text-gray-700">
                Welcome, {user?.fullName}
              </span>
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 hover:text-gray-700 transition-colors"
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
            <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 h-fit">
              <nav className="p-4 space-y-2">
                {userTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab)}
                      className={cn(
                        'w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer',
                        activeTab === tab.id
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      )}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
            <div className="flex-1 ml-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
