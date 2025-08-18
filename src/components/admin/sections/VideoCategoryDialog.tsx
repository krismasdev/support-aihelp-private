import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

interface VideoCategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface VideoCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: VideoCategory | null;
  onSuccess: () => void;
}

export const VideoCategoryDialog = ({ open, onOpenChange, category, onSuccess }: VideoCategoryDialogProps) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name || '');
    } else {
      setName('');
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name?.trim()) return;
    setLoading(true);
    try {
      if (category) {
        // Update existing category
        const { error } = await supabase.functions.invoke('update-video-category', {
          body: { 
            id: category.id, 
            name: name.trim()
          }
        });
        if (error) throw error;
      } else {
        // Create new category
        const { error } = await supabase.functions.invoke('create-video-category', {
          body: { 
            name: name.trim()
          }
        });
        if (error) throw error;
      }

      onSuccess();
      onOpenChange(false);
      setName('');
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name?.trim()}>
              {loading ? 'Saving...' : category ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};