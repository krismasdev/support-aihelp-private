import { Users, BarChart3, Wrench, Package, Settings, MessageCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import type { DashboardSection } from '@/pages/Dashboard';

interface DashboardSidebarProps {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
}

const menuItems = [
  { id: 'home' as const, label: 'Chat', icon: MessageCircle },
  { id: 'helper' as const, label: 'My Helper', icon: Users },
  { id: 'insights' as const, label: 'Insights', icon: BarChart3 },
  { id: 'tools' as const, label: 'Tools', icon: Wrench },
  { id: 'resources' as const, label: 'Life Resources', icon: Package },
  { id: 'settings' as const, label: 'Settings', icon: Settings },
];

export const DashboardSidebar = ({ activeSection, onSectionChange }: DashboardSidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-purple-100 flex flex-col">
      <div className="p-6 border-b border-purple-100">
        <h1 className="text-xl font-semibold text-indigo-900">Safe Haven</h1>
        <p className="text-sm text-indigo-600 mt-1">Your emotional support</p>
        {user && (
          <p className="text-xs text-gray-500 mt-2 truncate">
            {user.email}
          </p>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                activeSection === item.id
                  ? "bg-indigo-100 text-indigo-900 font-medium"
                  : "text-gray-600 hover:bg-purple-50 hover:text-indigo-700"
              )}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {user && (
        <div className="p-4 border-t border-purple-100">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};