import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';

const Admin = () => {
  const { user, loading, isAuthenticated } = useAuth();

  // useEffect(() => {
  //   if (!loading && !isAuthenticated()) {
  //     window.location.href = '/';
  //   }
  // }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return null;
  }

  return <AdminLayout />;
};

export default Admin;