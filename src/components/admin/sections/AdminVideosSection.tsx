import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Play } from 'lucide-react';

export const AdminVideosSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Videos Management</h1>
        <Button>
          <Plus size={16} className="mr-2" />
          Upload Video
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">156</p>
            <p className="text-sm text-gray-500">+8 this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12.4K</p>
            <p className="text-sm text-gray-500">+15% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Most Watched</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">Breathing Techniques</p>
            <p className="text-sm text-gray-500">2,341 views</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                  <Play size={16} />
                </div>
                <div>
                  <p className="font-medium">Mindfulness Meditation</p>
                  <p className="text-sm text-gray-500">Duration: 15:30</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                  <Play size={16} />
                </div>
                <div>
                  <p className="font-medium">Stress Management Tips</p>
                  <p className="text-sm text-gray-500">Duration: 12:45</p>
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