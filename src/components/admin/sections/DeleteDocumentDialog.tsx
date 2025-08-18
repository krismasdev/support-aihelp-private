import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Document {
  id: string;
  name: string;
  url: string;
  file_path: string;
  size: number;
  created_at: string;
  updated_at: string;
}

interface DeleteDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
  onDeleteSuccess: () => void;
}

export const DeleteDocumentDialog = ({ open, onOpenChange, document, onDeleteSuccess }: DeleteDocumentDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!document) return;
    
    setIsDeleting(true);
    try {
      // Delete from storage using file_path
      if (document.file_path) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([document.file_path]);
        
        if (storageError) {
          console.error('Storage deletion error:', storageError);
        }
      }
      
      // Delete from database
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', document.id);

      if (error) throw error;
      
      onDeleteSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatFileSize = (sizeInMB: number) => {
    return `${sizeInMB.toFixed(1)} MB`;
  };

  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Document
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. The document will be permanently removed from storage and the database.
          </DialogDescription>
        </DialogHeader>
        
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 rounded-lg p-2 flex-shrink-0">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{document.name}</p>
              <p className="text-sm text-gray-500">Size: {formatFileSize(document.size)}</p>
              <p className="text-sm text-gray-500">
                Created: {new Date(document.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Document'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};