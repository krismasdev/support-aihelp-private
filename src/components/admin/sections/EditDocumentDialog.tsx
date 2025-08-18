import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

interface EditDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    id: string;
    name: string;
    url: string;
    file_path: string;
  } | null;
  onUpdateSuccess: () => void;
}

export const EditDocumentDialog = ({
  open,
  onOpenChange,
  document,
  onUpdateSuccess,
}: EditDocumentDialogProps) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (document) {
      setName(document.name);
      setFile(null);
    }
  }, [document]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!document || !name.trim()) return;

    setLoading(true);
    try {
      let newUrl = document.url;
      let newFilePath = document.file_path;

      // If a new file is selected, upload it and delete the old one
      if (file) {
        // Upload new file
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `documents/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get new file URL
        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);

        newUrl = publicUrl;
        newFilePath = filePath;

        // Delete old file
        if (document.file_path) {
          await supabase.storage
            .from('documents')
            .remove([document.file_path]);
        }
      }

      // Update document record
      const { error } = await supabase
        .from('documents')
        .update({ 
          name: name.trim(),
          url: newUrl,
          file_path: newFilePath,
          updated_at: new Date().toISOString()
        })
        .eq('id', document.id);

      if (error) throw error;

      onUpdateSuccess();
      onOpenChange(false);
      setName('');
      setFile(null);
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Failed to update document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Document Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter document name"
              required
            />
          </div>
          <div>
            <Label htmlFor="file">Replace File (optional)</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            />
            {file && (
              <p className="text-sm text-gray-600 mt-1">
                New file: {file.name}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};