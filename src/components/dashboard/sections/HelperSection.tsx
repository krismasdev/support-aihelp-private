import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Users, Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserId } from '@/store/userSlice';
import { selectHelpers, selectHelpersLoading, selectHelpersError, selectDefaultHelper, fetchHelpers } from '@/store/helperSlice';
import { HelperCard } from '@/components/dashboard/helpers/HelperCard';
import { CreateHelperDialog } from '@/components/dashboard/helpers/CreateHelperDialog';
import { HelperQuiz } from '@/components/dashboard/helpers/HelperQuiz';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/pages/Dashboard';
interface HelperSectionProps {
  userProfile: UserProfile;
}

export const HelperSection = ({ userProfile }: HelperSectionProps) => {
  const dispatch = useDispatch();
  const helpers = useSelector(selectHelpers);
  const isLoading = useSelector(selectHelpersLoading);
  const error = useSelector(selectHelpersError);
  const defaultHelper = useSelector(selectDefaultHelper);
  const userId = useSelector(selectUserId);

  console.log(userId);
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [editingHelper, setEditingHelper] = useState<any>(null);
  const [activeHelper, setActiveHelper] = useState<any>(null);
  const [selectingHelper, setSelectingHelper] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [helperToDelete, setHelperToDelete] = useState<string | null>(null);

  // Fetch helpers when component mounts or userId changes
  useEffect(() => {
    if (userId) {
      dispatch(fetchHelpers(userId) as any);
    }
  }, [dispatch, userId]);

  // Set default helper as active when helpers are loaded
  useEffect(() => {
    if (defaultHelper && !activeHelper) {
      setActiveHelper(defaultHelper);
      console.log('Setting default helper as active:', defaultHelper);
    }
  }, [defaultHelper, activeHelper]);

  const handleCreateHelper = (helperData: {
    name: string;
    type: string;
    description: string;
    tone: TonePreference;
    interactionStyle: string;
    focus: string;
  }) => {
    // This will be handled by the CreateHelperDialog calling the edge function
    setShowCreateDialog(false);
  };

  const handleEditHelper = (helper: any) => {
    setEditingHelper(helper);
    setShowQuiz(true);
  };

  const handleQuizComplete = async (preferences: {
    tone: TonePreference;
    interactionStyle: string;
    focus: string;
  }) => {
    if (editingHelper && userId) {
      try {
        const { data, error } = await supabase.functions.invoke('update-helper', {
          body: {
            userId,
            helperId: editingHelper.id,
            tone: preferences.tone,
            interactionStyle: preferences.interactionStyle,
            focus: preferences.focus
          },
        });

        if (error) {
          console.error('Error updating helper:', error);
          return;
        }

        console.log('Helper updated successfully:', data);
        
        // Refresh helpers data
        dispatch(fetchHelpers(userId) as any);
      } catch (error) {
        console.error('Error calling update-helper function:', error);
      }
    }
    
    setShowQuiz(false);
    setEditingHelper(null);
  };
  const handleSelectHelper = async (helper: any) => {
    try {
      setSelectingHelper(helper.id);
      console.log('Setting default helper:', helper.id, 'for user:', userId);
      
      // Call the edge function to update database
      const { data, error } = await supabase.functions.invoke('set-default-helper', {
        body: { 
          helper_id: helper.id, 
          user_id: userId 
        },
      });

      if (error) {
        console.error('Error setting default helper:', error);
        return;
      }

      console.log('Default helper updated successfully:', data);
      
      // Update local state
      setActiveHelper(helper);
      
      // Refresh helpers data to get updated is_default values
      dispatch(fetchHelpers(userId) as any);
      
    } catch (error) {
      console.error('Error calling set-default-helper function:', error);
    } finally {
      setSelectingHelper(null);
    }
  };

  const handleDeleteClick = (helperId: string) => {
    setHelperToDelete(helperId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!helperToDelete || !userId) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('delete-helper', {
        body: {
          userId,
          helperId: helperToDelete
        },
      });

      if (error) {
        console.error('Error deleting helper:', error);
        return;
      }

      console.log('Helper deleted successfully:', data);
      
      // If the deleted helper was active, clear active helper
      if (activeHelper?.id === helperToDelete) {
        setActiveHelper(null);
      }
      
      // Refresh helpers data
      dispatch(fetchHelpers(userId) as any);
      
    } catch (error) {
      console.error('Error calling delete-helper function:', error);
    } finally {
      setDeleteDialogOpen(false);
      setHelperToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="flex gap-1">
                  <Skeleton className="w-8 h-8" />
                  <Skeleton className="w-8 h-8" />
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-12" />
              </div>
              <Skeleton className="h-12 w-full mb-3" />
              <Skeleton className="h-8 w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  if (showQuiz && editingHelper) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-indigo-900 mb-2">Edit Helper</h1>
          <p className="text-gray-600">Reconfigure {editingHelper.name}'s behavior and preferences.</p>
        </div>
        
        <HelperQuiz
          editingHelper={editingHelper}
          helperType={editingHelper.type}
          onComplete={handleQuizComplete}
          onCancel={() => {
            setShowQuiz(false);
            setEditingHelper(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-indigo-900 mb-2">Your Helpers</h1>
          <p className="text-gray-600">Manage your personalized AI support companions.</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus size={16} className="mr-2" />
          Create Helper
        </Button>
      </div>

      {activeHelper && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <Users size={20} />
              Currently Active Helper
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-2xl">
                {activeHelper.type === 'Spiritual Guide' ? '🙏' :
                 activeHelper.type === 'Relationship Coach' ? '💕' :
                 activeHelper.type === 'Mental Wellness Helper' ? '🧠' :
                 activeHelper.type === 'Career Coach' ? '💼' :
                 activeHelper.type === 'Friend & Advisor' ? '👥' :
                 activeHelper.type === 'Health Consultant' ? '🏥' : '🤖'}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-indigo-900">{activeHelper.name}</h3>
                <p className="text-indigo-700">{activeHelper.type} • {activeHelper.tone} tone</p>
                <p className="text-sm text-indigo-600 mt-1">{activeHelper.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {helpers.map((helper) => (
          <HelperCard
            key={helper.id}
            helper={helper}
            isActive={activeHelper?.id === helper.id}
            isSelecting={selectingHelper === helper.id}
            onSelect={handleSelectHelper}
            onEdit={handleEditHelper}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      <CreateHelperDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSave={handleCreateHelper}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Helper</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this helper? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};