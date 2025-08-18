import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';

interface VideoEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVideoUpdated: () => void;
  video: {
    id: string;
    title: string;
    url: string;
    category_id: string;
  } | null;
}

interface VideoCategory {
  id: string;
  name: string;
}

export const VideoEditDialog = ({ open, onOpenChange, onVideoUpdated, video }: VideoEditDialogProps) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && video) {
      setTitle(video.title);
      setUrl(video.url);
      setCategoryId(video.category_id);
      fetchCategories();
    }
  }, [open, video]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-video-categories');
      if (error) throw error;
      setCategories(data?.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video || !title || !url || !categoryId) return;

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('update-video', {
        body: { 
          id: video.id, 
          title, 
          url, 
          category: categoryId 
        }
      });

      if (error) throw error;

      onVideoUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating video:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Video</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-title">Video Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-url">Video URL</Label>
            <Input
              id="edit-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter video URL"
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Video'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};