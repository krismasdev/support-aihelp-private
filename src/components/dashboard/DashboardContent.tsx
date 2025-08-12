import { ChatSectionRedux } from './sections/ChatSectionRedux';
import { HelperSection } from './sections/HelperSection';
import { InsightsSection } from './sections/InsightsSection';
import { ToolsSection } from './sections/ToolsSection';
import { ResourcesSection } from './sections/ResourcesSection';
import { SettingsSection } from './sections/SettingsSection';
import type { DashboardSection, UserProfile } from '@/pages/Dashboard';

interface DashboardContentProps {
  activeSection: DashboardSection;
  userProfile: UserProfile;
}

export const DashboardContent = ({ activeSection, userProfile }: DashboardContentProps) => {
  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <ChatSectionRedux userProfile={userProfile} />;
      case 'helper':
        return <HelperSection userProfile={userProfile} />;
      case 'insights':
        return <InsightsSection />;
      case 'tools':
        return <ToolsSection />;
      case 'resources':
        return <ResourcesSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <ChatSectionRedux userProfile={userProfile} />;
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 h-full">
        {renderSection()}
      </div>
    </div>
  );
};