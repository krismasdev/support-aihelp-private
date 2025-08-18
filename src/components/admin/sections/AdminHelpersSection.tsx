import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminCreateHelperDialog } from '@/components/admin/helpers/AdminCreateHelperDialog';
import { AdminEditHelperDialog } from '@/components/admin/helpers/AdminEditHelperDialog';
interface DefaultHelper {
  id: number;
  name: string;
  type: string;
  description: string;
  tone: string;
  interaction_style: string;
  focus: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const AdminHelpersSection = () => {
  const [helpers, setHelpers] = useState<DefaultHelper[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingHelper, setEditingHelper] = useState<DefaultHelper | null>(null);

  useEffect(() => {
    fetchHelpers();
  }, []);

  const fetchHelpers = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-admin-helpers');

      if (error) throw error;
      setHelpers(data?.data || []);
    } catch (error) {
      console.error('Error fetching helpers:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleEditHelper = (helper: DefaultHelper) => {
    setEditingHelper(helper);
    setShowEditDialog(true);
  };

  const handleEditComplete = () => {
    setShowEditDialog(false);
    setEditingHelper(null);
    fetchHelpers();
  };

  const handleToggleDefault = async (helperId: number, setAsDefault: boolean) => {
    try {
      const { data, error } = await supabase.functions.invoke('toggle-default-helper', {
        body: { helperId, setAsDefault }
      });

      if (error) throw error;
      
      // Refresh the helpers list to show updated default status
      fetchHelpers();
    } catch (error) {
      console.error('Error toggling default helper:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Default Helpers Management</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus size={16} className="mr-2" />
          Add Helper
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Helpers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{helpers.length}</p>
            <p className="text-sm text-gray-500">Default helpers available</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Helper Types</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{new Set(helpers.map(h => h.type)).size}</p>
            <p className="text-sm text-gray-500">Unique types</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Default Helpers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Tone</TableHead>
                <TableHead>Style</TableHead>
                <TableHead>Focus</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {helpers.map((helper) => (
                <TableRow key={helper.id}>
                  <TableCell className="font-medium">{helper.name}</TableCell>
                  <TableCell>{helper.type}</TableCell>
                  <TableCell className="max-w-xs truncate">{helper.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{helper.tone}</Badge>
                  </TableCell>
                  <TableCell>{helper.interaction_style}</TableCell>
                  <TableCell>{helper.focus}</TableCell>
                  <TableCell>{formatDate(helper.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditHelper(helper)}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AdminCreateHelperDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSave={() => {
          setShowCreateDialog(false);
          fetchHelpers();
        }}
      />

      <AdminEditHelperDialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onSave={handleEditComplete}
        helper={editingHelper}
      />
    </div>
  );
};
