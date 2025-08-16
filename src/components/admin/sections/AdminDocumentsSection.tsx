import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';

export const AdminDocumentsSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Documents Management</h1>
        <Button>
          <Plus size={16} className="mr-2" />
          Upload Document
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">89</p>
            <p className="text-sm text-gray-500">+5 this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">3.2K</p>
            <p className="text-sm text-gray-500">+18% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Most Downloaded</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">Self-Care Guide</p>
            <p className="text-sm text-gray-500">456 downloads</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText size={20} className="text-blue-500" />
                <div>
                  <p className="font-medium">Mental Health Resources.pdf</p>
                  <p className="text-sm text-gray-500">Updated 2 days ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText size={20} className="text-blue-500" />
                <div>
                  <p className="font-medium">Coping Strategies Worksheet.pdf</p>
                  <p className="text-sm text-gray-500">Updated 1 week ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};