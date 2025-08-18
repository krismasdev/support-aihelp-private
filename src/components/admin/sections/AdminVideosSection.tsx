import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Play, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { VideoUploadDialog } from './VideoUploadDialog';
import { VideoEditDialog } from './VideoEditDialog';
interface Video {
  id: string;
  title: string;
  url: string;
  category_id: string;
  category_name: string;
  created_at: string;
  updated_at: string;
}

export const AdminVideosSection = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);
  const [totalVideos, setTotalVideos] = useState(0);
  const { toast } = useToast();
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-videos');
      if (error) throw error;
      
      const videosData = data?.videos || [];
      setVideos(videosData);
      setTotalVideos(videosData.length);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = (video: Video) => {
    setVideoToDelete(video);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!videoToDelete) return;

    try {
      const { data, error } = await supabase.functions.invoke('delete-video', {
        body: { id: videoToDelete.id }
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Video deleted successfully",
      });
      
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: "Error",
        description: "Failed to delete video",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setVideoToDelete(null);
    }
  };

  const handleEditVideo = (video: Video) => {
    setSelectedVideo(video);
    setEditDialogOpen(true);
  };

  if (loading) {
    return <div className="p-6">Loading videos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Videos Management</h1>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Plus size={16} className="mr-2" />
          Upload Video
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalVideos}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {videos.map((video) => (
              <div key={video.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <Play size={16} />
                  </div>
                  <div>
                    <p className="font-medium">{video.title}</p>
                    <p className="text-sm text-gray-500">
                      URL: {video.url} | Category: {video.category_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      Created: {new Date(video.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditVideo(video)}
                  >
                    <Edit size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteVideo(video)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} className="mr-1 text-red-600" />
                    <span className="text-red-600">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <VideoUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onVideoCreated={fetchVideos}
      />
      
      <VideoEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onVideoUpdated={fetchVideos}
        video={selectedVideo}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{videoToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};