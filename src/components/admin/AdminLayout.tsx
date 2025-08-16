import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminUsersSection } from './sections/AdminUsersSection';
import { AdminHelpersSection } from './sections/AdminHelpersSection';
import { AdminVideosSection } from './sections/AdminVideosSection';
import { AdminDocumentsSection } from './sections/AdminDocumentsSection';
import { AdminBookingSection } from './sections/AdminBookingSection';

export const AdminLayout = () => {
  const [activeSection, setActiveSection] = useState('users');

  const renderMainContent = () => {
    switch (activeSection) {
      case 'users':
        return <AdminUsersSection />;
      case 'helpers':
        return <AdminHelpersSection />;
      case 'videos':
        return <AdminVideosSection />;
      case 'documents':
        return <AdminDocumentsSection />;
      case 'booking':
        return <AdminBookingSection />;
      default:
        return <AdminUsersSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderMainContent()}
        </div>
      </main>
    </div>
  );
};